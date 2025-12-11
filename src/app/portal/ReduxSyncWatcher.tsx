import { useEffect, useRef } from 'react';
import { store, useAppDispatch } from '@/redux/store';
import {
  WORKER_MESSAGE_TYPE,
  WorkerMessage,
  WorkerMessageType,
} from '@/web-worker/reduxSyncWorker';
import { syncUser } from '@/redux/slices/portalUser.slice';
import { UserProfile } from '@/libs/types/user-profile';
import { debounce, getCookie } from '@/libs/utils/utils';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { COOKIE_NAME } from '@/constants/general.constant';

const ReduxSyncWatcher = () => {
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const workerRef = useRef<SharedWorker | null>(null);

  useEffect(() => {
    workerRef.current = new SharedWorker(
      new URL('@/web-worker/reduxSyncWorker.ts', import.meta.url),
      { type: 'module' },
    );
    workerRef.current.port.start();
    workerRef.current.port.onmessage = (
      evt: MessageEvent<WorkerMessage<UserProfile>>,
    ) => {
      if (evt?.data?.type === WORKER_MESSAGE_TYPE.SYNC)
        handleSyncData(evt.data.state);
    };

    store.subscribe(() => {
      const state = store.getState().portalUserInfo;
      if (state.meta.ignore === false)
        postMessage(WORKER_MESSAGE_TYPE.UPDATE, state.user);
    });

    return () => {
      workerRef.current?.port.close();
      workerRef.current = null;
    };
  }, []);

  const postMessage = useRef(
    debounce((type: WorkerMessageType, state: UserProfile | null) => {
      if (workerRef.current)
        workerRef.current.port.postMessage({ type, state });
    }, 100),
  ).current;

  const handleSyncData = useRef(
    debounce((state: UserProfile | null) => {
      dispatch(syncUser(state));
      if (
        state == null &&
        !getCookie(COOKIE_NAME.PORTAL_AUTHORIZATION) &&
        pathName !== ROUTES.PORTAL.LOGIN
      )
        return router.push(ROUTES.PORTAL.LOGIN);

      if (
        state != null &&
        getCookie(COOKIE_NAME.PORTAL_AUTHORIZATION) &&
        pathName === ROUTES.PORTAL.LOGIN
      )
        return router.push(ROUTES.PORTAL.HOME.ROOT);
    }, 100),
  ).current;

  return null;
};
export default ReduxSyncWatcher;
