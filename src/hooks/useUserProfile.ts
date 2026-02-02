import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to ensure user profile is loaded immediately when component mounts
 * This can be used in dashboard layout or any component that needs immediate user data
 */
export const useUserProfile = () => {
  const { user, loading, refreshUser } = useAuth();

  useEffect(() => {
    // If user is not loaded and not currently loading, trigger a refresh
    if (!user && !loading) {
      refreshUser();
    }
  }, [user, loading, refreshUser]);

  return { user, loading };
};