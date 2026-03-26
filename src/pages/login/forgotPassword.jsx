import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // State for our new direct-reset form
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password validation
    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters.';
    }

    // Confirm Password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Backend Request: Update password for', email);
      console.log('New Password to hash:', newPassword);
      
      // Show success screen
      setIsSuccess(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      
      {/* Left Side - Dark Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#111111] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute rounded-full border border-yellow-500/50 w-[600px] h-[600px] -right-40 top-[100px] pointer-events-none"></div>
        <div className="absolute rounded-full border border-yellow-500/50 w-[550px] h-[550px] -right-20 bottom-[150px] pointer-events-none"></div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-md"></div>
          <div className="leading-tight">
            <p className="text-[10px] text-gray-400">Highly Succeed, Inc</p>
            <p className="font-bold text-lg tracking-wide">HRIS System</p>
          </div>
        </div>

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

        <div className="relative z-10 text-xs text-gray-500">
          Highly Succeed, Inc. All Rights Reserved
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 relative">
        <div className="w-full max-w-md">
          
          {/* Back to Login Button */}
          {!isSuccess && (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 cursor-pointer font-medium"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          )}

          {!isSuccess ? (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-[2px] bg-yellow-500"></div>
                  <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase">Account Recovery</p>
                </div>
                <h2 className="text-4xl font-bold mb-3 text-gray-900">Reset your<br/>Password</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Enter your email address and create a new secure password for your account.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
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
                  {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.email}</p>}
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1 uppercase">New Password</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input 
                      type={showPasswords ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors({...errors, newPassword: null}); 
                      }}
                      placeholder="Enter new password" 
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm transition-colors ${
                        errors.newPassword 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-500'
                      }`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPasswords ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      )}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.newPassword}</p>}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1 uppercase">Confirm Password</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <input 
                      type={showPasswords ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({...errors, confirmPassword: null}); 
                      }}
                      placeholder="Confirm new password" 
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm transition-colors ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-500'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full bg-black text-white font-semibold py-3 rounded-lg mt-6 relative overflow-hidden hover:bg-gray-900 transition-colors cursor-pointer">
                  <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-400"></span>
                  Update Password
                </button>
              </form>
            </>
          ) : (
            //  SUCCESS MESSAGE
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Password Updated!</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Your password has been successfully changed in the system. You can now use your new password to log in.
              </p>
              
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#FFB300] hover:bg-[#FFA000] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Proceed to Login
              </button>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500">
              Need immediate access?<br/>
              Please contact your <span className="font-bold text-gray-900">IT Support</span>
            </p>
          </div>

        </div>

        <div className="absolute bottom-8 text-xs text-gray-400">
          HS System v2.0
        </div>
      </div>
      
    </div>
  );
};

export default ForgotPassword;