import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const DUMMY_ARTWORKS = [
  { id: 1, title: 'Midnight Mirage', artist: 'Elena Rostova', currentBid: 450, timeLeft: '2h 15m', color: 'from-blue-500 to-purple-600', description: 'A stunning digital representation of the exact moment twilight surrenders to the midnight sky. Features intricate fractal geometry.' },
  { id: 2, title: 'Golden Hour', artist: 'Marcus Chen', currentBid: 890, timeLeft: '4h 30m', color: 'from-amber-400 to-orange-500', description: 'A warm, sweeping landscape of abstract shapes catching the final rays of a synthetic sun.' },
  { id: 3, title: 'Urban Echo', artist: 'Sarah Jenkins', currentBid: 120, timeLeft: '15m', color: 'from-emerald-400 to-teal-500', description: 'A visualization of city noise and traffic patterns translated into a serene, flowing visual matrix.' },
  { id: 4, title: 'Crimson Tide', artist: 'David Omar', currentBid: 2100, timeLeft: '1d 2h', color: 'from-red-500 to-rose-600', description: 'An aggressive, powerful piece exploring the boundaries of color theory and emotional response.' },
];

const ArtworkDetailsPage = () => {
  const { id } = useParams(); 
  const artwork = DUMMY_ARTWORKS.find(art => art.id === parseInt(id));
  
  const [bidAmount, setBidAmount] = useState('');
  
  // NEW: State to hold our Toast Notification data
  const [toast, setToast] = useState({ show: false, amount: 0 });

  const handleBidSubmit = (e) => {
    e.preventDefault();
    
    // 1. Fire the Toast Notification and pass in the exact bid amount
    setToast({ show: true, amount: bidAmount });
    
    // 2. Clear the input box to give the user physical UI feedback
    setBidAmount('');

    // 3. Hide the Toast automatically after 3 seconds
    setTimeout(() => {
      setToast({ show: false, amount: 0 });
    }, 3000);
  };

  if (!artwork) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Artwork Not Found</h1>
        <Link to="/" className="text-amber-500 hover:text-amber-600 underline">Return to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* THE NEW DYNAMIC BIDDING TOAST */}
      {toast.show && (
        <div className="absolute top-10 right-10 md:right-10 left-10 md:left-auto bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in-down z-50 border-l-4 border-amber-500">
          <p className="text-lg font-extrabold flex items-center gap-2">
            Bid Placed Successfully! 🔨
          </p>
          <p className="text-sm font-medium mt-1 text-slate-300">
            You are now the highest bidder at <span className="text-amber-400 text-base border-b border-amber-400 pb-0.5">${toast.amount}</span>.
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          <div className={`md:w-1/2 h-96 md:h-auto bg-gradient-to-br ${artwork.color}`}></div>
          
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="uppercase tracking-wide text-sm text-amber-500 font-semibold mb-1">Lot #{artwork.id}</div>
              <h1 className="mt-1 text-4xl font-extrabold text-slate-900">{artwork.title}</h1>
              <p className="mt-2 text-lg text-slate-500 border-b border-slate-200 pb-6">by {artwork.artist}</p>
              
              <p className="mt-6 text-slate-700 leading-relaxed">
                {artwork.description}
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm text-slate-500 uppercase font-semibold">Current Bid</p>
                  <p className="text-3xl font-bold text-slate-900">${artwork.currentBid}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase font-semibold">Time Remaining</p>
                  <p className="text-xl font-bold text-red-500 mt-1">{artwork.timeLeft}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBidSubmit} className="mt-8 pt-8 border-t border-slate-200 flex gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-lg">$</span>
                </div>
                <input
                  type="number"
                  min={artwork.currentBid + 1}
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="block w-full pl-8 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-lg font-medium"
                  placeholder={`Min bid: $${artwork.currentBid + 1}`}
                />
              </div>
              <button
                type="submit"
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-md"
              >
                Place Bid
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailsPage;