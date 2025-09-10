import { setExpired } from '@/redux/slices/idleWorker.slice';
import { useAppDispatch } from '@/redux/store';
import { WorkerMessage } from '@/web-worker/idleWorker';
import { useEffect, useRef } from 'react';

export const useIdleWorker = (onTimeout: () => void, timeout: number) => {
  const workerRef = useRef<Worker | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!timeout) return;
    workerRef.current = new Worker(
      new URL('@/web-worker/idleWorker.ts', import.meta.url),
      { type: 'module' },
    );

    workerRef.current.onmessage = (e: MessageEvent<any>) => {
      if (e.data.type === 'TIMEOUT') {
        dispatch(setExpired(true));
        onTimeout();
      }
      if (e.data.type === 'TICK') {
        console.log('Remaining:', e.data.remaining, 'seconds');
      }
    };

    workerRef.current.postMessage({ type: 'SET_TIMEOUT', payload: timeout });
    workerRef.current.postMessage({ type: 'START' });

    const reset = () => {
      dispatch(setExpired(false));
      workerRef.current?.postMessage({ type: 'RESET' } as WorkerMessage);
    };

    const events = [
      'load',
      'mousemove',
      'mousedown',
      'click',
      'scroll',
      'keypress',
    ];
    events.forEach((ev) => window.addEventListener(ev, reset));

    return () => {
      workerRef.current?.postMessage({ type: 'STOP' } as WorkerMessage);
      workerRef.current?.terminate();
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [timeout, dispatch, onTimeout]);
};
