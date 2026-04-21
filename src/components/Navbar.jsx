import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold text-amber-400">
              ArtAuction
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-amber-400 transition text-sm font-medium">
              Browse Artworks
            </Link>

            {user ? (
              <div className="flex items-center space-x-6">
                
                {/* 1. SEEN BY EVERYONE LOGGED IN */}
                <Link to="/dashboard" className="text-sm font-medium hover:text-amber-400 transition">
                  My Dashboard
                </Link>

                {/* 2. 👑 SEEN BY ADMINS ONLY */}
                {user.role === 'Admin' && (
                  <Link to="/admin" className="text-sm font-bold text-red-400 hover:text-red-300 transition px-2 py-1 bg-red-950/50 rounded border border-red-900/50">
                    Admin Panel
                  </Link>
                )}

                {/* 3. 🎨 SEEN BY ARTISTS ONLY */}
                {user.role === 'Artist' && (
                  <Link to="/upload" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition">
                    Upload Artwork
                  </Link>
                )}

                {/* 4. 🛒 SEEN BY BUYERS & ARTISTS (Not Admins) */}
                {(user.role === 'Buyer' || user.role === 'Artist') && (
                  <Link to="/watchlist" className="text-sm font-medium hover:text-amber-400 transition">
                    Watchlist
                  </Link>
                )}

                <div className="flex items-center space-x-4 pl-4 border-l border-slate-700">
                  <span className="text-amber-200 font-medium capitalize text-sm">
                    Hi, {user.name}! 
                    {/* Optional: Show their role as a tiny badge so they know it worked */}
                    <span className="ml-2 text-[10px] uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </span>
                  <button 
                    onClick={logout}
                    className="px-4 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div> 
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;