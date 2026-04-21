import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

// ✅ IMAGE PIPELINE: Safety net for relative paths (same pattern as AdminDashboard)
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ArtworkDetailsPage = () => {
  const { id } = useParams();

  const [artwork, setArtwork]       = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [pageError, setPageError]   = useState(null);

  const [bidAmount, setBidAmount]   = useState('');
  // ✅ FIX BUG 2: minimumNextBid is the SINGLE source of truth for what the
  // next bid must be. It is seeded from the artwork on load, then updated
  // from the server's response after every successful bid — never calculated
  // client-side by adding 1 or 10 to a string.
  const [minimumNextBid, setMinimumNextBid] = useState(0);

  // ✅ FIX BUG 3: Replaced all alert() calls with these two toast states.
  const [successToast, setSuccessToast]   = useState({ show: false, amount: 0 });
  const [errorToast, setErrorToast]       = useState({ show: false, message: '' });

  const showError = (message) => {
    setErrorToast({ show: true, message });
    setTimeout(() => setErrorToast({ show: false, message: '' }), 4000);
  };

  const showSuccess = (amount) => {
    setSuccessToast({ show: true, amount });
    setTimeout(() => setSuccessToast({ show: false, amount: 0 }), 3000);
  };

  // ✅ FIX BUG 1 + BUG 2: fetchArtwork is extracted so it can be re-called
  // after a successful bid to get the canonical price from the database.
  const fetchArtwork = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/artworks/${id}`);
      const data = response.data;
      setArtwork(data);

      // ✅ FIX BUG 2: Seed the minimum from the server on page load.
      // currentHighestBid + $10, or initialPrice if no bids yet.
      // Number() ensures we are always working with a real number, never a string.
      const currentBid = Number(data.currentHighestBid ?? data.currentBid ?? 0);
      const initialPrice = Number(data.initialPrice ?? 0);
      setMinimumNextBid(currentBid > 0 ? currentBid + 10 : initialPrice);

      setPageError(null);
    } catch (err) {
      console.error('Error fetching artwork:', err);
      setPageError('Artwork not found or could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchArtwork(); }, [fetchArtwork]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    // ✅ FIX BUG 2: parseFloat guarantees a real number.
    // "45" → 45. Never "45" + 1 = "451".
    const numericBid = parseFloat(bidAmount);

    if (isNaN(numericBid)) {
      showError('Please enter a valid bid amount.');
      return;
    }

    // Client-side pre-check using the server-synced minimumNextBid
    if (numericBid < minimumNextBid) {
      showError(`Your bid must be at least $${minimumNextBid.toFixed(2)}.`);
      return;
    }

    try {
      const response = await api.post('/bids', {
        artworkId: id,
        amount: numericBid,
      });

      const { currentBid, minimumNextBid: nextMin } = response.data;

      // ✅ FIX BUG 1: Update the displayed price from the server's confirmed value,
      // not from what the user typed. They should match, but the server is the truth.
      setArtwork(prev => ({
        ...prev,
        currentHighestBid: currentBid,
        currentBid: currentBid,
      }));

      // ✅ FIX BUG 2: Update the minimum for the NEXT bid from the server's response.
      // This is the only place minimumNextBid is ever updated — always from the backend.
      setMinimumNextBid(Number(nextMin));

      setBidAmount('');
      showSuccess(numericBid);

    } catch (err) {
      console.error('Bidding failed:', err);
      // ✅ FIX BUG 3: Show the server's error message inline, not in a browser alert.
      const serverMessage = err.response?.data?.message ?? 'Failed to place bid. Please try again.';
      showError(serverMessage);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <p className="text-xl font-bold text-slate-500 animate-pulse">Loading masterpiece...</p>
    </div>
  );

  if (pageError || !artwork) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Artwork Not Found</h1>
      <p className="text-slate-500 mb-6">{pageError}</p>
      <Link to="/" className="text-amber-500 hover:text-amber-600 underline font-medium">
        Return to Gallery
      </Link>
    </div>
  );

  // ✅ DATA EXTRACTION: Number() on every price field so arithmetic is always
  // number + number, never string + number.
  const displayImage  = resolveImageUrl(
    artwork.primaryImageUrl ?? artwork.imageUrl ?? artwork.images?.[0]?.imageUrl ?? null
  );
  const displayArtist = artwork.artist?.username ?? artwork.artistName ?? 'Unknown Artist';

  // ✅ FIX BUG 2: displayPrice is the confirmed current bid shown in the UI.
  // minimumNextBid (state) drives the <input min> and the placeholder.
  const displayPrice  = Number(artwork.currentHighestBid ?? artwork.currentBid ?? artwork.initialPrice ?? 0);
  const auctionEnd    = artwork.auctionEndTime
    ? new Date(artwork.auctionEndTime).toLocaleDateString()
    : 'TBD';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* ✅ FIX BUG 3: SUCCESS TOAST — replaces the alert("Bid Placed") */}
      {successToast.show && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl z-50 border-l-4 border-amber-500 transition-all">
          <p className="text-lg font-extrabold flex items-center gap-2">
            Bid Placed! 🔨
          </p>
          <p className="text-sm font-medium mt-1 text-slate-300">
            You are now the highest bidder at{' '}
            <span className="text-amber-400 text-base border-b border-amber-400 pb-0.5">
              ${successToast.amount.toFixed(2)}
            </span>.
          </p>
        </div>
      )}

      {/* ✅ FIX BUG 3: ERROR TOAST — replaces the alert("Failed...") */}
      {errorToast.show && (
        <div className="fixed top-6 right-6 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 border-l-4 border-red-300 transition-all">
          <p className="text-lg font-extrabold">Bid Failed ⚠️</p>
          <p className="text-sm font-medium mt-1 text-red-100">{errorToast.message}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* Image Panel */}
          <div className="md:w-1/2 h-96 md:h-auto bg-slate-200 relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt={artwork.title}
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                No Image Available
              </div>
            )}
          </div>

          {/* Detail & Bid Panel */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="uppercase tracking-wide text-sm text-amber-500 font-semibold mb-1">
                Lot #{artwork.id.toString().substring(0, 8)}
              </div>
              <h1 className="mt-1 text-4xl font-extrabold text-slate-900">
                {artwork.title || 'Untitled'}
              </h1>
              <p className="mt-2 text-lg text-slate-500 border-b border-slate-200 pb-6">
                by {displayArtist}
              </p>

              <p className="mt-6 text-slate-700 leading-relaxed">
                {artwork.description || 'No description provided.'}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm text-slate-500 uppercase font-semibold">Current Bid</p>
                  {/* ✅ FIX BUG 2: displayPrice is a Number, so toFixed(2) always works */}
                  <p className="text-3xl font-bold text-slate-900">${displayPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase font-semibold">Auction Ends</p>
                  <p className="text-xl font-bold text-red-500 mt-1">{auctionEnd}</p>
                </div>
              </div>

              {/* ✅ FIX BUG 2: Show the minimum next bid so the user is never surprised */}
              <p className="mt-3 text-xs text-slate-400 font-medium">
                Minimum next bid:{' '}
                <span className="text-slate-600 font-bold">${minimumNextBid.toFixed(2)}</span>
                {' '}(increments of $10)
              </p>
            </div>

            {/* Bid Form */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <form onSubmit={handleBidSubmit} className="flex gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-lg">$</span>
                  </div>
                  <input
                    type="number"
                    // ✅ FIX BUG 2: min is the server-synced minimumNextBid (a real number),
                    // not displayPrice + 1 (which was wrong in both value and type).
                    min={minimumNextBid}
                    step="0.01"
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="block w-full pl-8 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-lg font-medium"
                    placeholder={`Min: $${minimumNextBid.toFixed(2)}`}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-md whitespace-nowrap"
                >
                  Place Bid
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailsPage;