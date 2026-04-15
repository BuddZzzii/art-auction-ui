import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Added useLocation
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Hook into the current location/state
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Extract the message if it exists
  const infoMessage = location.state?.message;

  const handleLogin = (e) => {
    e.preventDefault();
    
    console.log("Attempting login with:", { email, password });
    
    const fakeToken = "abc.123.vip.token";
    localStorage.setItem('token', fakeToken);

    const userName = email.split('@')[0]; 
    login({ name: userName, email: email });

    // 4. SMART REDIRECT: Go back to where you were, or home if you came here normally
    const origin = location.state?.from?.pathname || '/';
    navigate(origin);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* 🚀 THE MESSAGE BANNER: Only shows if the bouncer sent you here */}
        {infoMessage && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-blue-500">ℹ️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 font-medium">
                  {infoMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          Sign in to ArtAuction
        </h2>
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
                  type="email"
                  required
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
                  type="password"
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