import React, { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('roh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveAuth = (token, userData) => {
    localStorage.setItem('roh_token', token);
    localStorage.setItem('roh_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = useCallback(async (name, email, password) => {
    setLoading(true); setError(null);
    try {
      const { data } = await authAPI.register({ name, email, password });
      saveAuth(data.token, data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const { data } = await authAPI.login({ email, password });
      saveAuth(data.token, data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('roh_token');
    localStorage.removeItem('roh_user');
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await authAPI.getProfile();
      localStorage.setItem('roh_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, refreshProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
