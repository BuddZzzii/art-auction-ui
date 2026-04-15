import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth(); // We only need user and logout here

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
            <Link to="/" className="hover:text-amber-400 transition">
              Browse Artworks
            </Link>

            {/* If user is logged in, show their name. If not, show the Login Link */}
            {user ? (
              <div className="flex items-center space-x-6">
                
                {/* 🌟 THE NEW DASHBOARD LINK */}
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium hover:text-amber-400 transition"
                >
                  My Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-amber-200 font-medium capitalize">
                    Hi, {user.name}!
                  </span>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition text-sm"
                 >
                  Logout
                  </button>
                </div>
               </div> 
            ) : (
              /* Show this only if logged out */
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