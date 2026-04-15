import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // NEW: State to hold our active error messages
  const [errors, setErrors] = useState({});

  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return { text: '', color: '' };
    if (pass.length < 8) return { text: 'Password must be at least 8 characters.', color: 'text-red-500' };
    if (/^[a-zA-Z]+$/.test(pass) || /^[0-9]+$/.test(pass)) {
      return { text: 'Weak: Add numbers or symbols.', color: 'text-amber-500' };
    }
    return { text: 'Strong password.', color: 'text-green-500' };
  };

  const strength = getPasswordStrength(formData.password);

  let passwordBorder = "border-slate-300 focus:border-amber-500";
  if (formData.password.length > 0) {
    passwordBorder = formData.password.length >= 8 
      ? "border-green-500 focus:ring-green-500" 
      : "border-red-500 focus:ring-red-500";
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if ((name === 'firstName' || name === 'lastName') && value.length > 0) {
      finalValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setFormData({ ...formData, [name]: finalValue });
    
    // As soon as the user starts typing in a box, clear the red error for that box!
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    let newErrors = {};

    // 1. Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match. Please try again.";
    }
    
    // 2. Check if password is long enough
    if (formData.password.length < 8) {
      newErrors.password = "Your password must be at least 8 characters.";
    }

    // If we found ANY errors, stop the form and display the red text
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; 
    }

    // If everything is perfect, trigger the success flow!
    console.log("Sending to Database:", formData);
    setShowToast(true);
    
    // Wait 3.5 seconds so they can read the new message, then teleport
    setTimeout(() => {
      navigate('/login');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* THE UPGRADED TOAST NOTIFICATION */}
      {showToast && (
        <div className="absolute top-10 right-10 md:right-10 left-10 md:left-auto bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce transition-all z-50">
          <p className="text-lg font-extrabold flex items-center gap-2">
            Registration Successful! 🎉
          </p>
          <p className="text-sm font-medium mt-1 text-green-100">
            Redirecting you to log in with your new credentials...
          </p>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Create an Account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 appearance-none rounded block w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:ring-amber-500 sm:text-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 appearance-none rounded block w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:ring-amber-500 sm:text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 appearance-none rounded block w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:ring-amber-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`appearance-none rounded block w-full pl-3 pr-16 py-2 border text-slate-900 focus:outline-none sm:text-sm transition-colors ${errors.password ? 'border-red-500 focus:ring-red-500' : passwordBorder}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-slate-500 hover:text-slate-700 font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              
              {/* If there is a hard error, show it. Otherwise show the strength meter */}
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1 font-bold">{errors.password}</p>
              ) : formData.password ? (
                <p className={`text-xs mt-1 font-medium ${strength.color}`}>
                  {strength.text}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className={`mt-1 appearance-none rounded block w-full px-3 py-2 border text-slate-900 focus:outline-none sm:text-sm transition-colors ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500'}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {/* THE NEW ACTIVE ERROR MESSAGE */}
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-bold">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            {/* The button is ALIVE again! */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition shadow"
            >
              Register
            </button>
          </div>
          
          <div className="text-center mt-4">
             <Link to="/login" className="text-sm text-amber-600 hover:text-amber-500 font-medium">
               Already have an account? Sign in here.
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;