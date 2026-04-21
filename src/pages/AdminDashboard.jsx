import React, { useState, useEffect } from 'react';
import api from '../services/api';

// ✅ IMAGE PIPELINE: The backend stores absolute URLs now (https://localhost:5000/uploads/abc.jpg).
// This helper is a safety net — if for any reason a relative path slips through,
// it prepends the API base URL so the <img> tag never gets a broken src.
const resolveImageUrl = (url) => {
  if (!url) return 'https://placehold.co/96x96?text=No+Image';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const AdminDashboard = () => {
  const [pendingArtworks, setPendingArtworks] = useState([]);
  const [pendingArtists, setPendingArtists] = useState([]);
  const [activeTab, setActiveTab] = useState('artworks');
  const [isLoading, setIsLoading] = useState(true);

  // ⚡ 1. Fetching data from your EXACT C# endpoints
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Matches [HttpGet("artworks/pending")]
      const artRes = await api.get('/admin/artworks/pending');
      // Matches [HttpGet("artists/pending")]
      const artistRes = await api.get('/admin/artists/pending');

      setPendingArtworks(artRes.data || []);
      setPendingArtists(artistRes.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // ⚡ 2. Artwork Actions (Approve / Reject)
  const handleArtAction = async (id, action) => {
    try {
      // Matches [HttpPut("artworks/{id}/approve")] and [HttpPut("artworks/{id}/reject")]
      await api.put(`/admin/artworks/${id}/${action}`);
      setPendingArtworks(prev => prev.filter(art => art.id !== id));
      alert(`Artwork ${action === 'approve' ? 'Approved' : 'Rejected'}`);
    } catch (err) {
      alert(`Failed to ${action} artwork.`);
    }
  };

  // ⚡ 3. Artist Actions (Approve / Reject)
  const handleArtistAction = async (id, action) => {
    try {
      // Matches [HttpPut("artists/{id}/approve")] and [HttpPut("artists/{id}/reject")]
      await api.put(`/admin/artists/${id}/${action}`);
      setPendingArtists(prev => prev.filter(user => user.id !== id));
      alert(`Artist account ${action === 'approve' ? 'Approved' : 'Rejected'}`);
    } catch (err) {
      alert(`Failed to ${action} artist.`);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-2xl font-black text-slate-400 animate-pulse">Syncing with Admin Controller...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header & Tab Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Command Center</h1>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('artworks')}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'artworks' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Artworks ({pendingArtworks.length})
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'artists' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Artists ({pendingArtists.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'artworks' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingArtworks.length === 0 ? (
                <div className="col-span-2 py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xl">
                  No pending artworks.
                </div>
              ) : (
                pendingArtworks.map(art => (
                  <div key={art.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-6 items-center">

                    {/* ✅ IMAGE PIPELINE: resolveImageUrl() handles both absolute and relative paths */}
                    <img
                      src={resolveImageUrl(art.images?.[0]?.imageUrl)}
                      className="w-24 h-24 rounded-2xl object-cover bg-slate-100"
                      alt={art.title || 'Artwork thumbnail'}
                      onError={(e) => {
                        // Graceful fallback if the file is missing on disk
                        e.currentTarget.src = 'https://placehold.co/96x96?text=No+Image';
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-900">{art.title}</h3>
                      <p className="text-slate-500 font-medium">Artist: {art.artist?.username || 'Unknown'}</p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleArtAction(art.id, 'approve')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold transition shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleArtAction(art.id, 'reject')}
                          className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingArtists.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xl">
                  No artists awaiting approval.
                </div>
              ) : (
                pendingArtists.map(user => (
                  <div key={user.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-2xl text-slate-900">{user.username}</h3>
                      <p className="text-slate-500 font-medium">{user.email}</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleArtistAction(user.id, 'reject')}
                        className="text-slate-400 font-bold hover:text-red-600 transition px-4"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleArtistAction(user.id, 'approve')}
                        className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg"
                      >
                        Approve Artist
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;