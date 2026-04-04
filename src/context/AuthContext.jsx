import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginApi } from '../api/authApi.js';
import { getTodayAttendance, timeIn as apiTimeIn, timeOut as apiTimeOut } from '../api/attendanceApi.js';

// Create context — default is undefined so missing Provider is caught early
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  // Initialise from localStorage so refresh preserves session
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user,  setUser]  = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Shared attendance state (Dashboard + Attendance page in sync)
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attLoading,      setAttLoading]      = useState(false);
  const [attError,        setAttError]        = useState(null);

  // Fetch today's attendance log from API
  const fetchTodayAttendance = useCallback(async () => {
    setAttLoading(true);
    setAttError(null);
    try {
      const res = await getTodayAttendance();
      setTodayAttendance(res.data || null);
    } catch (err) {
      if (err.status === 404) {
        setTodayAttendance(null); // no record yet today
      } else {
        setAttError(err.message || 'Failed to fetch attendance');
      }
    } finally {
      setAttLoading(false);
    }
  }, []);

  // Time-in — calls API and updates shared attendance state
  const doTimeIn = useCallback(async () => {
    setAttLoading(true);
    setAttError(null);
    try {
      const res = await apiTimeIn();
      setTodayAttendance(res.data || null);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Time-in failed';
      setAttError(message);
      return { success: false, message };
    } finally {
      setAttLoading(false);
    }
  }, []);

  // Time-out — calls API and updates shared attendance state
  const doTimeOut = useCallback(async () => {
    setAttLoading(true);
    setAttError(null);
    try {
      const res = await apiTimeOut();
      setTodayAttendance(res.data || null);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Time-out failed';
      setAttError(message);
      return { success: false, message };
    } finally {
      setAttLoading(false);
    }
  }, []);

  // Login — calls API, stores token + user in state and localStorage
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user',  JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout — clears state and storage, resets attendance
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setTodayAttendance(null);
  }, []);

  // Update user info after profile changes without re-login
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
    isAuthenticated: !!token,
    login,
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
