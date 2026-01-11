import Pusher from 'pusher-js';

let pusherInstance: Pusher | null = null;

export const getPusherInstance = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      encrypted: true,
    });
  }
  return pusherInstance;
};

export const subscribeToPusherChannel = (channelName: string, eventName: string, callback: (data: any) => void) => {
  const pusher = getPusherInstance();
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