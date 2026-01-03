"use client";

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const checkAuthStatus = async () => {
    try {
      const response = await ApiClient.get<User>('/auth/me');
      if (response.status === 200 && response.data) {
        setAuthState({
          user: response.data,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const logout = async () => {
    try {
      await ApiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      // Redirect to home page
      window.location.href = '/';
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...authState,
    checkAuthStatus,
    logout,
  };
}