import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Grab the message and the "from" path from the redirect luggage
  const message = location.state?.message;
  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 2. Dynamic Name Logic: Extract "Nouny" from "nouny@test.com"
    const extractedName = email.split('@')[0]; 
    const capitalizedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

    const userData = { 
      name: capitalizedName,
      email: email,
      token: "abc.123.vip.token" 
    };

    // 3. Update the app state and navigate back
    login(userData);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Sign in to ArtAuction
        </h2>
        
        {/* 🌟 THE PULSING BLUE MESSAGE BOX */}
        {message && (
          <div className="mt-4 mx-auto w-full max-w-md bg-blue-50 border-l-4 border-blue-400 p-4 shadow-md animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Info Icon SVG */}
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 font-medium">
                  {message} 🎨
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email (e.g. Noureen@test.com)"
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
              >
                Sign In
              </button>
            </div>
            
            <div className="text-center mt-4 border-t border-slate-200 pt-4">
              <Link to="/register" className="text-sm text-amber-600 hover:text-amber-500 font-medium">
                Don't have an account? Sign up here.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;