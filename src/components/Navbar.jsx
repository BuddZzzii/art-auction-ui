import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
            <Link to="/login" className="px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition">
              Login
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;