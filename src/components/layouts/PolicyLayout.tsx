'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Policy, PolicySummary, PolicyType } from '@/libs/types/policy';
import { usePolicies } from '@/hook/policy/policy';
import {
  PolicyContext,
  PolicyNo,
  QueryKeys,
  QueryValues,
  QUERY_KEY,
} from '@/components/contexts/PolicyLayoutContext';

interface Props {
  children: React.ReactNode;
}

const PolicyProvider = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const policyNo: PolicyNo =
    (searchParams.get(QUERY_KEY.POLICY_NO) as PolicyNo) ?? null;

  const selPolicyType: PolicyType =
    (searchParams.get(QUERY_KEY.POLICY_TYPE) as PolicyType) ?? 'all';

  const searchQuery = decodeURIComponent(
    searchParams.get(QUERY_KEY.SEARCH_QUERY) ?? '',
  );

  // ✅ Updated hook usage
  const { data: policies = [], isFetching } = usePolicies();

  // ✅ Optional summary computation
  const summary = useMemo<PolicySummary>(() => {
    return {
      total: policies.length,
      active: policies.filter((p) => p.policy_status === 'active').length,
      expired: policies.filter((p) => p.policy_status === 'expired').length,
    } as PolicySummary;
  }, [policies]);

  const policyDetail = useMemo<Policy>(() => {
    if (!policyNo) return {} as Policy;

    return policies.find((p) => p.policy_no === policyNo) ?? ({} as Policy);
  }, [policies, policyNo]);

  const appendQueryParams = (
    queryParams: { key: QueryKeys; value?: QueryValues }[] = [],
  ): URLSearchParams => {
    const params = new URLSearchParams(searchParams);

    for (const { key, value } of queryParams)
      value ? params.set(key, value) : params.delete(key);

    return params;
  };

  const pushQuery = (
    queryParams: Parameters<typeof appendQueryParams>[0],
    path?: string,
  ): void => {
    const params = appendQueryParams(queryParams);
    router.push(`${path ?? ''}?${params.toString()}`);
  };

  return (
    <PolicyContext.Provider
      value={{
        selPolicyType,
        searchQuery,
        loading: isFetching,
        policies,
        summary,
        policyDetail,
        pushQuery,
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
};

export default PolicyProvider;
