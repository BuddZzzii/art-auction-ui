import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Visual Element */}
      <div className="text-9xl font-black text-slate-200 absolute select-none z-0">
        404
      </div>
      
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Oops! This artwork doesn't exist.
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          It seems you've wandered into an empty gallery. The page you're looking for has been moved or never existed.
        </p>
        
        <Link 
          to="/" 
          className="inline-block bg-amber-500 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition shadow-lg hover:shadow-amber-200/50"
        >
          Back to the Masterpieces
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;