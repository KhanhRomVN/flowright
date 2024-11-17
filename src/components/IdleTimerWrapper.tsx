import React from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { router } from "@/routes/router";

const IdleTimerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleOnIdle = () => {
    localStorage.removeItem('access_token');
    router.navigate({ to: '/switch' });
  };

  useIdleTimer({
    timeout: 1000 * 60 * 60 * 24,
    onIdle: handleOnIdle,
    debounce: 500
  });

  return <>{children}</>;
};

export default IdleTimerWrapper;