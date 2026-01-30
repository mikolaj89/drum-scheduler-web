import { useEffect, useRef, useState } from 'react';

export const useTimer = (initialSeconds: number, onFinish?: () => void) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startCountdown = () => {
    if (timeoutRef.current) return;

    const tick = () => {
      timeoutRef.current = setTimeout(() => {
        setSecondsLeft((prev: number) => {
          if (prev <= 1) {
            stopCountdown();
            if (onFinish) onFinish();
            return 0;
          }
          return prev - 1;
        });
        if (timeoutRef.current) tick();
      }, 1000);
    };

    tick();
  };

  const stopCountdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const resetCountdown = (newInitialSeconds: number) => {
    stopCountdown();
    setSecondsLeft(newInitialSeconds);
  };

  useEffect(() => {
    return () => {
      stopCountdown();
    };
  }, []);

  return { secondsLeft, startCountdown, stopCountdown, resetCountdown };
};
