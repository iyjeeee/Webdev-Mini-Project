// login.jsx — Login page with real-account selector and guest access button
// Guest mode: proceeds to system with mock data (no credentials required).
// Login mode: authenticates against the live database via the real API.

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Users, X, User2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import ValidationModal from '../../components/ValidationModal.jsx';

// Real accounts seeded in the database — all share the same default password
const ACCOUNTS = [
  { name: 'John Andrei Recto',  email: 'john.andrei.recto@highlysucceed.com',  role: 'Junior Software Developer', dept: 'IT' },
  { name: 'Marcus Neo Rangel',  email: 'marcus.neo.rangel@highlysucceed.com',  role: 'Junior Software Developer', dept: 'IT' },
  { name: 'Renson Pena',        email: 'renson.pena@highlysucceed.com',        role: 'Junior Software Developer', dept: 'IT' },
  { name: 'Ken Demetri Payo',   email: 'ken.demetri.payo@highlysucceed.com',   role: 'Junior Software Developer', dept: 'IT' },
  { name: 'Rosh Andrei Lantin', email: 'rosh.andrei.lantin@highlysucceed.com', role: 'Project Management Head',   dept: 'IT' },
];

const DEFAULT_PASSWORD = 'highlysucceed'; // shared seed password for demo

// ── Accounts Modal ─────────────────────────────────────────────
const AccountsModal = ({ onClose, onSelect }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-1.5 w-full bg-[#FBC02D]" />

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900">Available Accounts</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-100">
        <p className="text-xs text-yellow-800 font-medium">
          Click any account to auto-fill your login credentials instantly.
        </p>
      </div>

      <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
        {ACCOUNTS.map((acc) => (
          <button
            key={acc.email}
            onClick={() => { onSelect(acc.email, DEFAULT_PASSWORD); onClose(); }}
            className="w-full flex items-center justify-between bg-gray-50 hover:bg-yellow-50 hover:border-yellow-200 rounded-xl px-4 py-3 border border-gray-100 gap-3 text-left transition-colors cursor-pointer group"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate group-hover:text-gray-900">{acc.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{acc.email}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mr-1">{acc.dept}</span>
                {acc.role}
              </p>
            </div>
            <span className="shrink-0 text-[11px] font-bold text-[#FBC02D] border border-yellow-300 bg-yellow-50 px-3 py-1.5 rounded-lg group-hover:bg-yellow-400 group-hover:text-black transition-colors">
              Use
            </span>
          </button>
        ))}
      </div>

      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-[10px] text-gray-400 text-center">
          Default password: <span className="font-black text-gray-600">{DEFAULT_PASSWORD}</span>
        </p>
      </div>
    </div>
  </div>
);

// ── Guest Confirmation Modal ────────────────────────────────────
// Shown before proceeding as guest — explains what guest mode is.
const GuestConfirmModal = ({ onClose, onConfirm }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Accent bar — gray to distinguish from auth actions */}
      <div className="h-1.5 w-full bg-gray-400" />

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <User2 size={16} className="text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900">Continue as Guest?</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      {/* Body — explain mock data clearly */}
      <div className="px-6 py-5 space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          You're about to enter the system in <span className="font-bold text-gray-900">read-only demo mode</span>.
        </p>
        <ul className="space-y-1.5">
          {[
            'All data shown is sample / mock data.',
            'No real database records will be accessed.',
            'Write actions (create, cancel) work locally for the session.',
            'Changes are not saved — they reset on logout.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-[12px] text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-5 flex gap-2">
        {/* Cancel */}
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        {/* Confirm guest entry */}
        <div className="flex flex-1 rounded-lg overflow-hidden shadow-sm">
          <div className="w-1.5 bg-gray-400 shrink-0" />
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#111111] text-white font-bold text-sm tracking-wide hover:bg-[#222222] active:scale-[.99] transition-all cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Login Page ─────────────────────────────────────────────────
const Login = () => {
  const [form,          setForm]          = useState({ email: '', password: '' });
  const [showPw,        setShowPw]        = useState(false);
  const [showAccounts,  setShowAccounts]  = useState(false);
  const [showGuestConf, setShowGuestConf] = useState(false); // guest confirm modal
  const navigate                          = useNavigate();
  const { login, loginAsGuest, loading }  = useAuth();

  const [valModal, setValModal] = useState({ isOpen: false, type: 'error', title: '', messages: [] });

  const onChange = ({ target: { name, value } }) =>
    setForm((f) => ({ ...f, [name]: value }));

  // Auto-fill credentials from account selector modal
  const handleAccountSelect = (email, password) => {
    setForm({ email, password });
    setShowPw(false);
  };

  // Handle guest confirmation — call loginAsGuest then navigate
  const handleGuestConfirm = () => {
    setShowGuestConf(false);
    loginAsGuest();                          // sets token='guest' + isGuest=true in context
    navigate('/dashboard', { replace: true });
  };

  // Client-side field validation
  const validate = () => {
    const msgs = [];
    if (!form.email.trim())    msgs.push('Email address is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
                               msgs.push('Please enter a valid email address.');
    if (!form.password)        msgs.push('Password is required.');
    else if (form.password.length < 6)
                               msgs.push('Password must be at least 6 characters.');
    return msgs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msgs = validate();
    if (msgs.length) {
      setValModal({ isOpen: true, type: 'error', title: 'Please fix the following:', messages: msgs });
      return;
    }
    const result = await login(form.email.trim(), form.password);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setValModal({
        isOpen:   true,
        type:     'error',
        title:    'Login Failed',
        messages: [result.message || 'An error occurred. Please try again.'],
      });
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] bg-[#111111] flex-col justify-between p-10 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute top-[-100px] right-[-100px] w-[560px] h-[560px] rounded-full border border-[#FBC02D]/20 pointer-events-none" />
        <div className="absolute top-[-50px]  right-[-50px]  w-[400px] h-[400px] rounded-full border border-[#FBC02D]/12 pointer-events-none" />

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

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-[#FBC02D]" />
            <span className="text-[10px] font-bold text-[#FBC02D] uppercase tracking-[0.25em]">HR Information System</span>
          </div>
          <h1 className="text-4xl font-black text-white leading-[1.1]">
            Manage your<br />Workforce<br />
            <span className="text-[#FBC02D]">with ease</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            A unified platform for Attendance, Leave, Overtime, Tasks, and
            Company-wide communications — built for every employee
          </p>
          <ul className="space-y-2.5">
            {[
              'Real-time Attendance Tracking & Login',
              'Leave credits, overtime & payroll visibility',
              'Company Calendar and Company events',
              'Task Management & employee directory',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FBC02D] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[11px] text-gray-600 relative z-10">Highly Succeed, Inc. All Rights Reserved</p>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col justify-between px-8 py-10 sm:px-12 lg:px-16">
        <div />

        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px bg-[#FBC02D]" />
            <span className="text-[10px] font-bold text-[#FBC02D] uppercase tracking-[0.25em]">Welcome Back</span>
          </div>
          <h2 className="text-4xl font-black text-[#111111] leading-[1.1] mb-1.5">
            Login to<br />your Account
          </h2>
          <p className="text-sm text-gray-400 mb-8">Enter your credentials to access the HS system</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email field */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  type="email" name="email" value={form.email} onChange={onChange}
                  placeholder="yourname@highlysucceed.com" autoComplete="email"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={onChange} placeholder="Enter your Password" autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-11 py-3 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors placeholder:text-gray-300"
                />
                <button
                  type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* View Accounts / Forgot Password links */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAccounts(true)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer font-medium"
              >
                <Users size={13} />
                View Accounts
              </button>
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-black transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Login submit button */}
            <div className="flex rounded-lg overflow-hidden shadow-sm mt-1">
              <div className="w-2 bg-[#FBC02D] shrink-0" />
              <button
                type="submit" disabled={loading}
                className="flex-1 py-3.5 bg-[#111111] text-white font-bold text-sm tracking-wide hover:bg-[#222222] active:scale-[.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </div>

            {/* Divider — separates auth login from guest access */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Guest access button — outlined, secondary style */}
            <button
              type="button"
              onClick={() => setShowGuestConf(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-200 text-gray-500 text-sm font-semibold hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 active:scale-[.99] transition-all cursor-pointer"
            >
              <User2 size={15} />
              Continue as Guest
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 leading-relaxed mt-8">
            Having trouble logging in?<br />
            Please contact your <span className="font-bold text-gray-700">IT Support</span>
          </p>
        </div>

        <p className="text-center text-[11px] text-gray-300 mt-8">HS System v2.0</p>
      </div>

      {/* Accounts Modal */}
      {showAccounts && (
        <AccountsModal
          onClose={() => setShowAccounts(false)}
          onSelect={handleAccountSelect}
        />
      )}

      {/* Guest Confirmation Modal */}
      {showGuestConf && (
        <GuestConfirmModal
          onClose={() => setShowGuestConf(false)}
          onConfirm={handleGuestConfirm}
        />
      )}

      {/* Validation / Error Modal */}
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

export default Login;
