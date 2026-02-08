'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ApiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  isVerified: boolean;
  roles: string[];
  imageUrl?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  updateUserProfile: (fullName: string, phoneNumber: string) => Promise<boolean>;
  uploadProfilePhoto: (imageFile: File) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiClient.getCurrentUser();
      if (response.status === 200 && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      // Silently handle 401 errors - they're expected when not authenticated
      if (error.response?.status !== 401) {
        console.error('Failed to fetch user:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const updateUserProfile = useCallback(async (fullName: string, phoneNumber: string): Promise<boolean> => {
    try {
      const response = await ApiClient.updateProfile(fullName, phoneNumber);
      if (response.status === 200) {
        // Refresh user data after successful update
        await fetchUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  }, [fetchUser]);

  const uploadProfilePhoto = useCallback(async (imageFile: File): Promise<boolean> => {
    if (!user?.email) return false;
    
    try {
      const response = await ApiClient.uploadProfilePhoto(user.email, imageFile);
      if (response.status === 200) {
        await fetchUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to upload profile photo:', error);
      return false;
    }
  }, [user?.email, fetchUser]);

  useEffect(() => {
   fetchUser();
  }, [fetchUser]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    refreshUser,
    updateUserProfile,
    uploadProfilePhoto,
  }), [user, loading, refreshUser, updateUserProfile, uploadProfilePhoto]);

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