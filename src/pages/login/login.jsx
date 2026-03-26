import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Setup State for inputs, errors, and password visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); 

  // The Validation Logic
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password validation 
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    setErrors(newErrors);
    
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault(); 
    
    // Only navigate if validation passes
    if (validateForm()) {
      console.log('Logging in with:', email, password);
      navigate('/dashboard'); 
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      
      {/* Left Side - Dark Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#111111] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Circles  */}
        <div className="absolute rounded-full border border-yellow-500/50 w-[600px] h-[600px] -right-40 top-[100px] pointer-events-none"></div>
        <div className="absolute rounded-full border border-yellow-500/50 w-[550px] h-[550px] -right-20 bottom-[150px] pointer-events-none"></div>

        {/* Top: Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-md"></div>
          <div className="leading-tight">
            <p className="text-[10px] text-gray-400">Highly Succeed, Inc</p>
            <p className="font-bold text-lg tracking-wide">HRIS System</p>
          </div>
        </div>

        {/* Middle: Hero Text */}
        <div className="relative z-10 -mt-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-yellow-500"></div>
            <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase">HR Information System</p>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Manage your<br />
            Workforce<br />
            <span className="text-yellow-500">with ease</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mb-8">
            A unified platform for Attendance, Leave, Overtime, Tasks, and Company-wide communications - built for every employee
          </p>

          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>Real-time Attendance Tracking & Login</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>Leave credits, overtime & payroll visibility</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>Company Announcements and Company events</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>Task Management & employee directory</li>
          </ul>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 text-xs text-gray-500">
          Highly Succeed, Inc. All Rights Reserved
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 relative">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-[2px] bg-yellow-500"></div>
              <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase">Welcome Back</p>
            </div>
            <h2 className="text-4xl font-bold mb-2 text-gray-900">Login to<br/>your Account</h2>
            <p className="text-sm text-gray-400">Enter your credentials to access the HS system</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1 uppercase">Email Address</label>
              <div className="relative">
                <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: null}); 
                  }}
                  placeholder="yourname@highlysucceed.com" 
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm transition-colors ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-500'
                  }`}
                />
              </div>
              {/* Dynamic Error Message */}
              {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1 uppercase">Password</label>
              <div className="relative">
                <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: null}); 
                  }}
                  placeholder="Enter your Password" 
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm transition-colors ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-500'
                  }`}
                />

                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Dynamic Error Message */}
              {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                <span className="text-xs text-gray-500">Remember Me</span>
              </label>
              
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')} 
                className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                Forgot Password
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-black text-white font-semibold py-3 rounded-lg mt-6 relative overflow-hidden hover:bg-gray-900 transition-colors cursor-pointer">
              <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-400"></span>
              Login
            </button>
          </form>

          {/* IT Support */}
          <div className="mt-8 text-center">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-xs text-gray-400 absolute">or</span>
            </div>
            <p className="text-xs text-gray-500">
              Having Trouble Logging in?<br/>
              Please contact your <span className="font-bold text-gray-900">IT Support</span>
            </p>
          </div>

        </div>

        {/* Right Footer */}
        <div className="absolute bottom-8 text-xs text-gray-400">
          HS System v2.0
        </div>
      </div>
      
    </div>
  );
};

export default Login;