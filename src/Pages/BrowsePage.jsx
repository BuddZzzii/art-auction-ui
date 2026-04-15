import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DUMMY_ARTWORKS = [
  { id: 1, title: 'Midnight Mirage', artist: 'Elena Rostova', currentBid: 450, timeLeft: '2h 15m', color: 'from-blue-500 to-purple-600' },
  { id: 2, title: 'Golden Hour', artist: 'Marcus Chen', currentBid: 890, timeLeft: '4h 30m', color: 'from-amber-400 to-orange-500' },
  { id: 3, title: 'Urban Echo', artist: 'Sarah Jenkins', currentBid: 120, timeLeft: '15m', color: 'from-emerald-400 to-teal-500' },
  { id: 4, title: 'Crimson Tide', artist: 'David Omar', currentBid: 2100, timeLeft: '1d 2h', color: 'from-red-500 to-rose-600' },
];

const BrowsePage = () => {
  // 1. The Control Panel States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');

  // 2. The Real-Time Data Pipeline (Derived State)
  // We chain the filter() and sort() methods together to create the exact array we want to draw.
  let processedArtworks = DUMMY_ARTWORKS.filter((art) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      art.title.toLowerCase().includes(lowerSearch) ||
      art.artist.toLowerCase().includes(lowerSearch)
    );
  });

  // Apply the Sorting Algorithm
  if (sortOption === 'price-asc') {
    processedArtworks.sort((a, b) => a.currentBid - b.currentBid);
  } else if (sortOption === 'price-desc') {
    processedArtworks.sort((a, b) => b.currentBid - a.currentBid);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Live Auctions</h1>
            <p className="mt-2 text-sm text-slate-600">Bid on exclusive digital and physical assets.</p>
          </div>
          
          {/* THE NEW TOGGLE BUTTON */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-4 py-2 font-medium rounded shadow-sm transition flex items-center gap-2 ${isFilterOpen ? 'bg-amber-500 text-slate-900' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            {isFilterOpen ? 'Close Controls' : 'Filter & Sort'}
          </button>
        </div>

        {/* THE SLIDING CONTROL PANEL */}
        {isFilterOpen && (
          <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-slate-100 flex flex-col md:flex-row gap-4 animate-fade-in-down transition-all">
            
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Search Artworks</label>
              <input 
                type="text" 
                placeholder="Search by title or artist..." 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-sm text-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:w-64">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Sort By</label>
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

        {/* Status Message if Search yields nothing */}
        {processedArtworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-500 font-medium">No artworks found matching your criteria.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSortOption('default'); }}
              className="mt-4 text-amber-600 hover:text-amber-500 font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* The Art Grid (Now using our processed data!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processedArtworks.map((art) => (
            <div key={art.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
              
              <div className={`h-48 w-full bg-gradient-to-br ${art.color}`}></div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 truncate">{art.title}</h3>
                <p className="text-sm text-slate-500 mb-4">by {art.artist}</p>
                
                <div className="flex justify-between items-center mt-auto mb-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Current Bid</p>
                    <p className="text-lg font-bold text-amber-500">${art.currentBid}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Ends In</p>
                    <p className="text-sm font-medium text-red-500">{art.timeLeft}</p>
                  </div>
                </div>

                <Link to={`/artwork/${art.id}`} className="block w-full text-center py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition font-medium">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BrowsePage;