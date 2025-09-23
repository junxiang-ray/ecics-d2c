import { useMutation, useQuery } from '@tanstack/react-query';

import { normalizeName } from '@/libs/utils/utils';

import renewal from '@/api/base-service/renewal';
import verify from '@/api/cms-service/verify';
import { ProductTypeWeb } from '@/app/api/constants/product';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { updateRenewalQuote } from '@/redux/slices/renewalQuote.slice';

type EditRenewalParams = {
  productType: ProductTypeWeb;
  payload: any;
};

type MergeStrategy = 'basic' | 'withOptionals';

export const usePostEditRenewal = (mergeStrategy: MergeStrategy = 'basic') => {
  const dispatch = useAppDispatch();
  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
  );

  return useMutation({
    mutationFn: async ({ productType, payload }: EditRenewalParams) => {
      const res = await renewal.postEditRenewal(productType, payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (!renewalQuote) return;
      const apiData = data?.data ?? data ?? {};

      let updatedRenewalQuote: any = {
        ...renewalQuote,
        renewal_info: {
          ...renewalQuote.renewal_info,
          renewalplanprem: apiData.renewal_info?.renewalplanprem,
          renewalpremb4gst: apiData.renewal_info?.renewalpremb4gst,
          renewalgst: apiData.renewal_info?.renewalgst,
          renewalpremwgst: apiData.renewal_info?.renewalpremwgst,
        },
      };

      if (mergeStrategy === 'withOptionals') {
        const policyOptionals =
          apiData.policy_optional_benefits ??
          apiData.renewal_info?.policy_optional_benefits ??
          [];

        const policyMap = new Map<string, any>();
        policyOptionals.forEach((p: any) => {
          const key = normalizeName(p.name) || `id:${p.id}`;
          policyMap.set(key, p);
        });

        const currentOptionals =
          renewalQuote?.renewal_info?.optional_benefits ?? [];

        const mergedOptionals = currentOptionals.map((opt: any) => {
          const matched = policyMap.get(normalizeName(opt.name));
          return matched ? { ...opt, prem: matched.prem ?? opt.prem } : opt;
        });

        updatedRenewalQuote = {
          ...updatedRenewalQuote,
          add_on_optional_benefits:
            apiData.add_on_optional_benefits ??
            renewalQuote.add_on_optional_benefits,
          renewal_info: {
            ...updatedRenewalQuote.renewal_info,
            optional_benefits: mergedOptionals,
          },
        };
      }

      dispatch(updateRenewalQuote(updatedRenewalQuote));
    },
  });
};

export const usePostQueryEditRenewal = ({
  productType,
  payload,
  renewalQuote,
}: EditRenewalParams & { renewalQuote: any }) => {
  const postQueryEditRenewal = async () => {
    const res = await renewal.postEditRenewal(productType, payload);
    const apiData = res.data?.data ?? res.data ?? {};

    const policyOptionals =
      apiData.policy_optional_benefits ??
      apiData.renewal_info?.policy_optional_benefits ??
      [];

    const policyMap = new Map<string, any>();
    policyOptionals.forEach((p: any) => {
      const key = normalizeName(p.name) || `id:${p.id}`;
      policyMap.set(key, p);
    });

    const currentOptionals =
      renewalQuote?.renewal_info?.optional_benefits ?? [];

    const mergedOptionals = currentOptionals.map((opt: any) => {
      const key = normalizeName(opt.name);
      const matchedPolicy = policyMap.get(key);

      if (matchedPolicy) {
        return { ...opt, prem: matchedPolicy.prem ?? opt.prem };
      }
      return opt;
    });

    const updatedRenewalQuote = {
      ...renewalQuote,
      add_on_optional_benefits: apiData.add_on_optional_benefits,
      renewal_info: {
        ...renewalQuote.renewal_info,
        renewalplanprem: apiData.renewal_info?.renewalplanprem,
        renewalpremb4gst: apiData.renewal_info?.renewalpremb4gst,
        renewalgst: apiData.renewal_info?.renewalgst,
        renewalpremwgst: apiData.renewal_info?.renewalpremwgst,
        optional_benefits: mergedOptionals,
      },
    };

    return updatedRenewalQuote;
  };

  return useQuery({
    queryKey: ['edit-renewal', productType, payload],
    queryFn: postQueryEditRenewal,
    enabled: !!payload,
  });
};

export const usePostRenewalProcessPayment = () => {
  const postRenewalProcessPayment = async ({
    productType,
    payload,
  }: EditRenewalParams) => {
    const res = await renewal.postRenewalProcessPayment(productType, payload);
    return res.data;
  };

  return useMutation({
    mutationFn: postRenewalProcessPayment,
    mutationKey: ['renewal-process-payment'],
  });
};

export const usePostSavePolicy = () => {
  const postSavePolicyPayment = async ({
    productType,
    payload,
  }: EditRenewalParams) => {
    const res = await renewal.postSavePolicy(productType, payload);
    return res.data;
  };

  return useMutation({
    mutationFn: postSavePolicyPayment,
    mutationKey: ['save-policy'],
  });
};

export const useGetTimeoutRenewal = () => {
  const getTimeoutRenewal = async () => {
    const res = await verify.getTimeoutRenewal();
    return res.data;
  };

  return useMutation({
    mutationFn: getTimeoutRenewal,
    mutationKey: ['get-timeout-renewal'],
  });
};

export const usePostCheckPolicies = () => {
  const postCheckPolicies = async (policies: { veh_reg_no: string }[]) => {
    const res = await verify.checkPolicies({ policies });
    return res.data;
  };

  return useMutation({
    mutationFn: postCheckPolicies,
    mutationKey: ['check-policies'],
  });
};
