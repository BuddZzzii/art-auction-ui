import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Buyer' 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(''); 

  // ⚡ NEW: The Microsoft-Grade Password Checker
  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return { text: '', color: '' };
    if (pass.length < 8) return { text: 'Password must be at least 8 characters.', color: 'text-red-500' };
    
    const hasLower = /[a-z]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass); // Checks for anything that isn't a letter or number

    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      return { 
        text: 'Weak: Must include uppercase, lowercase, number, and special character (!@#$).', 
        color: 'text-amber-500' 
      };
    }
    
    return { text: 'Strong password. Ready to go!', color: 'text-green-500' };
  };

  const strength = getPasswordStrength(formData.password);

  // ⚡ NEW: Dynamic border colors based on the strict strength meter
  let passwordBorder = "border-slate-300 focus:border-amber-500";
  if (formData.password.length > 0) {
    if (strength.color === 'text-green-500') {
      passwordBorder = "border-green-500 focus:ring-green-500";
    } else if (strength.color === 'text-amber-500') {
      passwordBorder = "border-amber-500 focus:ring-amber-500";
    } else {
      passwordBorder = "border-red-500 focus:ring-red-500";
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if ((name === 'firstName' || name === 'lastName') && value.length > 0) {
      finalValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setFormData({ ...formData, [name]: finalValue });
    
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (serverError) setServerError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let newErrors = {};
    setServerError(''); 

    // ⚡ NEW: Stop them before they hit the server if the password isn't green
    if (strength.color !== 'text-green-500') {
      newErrors.password = "Please meet all password requirements before registering.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match. Please try again.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; 
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: `${formData.firstName}${formData.lastName}`, 
        email: formData.email,
        password: formData.password,
        role: formData.role 
      });

      setShowToast(true);
      
      setTimeout(() => {
        navigate('/login', { 
          state: { message: "Registration successful! Please sign in." } 
        });
      }, 3500);

    } catch (err) {
      console.error("Registration failed:", err);
      const backendErrors = err.response?.data?.errors;
      
      if (Array.isArray(backendErrors)) {
        setServerError(backendErrors.join(" "));
      } else if (typeof backendErrors === 'object' && backendErrors !== null) {
        const errorMessages = Object.values(backendErrors).flat();
        setServerError(errorMessages.join(" "));
      } else {
        setServerError(err.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
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

        {serverError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-md mt-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{serverError}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">I want to register as a:</label>
              <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                <label className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all text-sm font-medium ${formData.role === 'Buyer' ? 'bg-white shadow text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Buyer"
                    checked={formData.role === 'Buyer'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Buyer
                </label>
                <label className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all text-sm font-medium ${formData.role === 'Artist' ? 'bg-white shadow text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Artist"
                    checked={formData.role === 'Artist'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Artist
                </label>
              </div>
            </div>

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
                  className={`appearance-none rounded block w-full pl-3 pr-16 py-2 border text-slate-900 focus:outline-none sm:text-sm transition-colors ${passwordBorder}`}
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-bold">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
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