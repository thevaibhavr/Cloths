'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const storedUserData = localStorage.getItem('user_data');
      
      if (token) {
        try {
          const userData = await apiService.getCurrentUser();
          // Normalize user data to use _id
          const normalizedUser = {
            ...userData,
            _id: userData._id || userData.id
          };
          setUser(normalizedUser);
        } catch (apiError) {
          console.error('API call failed, using stored user data:', apiError);
          // Fallback to stored user data if API call fails
          if (storedUserData) {
            const parsedUser = JSON.parse(storedUserData);
            setUser(parsedUser);
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_data');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response: AuthResponse = await apiService.login(credentials);
      
      // Normalize user data to use _id
      const normalizedUser = {
        ...response.user,
        _id: response.user._id || response.user.id
      };
      
      // Store token and user data
      localStorage.setItem('user_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(normalizedUser));
      
      setUser(normalizedUser);
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response: AuthResponse = await apiService.register(data);
      
      // Normalize user data to use _id
      const normalizedUser = {
        ...response.user,
        _id: response.user._id || response.user.id
      };
      
      // Store token and user data
      localStorage.setItem('user_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(normalizedUser));
      
      setUser(normalizedUser);
      toast.success('Registration successful!');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser: User) => {
    // Normalize user data to use _id
    const normalizedUser = {
      ...updatedUser,
      _id: updatedUser._id || updatedUser.id
    };
    setUser(normalizedUser);
    localStorage.setItem('user_data', JSON.stringify(normalizedUser));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 