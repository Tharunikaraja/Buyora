import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('buyverse_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('buyverse_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('buyverse_token', token);
    } else {
      localStorage.removeItem('buyverse_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('buyverse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('buyverse_user');
    }
  }, [user]);

  const loadProfile = async () => {
    if (!token) return;
    try {
      const response = await getProfile();
      setUser(response.data.user);
    } catch (error) {
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await loginUser(payload);
      const authUser = response.data.user;
      setUser(authUser);
      setToken(response.data.token);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await registerUser(payload);
      const authUser = response.data.user;
      setUser(authUser);
      setToken(response.data.token);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
