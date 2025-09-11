let timer: ReturnType<typeof setTimeout> | null = null;
let timeout = 0;

export type WorkerMessage =
  | { type: 'START' }
  | { type: 'RESET' }
  | { type: 'STOP' }
  | { type: 'SET_TIMEOUT'; payload: number };

export type WorkerResponse = { type: 'TIMEOUT' };

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  switch (e.data.type) {
    case 'START':
      startTimer();
      break;
    case 'RESET':
      clearTimer();
      startTimer();
      break;
    case 'STOP':
      clearTimer();
      break;
    case 'SET_TIMEOUT':
      timeout = e.data.payload ?? timeout;
      break;
  }
};

function startTimer() {
  timer = setTimeout(() => {
    postMessage({ type: 'TIMEOUT' } as WorkerResponse);
  }, timeout);
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}
