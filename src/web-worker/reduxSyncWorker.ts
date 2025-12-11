export const WORKER_MESSAGE_TYPE = {
  UPDATE: 'update',
  SYNC: 'sync',
} as const;

export type WorkerMessageType =
  (typeof WORKER_MESSAGE_TYPE)[keyof typeof WORKER_MESSAGE_TYPE];
export type WorkerMessage<S = any> = {
  type: WorkerMessageType;
  state: S;
};

const ports: MessagePort[] = [];

if (typeof self !== 'undefined' && 'onconnect' in self)
  self.onconnect = (event: MessageEvent) => {
    const port = event.ports[0];
    ports.push(port);

    port.onmessage = (msg: MessageEvent<WorkerMessage>) => {
      if (msg.data.type === WORKER_MESSAGE_TYPE.UPDATE) {
        ports.forEach((msgPort: MessagePort) => {
          if (msgPort !== port) {
            msgPort.postMessage({
              type: WORKER_MESSAGE_TYPE.SYNC,
              state: msg.data.state,
            });
          }
        });
      }
    };
  };
