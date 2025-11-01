import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if user has a valid token
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          setIsGuest(false);
        } else {
          // Token exists but invalid, clear it and set guest mode
          authService.removeToken();
          setUser(null);
          setIsAuthenticated(false);
          setIsGuest(true);
        }
      } else {
        // No token, user is in guest mode
        setUser(null);
        setIsAuthenticated(false);
        setIsGuest(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, default to guest mode
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      
      if (result.success) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        setIsGuest(false);
        return result;
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await authService.register(userData);
      
      if (result.success) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        setIsGuest(false);
        return result;
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(true);
  };

  const migrateGuestData = async () => {
    try {
      if (!isAuthenticated) {
        return { success: false, error: 'User must be authenticated to migrate data' };
      }

      // Use dataService for migration
      const dataService = (await import('../services/dataService.js')).default;
      const result = await dataService.migrateGuestData();
      
      return result;
    } catch (error) {
      console.error('Migration error:', error);
      return { success: false, error: 'Failed to migrate guest data' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isGuest,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    migrateGuestData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};