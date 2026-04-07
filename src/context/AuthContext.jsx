// AuthContext.jsx — Auth state + guest mode
// Provides login, logout, loginAsGuest, and shared attendance state.
// When isGuest === true, all API calls are intercepted by mockApiService.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginApi }                             from '../api/authApi.js';
import { getTodayAttendance, timeIn as apiTimeIn, timeOut as apiTimeOut } from '../api/attendanceApi.js';
import { MOCK_GUEST_USER }                       from '../data/mockData.js';
import { mockGetTodayAttendance, mockTimeIn, mockTimeOut } from '../data/mockApiService.js';

// Context — undefined default catches missing Provider early
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  // Initialise token + user from localStorage so page refresh preserves session
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user,  setUser]  = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Guest flag — stored in sessionStorage so it clears on tab close
  const [isGuest, setIsGuest] = useState(
    () => sessionStorage.getItem('isGuest') === 'true'
  );

  // Shared attendance state — used by Dashboard + Attendance page
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attLoading,      setAttLoading]      = useState(false);
  const [attError,        setAttError]        = useState(null);

  // Fetch today's attendance — routes to mock or real API based on guest flag
  const fetchTodayAttendance = useCallback(async (guestOverride = null) => {
    // Allow callers to pass explicit guest flag (needed on immediate loginAsGuest call)
    const guest = guestOverride !== null ? guestOverride : isGuest;
    setAttLoading(true);
    setAttError(null);
    try {
      const res = guest
        ? await mockGetTodayAttendance()
        : await getTodayAttendance();
      setTodayAttendance(res.data || null);
    } catch (err) {
      if (err.status === 404) {
        setTodayAttendance(null); // no record yet today — expected
      } else {
        setAttError(err.message || 'Failed to fetch attendance');
      }
    } finally {
      setAttLoading(false);
    }
  }, [isGuest]);

  // Time-in — routes to mock or real API
  const doTimeIn = useCallback(async () => {
    setAttLoading(true);
    setAttError(null);
    try {
      const res = isGuest ? await mockTimeIn() : await apiTimeIn();
      setTodayAttendance(res.data || null);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Time-in failed';
      setAttError(message);
      return { success: false, message };
    } finally {
      setAttLoading(false);
    }
  }, [isGuest]);

  // Time-out — routes to mock or real API
  const doTimeOut = useCallback(async () => {
    setAttLoading(true);
    setAttError(null);
    try {
      const res = isGuest ? await mockTimeOut() : await apiTimeOut();
      setTodayAttendance(res.data || null);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Time-out failed';
      setAttError(message);
      return { success: false, message };
    } finally {
      setAttLoading(false);
    }
  }, [isGuest]);

  // Login — real API call, stores JWT + user in localStorage
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      setIsGuest(false);
      sessionStorage.removeItem('isGuest');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login as guest — uses mock sentinel token, no API call needed
  const loginAsGuest = useCallback(() => {
    localStorage.setItem('token', 'guest');                          // sentinel token
    localStorage.setItem('user',  JSON.stringify(MOCK_GUEST_USER));  // mock profile
    setToken('guest');
    setUser(MOCK_GUEST_USER);
    setIsGuest(true);
    sessionStorage.setItem('isGuest', 'true');                       // persist across navigation
    setTodayAttendance(null);
    // Pre-fetch today's attendance for the guest (pass true explicitly)
    fetchTodayAttendance(true);
  }, [fetchTodayAttendance]);

  // Logout — clears all state and storage
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isGuest');
    setToken(null);
    setUser(null);
    setIsGuest(false);
    setTodayAttendance(null);
  }, []);

  // Update user info locally (after profile edit) without re-login
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    token,
    user,
    loading,
    error,
    isGuest,                          // consumers can check this to disable write actions
    isAuthenticated: !!token,
    login,
    loginAsGuest,
    logout,
    updateUser,
    // Shared attendance state
    todayAttendance,
    attLoading,
    attError,
    fetchTodayAttendance,
    doTimeIn,
    doTimeOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook — throws if used outside AuthProvider
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
