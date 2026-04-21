import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  
  // The State and API Logic
  const [stats, setStats] = useState({
    activeBids: 0,
    itemsWon: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        // Calling the C# API
        const response = await api.get('/user/stats'); 
        setStats(response.data); 
        setError(null);
      } catch (err) {
        console.error("Backend Error:", err);
        setError("Could not connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    // Only run if we actually have a logged-in user
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  // Static placeholders for now until the backend has endpoints for these
  const favorites = [
    { id: 1, title: 'Mystic Nature', artist: 'Zeyad Ali', price: '$1,200', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300' },
    { id: 2, title: 'Ocean Breeze', artist: 'Mariam Soliman', price: '$950', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300' },
    { id: 3, title: 'Urban Chaos', artist: 'Peter John', price: '$2,100', img: 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=300' },
  ];

  if (!user) return <div className="p-10 text-center font-bold">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-slate-100 flex flex-col md:flex-row items-center gap-6">
          <div className="h-24 w-24 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg tracking-widest">
            {getInitials(user.name)}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
            <p className="text-slate-500 font-medium">✨ {user.role} • Member since April 2026</p>
          </div>
          <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-slate-800 transition">Edit Profile</button>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium shadow-sm">
            ⚠️ {error} (Check if the .NET API is running!)
          </div>
        )}

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-amber-500">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bids</p>
            <p className="text-2xl font-black text-slate-900">{loading ? "..." : stats.activeBids}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-slate-900">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Won Items</p>
            <p className="text-2xl font-black text-slate-900">{loading ? "..." : stats.itemsWon}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-emerald-500">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Balance</p>
            <p className="text-2xl font-black text-slate-900">{loading ? "..." : `$${stats.balance}`}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-b-4 border-rose-500">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</p>
            <p className="text-xl font-black text-slate-900 mt-1 uppercase">{user.role}</p>
          </div>
        </div>

        {/* Recent Activity and Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-5 flex justify-between items-center">
                <h2 className="text-white font-bold">My Recent Activity</h2>
                <span className="text-slate-400 text-xs cursor-pointer hover:text-white underline">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-500 text-xs uppercase font-bold text-left">
                      <th className="px-6 py-4">Artwork</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Your Bid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'Golden Hour', status: 'Leading', price: '$850', color: 'bg-emerald-100 text-emerald-700' },
                      { name: 'Midnight Mirage', status: 'Outbid', price: '$400', color: 'bg-rose-100 text-rose-700' },
                      { name: 'The Silent Sea', status: 'Ended', price: '$1,200', color: 'bg-slate-100 text-slate-600' }
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition cursor-pointer">
                        <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className={`${item.color} px-3 py-1 rounded-lg text-[10px] font-black uppercase`}>{item.status}</span>
                        </td>
                        <td className="px-6 py-4 text-amber-600 font-black">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="text-rose-500">❤️</span> My Favorites
            </h3>
            {favorites.map((art) => (
              <div key={art.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 hover:scale-105 transition-transform cursor-pointer">
                <img src={art.img} alt={art.title} className="w-20 h-20 rounded-xl object-cover shadow-inner" />
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-slate-900 text-sm">{art.title}</h4>
                  <p className="text-xs text-slate-500">by {art.artist}</p>
                  <p className="text-amber-600 font-black text-sm mt-1">{art.price}</p>
                </div>
              </div>
            ))}
            
            {/* ⚡ THE UPGRADED BROWSE BUTTON */}
            <Link to="/" className="block bg-amber-100 border-2 border-dashed border-amber-300 p-4 rounded-2xl text-center cursor-pointer hover:bg-amber-200 transition">
              <p className="text-amber-700 font-bold text-sm">+ Browse More Art</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;