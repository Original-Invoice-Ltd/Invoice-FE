import Pusher from 'pusher-js';

let pusherInstance: Pusher | null = null;

export const getPusherInstance = () => {
  if (!pusherInstance) {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    
    if (!pusherKey) {
      console.warn('Pusher key not found in environment variables');
      return null;
    }
    
    pusherInstance = new Pusher(pusherKey, {
      cluster: pusherCluster || 'us2',
      forceTLS: true,
    });
  }
  return pusherInstance;
};

export const subscribeToPusherChannel = (channelName: string, eventName: string, callback: (data: any) => void) => {
  const pusher = getPusherInstance();
  if (!pusher) {
    console.warn('Pusher instance not available, skipping subscription');
    return () => {}; // Return empty unsubscribe function
  }
  
  const channel = pusher.subscribe(channelName);
  channel.bind(eventName, callback);
  
  return () => {
    channel.unbind(eventName, callback);
    pusher.unsubscribe(channelName);
  };
};

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};