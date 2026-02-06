import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';


export const useUserProfile = () => {
  const { user, loading, refreshUser } = useAuth();
  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    if (!user && !loading && !hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      refreshUser();
    }
  }, [user, loading, refreshUser]);

  return { user, loading };
};
