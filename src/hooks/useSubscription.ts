import { useState, useEffect } from 'react';
import { getCurrentSubscription, CurrentSubscription } from '@/lib/subscription';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentSubscription();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSubscription();
      }
    };

    const handleSubscriptionUpdate = () => {
      fetchSubscription();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('subscription-updated', handleSubscriptionUpdate);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('subscription-updated', handleSubscriptionUpdate);
    };
  }, []);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription
  };
};
