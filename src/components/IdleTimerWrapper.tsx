import React from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { router } from "@/routes/router";

const IdleTimerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleOnIdle = () => {
    localStorage.removeItem('access_token');
    router.navigate({ to: '/switch' });
  };

  useIdleTimer({
    timeout: 1000 * 60 * 10, // 10 minutes
    onIdle: handleOnIdle,
    debounce: 500
  });

  return <>{children}</>;
};

export default IdleTimerWrapper;