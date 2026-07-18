import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { getToken, setToken, removeToken, setUser, getUser, removeUser } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      try {
        const token = getToken();
        const storedUser = getUser();
        
        if (token && storedUser) {
          setUserState(storedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            await api.get('/auth/me');
          } catch (error) {
            console.log('Token verification failed, clearing session');
            removeToken();
            removeUser();
            setUserState(null);
            delete api.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      setToken(token);
      setUser(userData);
      setUserState(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, user: newUser } = response.data;
      setToken(token);
      setUser(newUser);
      setUserState(newUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    setUserState(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  // Function to update user data
  const updateUser = useCallback((updatedUser) => {
    setUserState(updatedUser);
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};