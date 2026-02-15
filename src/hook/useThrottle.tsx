import { useCallback, useRef } from 'react';

export function useThrottle(callback: () => void, delay: number) {
  const lastCallRef = useRef<number>(0);

  return useCallback(() => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback();
    }
  }, [callback, delay]);
}
