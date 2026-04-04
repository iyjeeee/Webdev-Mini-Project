import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import ValidationModal from '../../components/ValidationModal.jsx';

const ForgotPassword = () => {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false); // show success/info state
  const [loading,   setLoading]   = useState(false);
  // ValidationModal state — for client-side validation errors
  const [valModal, setValModal] = useState({ isOpen: false, type: 'error', title: '', messages: [] });

  // Schema v2 note: password_reset_tokens table was removed
  // Password resets are handled manually via IT support
  // This form no longer calls the API — it just shows an IT contact message
  const handleSubmit = (e) => {
    e.preventDefault();
    // Client-side validation — show modal if email is empty or invalid
    if (!email.trim()) {
      setValModal({ isOpen: true, type: 'error', title: 'Email Required', messages: ['Please enter your company email address.'] });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValModal({ isOpen: true, type: 'error', title: 'Invalid Email', messages: ['Please enter a valid email address.'] });
      return;
    }
    setLoading(true);
    // Simulate brief loading for UX then show IT support message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex">

      {/* Left dark panel — mirrors login page branding */}
      <div className="hidden lg:flex lg:w-[48%] bg-[#111111] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[560px] h-[560px] rounded-full border border-[#FBC02D]/20 pointer-events-none" />
        <div className="absolute top-[-50px] right-[-50px] w-[400px] h-[400px] rounded-full border border-[#FBC02D]/12 pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-[#FBC02D] rounded-lg flex items-center justify-center shrink-0 shadow-md">
            <span className="text-black font-black text-sm leading-none">HS</span>
          </div>
          <div className="leading-tight">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Highly Succeed, Inc</p>
            <p className="text-white font-bold text-base leading-none">HRIS System</p>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-[#FBC02D]" />
            <span className="text-[10px] font-bold text-[#FBC02D] uppercase tracking-[0.25em]">Account Support</span>
          </div>
          <h1 className="text-4xl font-black text-white leading-[1.1]">
            Need help with<br />your account?<br />
            <span className="text-[#FBC02D]">We've got you.</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            For password resets and account access issues, please reach out to your IT Support team directly.
          </p>
        </div>

        <p className="text-[11px] text-gray-600 relative z-10">Highly Succeed, Inc. All Rights Reserved</p>
      </div>

      {/* Right white form panel */}
      <div className="flex-1 bg-white flex flex-col justify-between px-8 py-10 sm:px-12 lg:px-16">
        <div />

        <div className="w-full max-w-md mx-auto">

          {/* Label */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px bg-[#FBC02D]" />
            <span className="text-[10px] font-bold text-[#FBC02D] uppercase tracking-[0.25em]">Password Recovery</span>
          </div>

          <h2 className="text-4xl font-black text-[#111111] leading-[1.1] mb-1.5">
            Reset<br />Password
          </h2>

          {submitted ? (
            // ── Success / info state ─────────────────────────────────────
            <div className="space-y-5 mt-6">
              <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="w-10 h-10 bg-[#FBC02D] rounded-full flex items-center justify-center mb-3">
                  <span className="text-black font-black text-base">!</span>
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">Contact Your IT Support</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Password resets are handled by your IT Support team.
                  Please reach out to them with your registered email:{' '}
                  <span className="font-semibold text-gray-800">{email}</span>
                </p>
              </div>
              <Link
                to="/login"
                className="block w-full py-3 text-center text-sm font-bold text-[#111111] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          ) : (
            // ── Form state ────────────────────────────────────────────────
            <>
              <p className="text-sm text-gray-400 mb-8">
                Enter your company email and we'll guide you to reset your password
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Company Email
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@highlysucceed.com" required autoComplete="email"
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Submit button — matches login button style */}
                <div className="flex rounded-lg overflow-hidden shadow-sm">
                  <div className="w-2 bg-[#FBC02D] shrink-0" />
                  <button
                    type="submit" disabled={loading}
                    className="flex-1 py-3.5 bg-[#111111] text-white font-bold text-sm tracking-wide hover:bg-[#222222] active:scale-[.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? 'Processing...' : 'Continue'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-xs text-gray-500 hover:text-black transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-gray-300 mt-8">HS System v2.0</p>
      </div>
      {/* Validation modal for empty/invalid email */}
      <ValidationModal
        isOpen={valModal.isOpen}
        type={valModal.type}
        title={valModal.title}
        messages={valModal.messages}
        onClose={() => setValModal((v) => ({ ...v, isOpen: false }))}
      />
    </div>
  );
};

export default ForgotPassword;
