import { useAppDispatch } from '@/redux/store';
import { setErrorSlice } from '@/redux/slices/error.slice';
import { useRouterWithQuery } from './useRouterWithQuery';
import { ROUTES } from '@/constants/routes';

export function useApiErrorHandler() {
  const dispatch = useAppDispatch();
  const router = useRouterWithQuery();

  return (error: any) => {
    const message =
      error?.response?.data?.details?.[0]?.message || error?.message || '';
    const status = error?.response?.status || 500;
    dispatch(setErrorSlice({ message, status }));
    router.push(ROUTES.API_ERROR);
  };
}
