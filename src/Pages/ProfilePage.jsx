import React, { useState, useEffect } from 'react'; // Added useEffect and useState
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // Import your new "Waiter"

const ProfilePage = () => {
  const { user } = useAuth();
  
  // 1. Create memory for our stats (Start them at 0 or null)
  const [stats, setStats] = useState({
    activeBids: 0,
    itemsWon: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. The Trigger: This runs ONCE when the page loads
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        // This is the actual "Phone Call" to Boda's backend
        const response = await api.get('/user/stats'); 
        setStats(response.data); // Save the real numbers into memory
        setError(null);
      } catch (err) {
        console.error("Backend Error:", err);
        setError("Could not connect to the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []); // The empty [] means "Only run this once"

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        
        {/* Profile Header */}
        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-100">
          <div className="h-24 w-24 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-black">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900">User Dashboard</h1>
            <p className="text-lg text-slate-500">
              Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span>
            </p>
          </div>
        </div>

        {/* 3. Logic: Show a message if the backend is down */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            ⚠️ {error} (Check if the .NET API is running!)
          </div>
        )}

        {/* Stats Grid - Now using the REAL stats from state */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Bids</h4>
            <p className="text-4xl font-black mt-2">
              {loading ? "..." : stats.activeBids}
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Won Items</h4>
            <p className="text-4xl font-black mt-2 text-amber-500">
              {loading ? "..." : stats.itemsWon}
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Balance</h4>
            <p className="text-4xl font-black mt-2 text-green-600">
              {loading ? "..." : `$${stats.balance}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;