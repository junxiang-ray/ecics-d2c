import type { AxiosResponse } from 'axios';
import {
  TermAndConditionResponse,
  TermAndConditionResponseData,
} from '@/libs/types/term-and-condition';

import { useQuery } from '@tanstack/react-query';

import termAndConditions from '@/api/base-service/term-and-condition';

export const useTermAndConditions = () => {
  const fetchTermAndConditions =
    async (): Promise<TermAndConditionResponse> => {
      try {
        const resp: AxiosResponse<TermAndConditionResponseData> =
          await termAndConditions.getTermAndConditions();
        return resp?.data as unknown as TermAndConditionResponse;
      } catch (e) {
        return {
          meta: {},
          data: null,
        } as unknown as TermAndConditionResponse;
      }
    };

  return useQuery({
    queryFn: fetchTermAndConditions,
    queryKey: ['term_and_condition'],
    enabled: true,
  });
};
