'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RootState, useAppDispatch, useAppSelector } from '@/redux/store';
import { setExpired } from '@/redux/slices/idleWorker.slice';
import { resetRenewalQuote } from '@/redux/slices/renewalQuote.slice';
import { ROUTES } from '@/constants/routes';

export function RenewalSessionWatcher() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const timeoutValue = useAppSelector(
    (state: RootState) => state.idleWorker.timeoutValue,
  );
  useEffect(() => {
    if (!timeoutValue) return;

    const worker = new Worker(
      new URL('@/web-worker/idleWorker.ts', import.meta.url),
      { type: 'module' },
    );

    worker.postMessage({ type: 'SET_TIMEOUT', payload: timeoutValue });
    worker.postMessage({ type: 'START' });
    const idleEvents = [
      'load',
      'mousemove',
      'mousedown',
      'click',
      'scroll',
      'keypress',
    ];
    const resetTimer = () => {
      worker.postMessage({ type: 'RESET' });
    };

    idleEvents.forEach((event) =>
      window.addEventListener(event, resetTimer, true),
    );
    worker.onmessage = (e) => {
      if (e.data?.type === 'TIMEOUT') {
        dispatch(setExpired(true));
        sessionStorage.clear();
        localStorage.clear();
        dispatch(resetRenewalQuote());
        worker.postMessage({ type: 'STOP' });
        router.push(ROUTES.RENEWAL.LOGIN);
      }
    };

    return () => {
      worker.terminate();
      idleEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer, true),
      );
    };
  }, [timeoutValue]);

  return null;
}
