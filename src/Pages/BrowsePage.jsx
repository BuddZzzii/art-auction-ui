import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ✅ IMAGE PIPELINE: Same safety-net helper used across all pages
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const BrowsePage = () => {
  const { user } = useAuth();

  // Real data from DB
  const [artworks, setArtworks]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError]     = useState(null);

  // Control panel
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [sortOption, setSortOption]     = useState('default');

  // Watchlist
  const [watchlist, setWatchlist] = useState(new Set());

  // ✅ FIX BUG 1: fetchArtworks is a named function so we can call it on mount
  // AND whenever we need a fresh read (e.g. after returning from the detail page).
  // React re-fetches on every BrowsePage mount, so navigating back always shows
  // the price that was last written to the DB by PlaceBid.
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/artworks');
        console.log('BACKEND DATA:', response.data);
        setArtworks(response.data);
        setDbError(null);
      } catch (err) {
        console.error('Backend Error:', err);
        setDbError('Could not connect to the database to load artworks.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, []); // Runs on every mount — intentional so back-navigation triggers a fresh read

  const toggleFavorite = async (artworkId) => {
    if (!user) {
      // ✅ FIX BUG 3: No alert() here either — use an inline state if needed,
      // but for watchlist the safest UX is a console note + no-op.
      console.warn('Must be logged in to favourite an artwork.');
      return;
    }

    const newWatchlist = new Set(watchlist);
    const isAdding = !newWatchlist.has(artworkId);
    isAdding ? newWatchlist.add(artworkId) : newWatchlist.delete(artworkId);
    setWatchlist(newWatchlist); // Optimistic update

    try {
      if (isAdding) {
        await api.post('/watchlist', { artworkId });
      } else {
        await api.delete(`/watchlist/${artworkId}`);
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
      // Revert on failure
      setWatchlist(new Set(watchlist));
    }
  };

  // Normalise whatever shape the API returns
  const safeArtworks = Array.isArray(artworks)
    ? artworks
    : (artworks?.items ?? artworks?.data ?? []);

  let processedArtworks = safeArtworks.filter((art) => {
    const lower       = searchTerm.toLowerCase();
    const titleMatch  = art.title?.toLowerCase().includes(lower) ?? false;
    const artistName  = art.artistName ?? art.artist?.username ?? art.artist ?? '';
    const artistMatch = artistName.toLowerCase().includes(lower);
    return titleMatch || artistMatch;
  });

  // ✅ FIX BUG 2: Number() coercion before sort arithmetic.
  // Prevents "20" > "9" being evaluated as a string comparison.
  const getPrice = (art) =>
    Number(art.currentHighestBid ?? art.currentBid ?? art.highestBid ?? art.initialPrice ?? art.startingBid ?? 0);

  if (sortOption === 'price-asc')  processedArtworks.sort((a, b) => getPrice(a) - getPrice(b));
  if (sortOption === 'price-desc') processedArtworks.sort((a, b) => getPrice(b) - getPrice(a));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Live Auctions</h1>
            <p className="mt-2 text-sm text-slate-600">Bid on exclusive digital and physical assets.</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-4 py-2 font-medium rounded shadow-sm transition flex items-center gap-2 ${
              isFilterOpen
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {isFilterOpen ? 'Close Controls' : 'Filter & Sort'}
          </button>
        </div>

        {/* Database Error */}
        {dbError && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium shadow-sm">
            ⚠️ {dbError}
          </div>
        )}

        {/* Filter/Sort Panel */}
        {isFilterOpen && (
          <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-slate-100 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Search Artworks
              </label>
              <input
                type="text"
                placeholder="Search by title or artist..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm text-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-64">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Sort By
              </label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm text-slate-900 bg-white"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-500 font-bold animate-pulse">
              Loading gallery from database...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && processedArtworks.length === 0 && !dbError && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
            <p className="text-lg text-slate-500 font-medium">No artworks found.</p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setSortOption('default'); }}
                className="mt-4 text-amber-600 hover:text-amber-500 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Art Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processedArtworks.map((art) => {
            const rawImage    = art.primaryImageUrl ?? art.imageUrl ?? art.images?.[0]?.imageUrl ?? null;
            const displayImage  = resolveImageUrl(rawImage);
            const displayArtist = art.artistName ?? art.artist?.username ?? art.artist ?? 'Unknown Artist';

            // ✅ FIX BUG 1 + BUG 2: getPrice() always returns a proper Number.
            // Because PlaceBid now writes currentHighestBid to the DB, re-fetching
            // on mount will return the winning bid price, not the stale initialPrice.
            const displayPrice  = getPrice(art);

            return (
              <div
                key={art.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col relative"
              >
                {/* Thumbnail */}
                <div className="h-48 w-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={art.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-slate-400 font-medium text-xs">No Image Available</span>
                  )}
                </div>

                {/* Heart / Watchlist Button */}
                <button
                  onClick={() => toggleFavorite(art.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center group"
                  title="Add to Favorites"
                >
                  {watchlist.has(art.id) ? (
                    <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 truncate">{art.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">by {displayArtist}</p>

                  <div className="flex justify-between items-center mt-auto mb-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">Current Bid</p>
                      {/* ✅ FIX BUG 2: toFixed(2) only works reliably when displayPrice is a Number */}
                      <p className="text-lg font-bold text-amber-500">${displayPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <Link
                    to={`/artwork/${art.id}`}
                    className="block w-full text-center py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default BrowsePage;