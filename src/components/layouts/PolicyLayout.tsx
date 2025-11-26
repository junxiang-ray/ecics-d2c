'use client';

import {
  Policy,
  PolicyPayload,
  PolicySummary,
  PolicyType,
} from '@/libs/types/policy';

import { useMemo, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePolicies } from '@/hook/policy/policy';
import {
  PolicyContext,
  PolicyNo,
  QueryKeys,
  QueryValues,
} from '@/components/contexts/PolicyLayoutContext';

interface Props {
  children: React.ReactNode;
}

const PolicyProvider = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const summaryRef = useRef<PolicySummary>({} as PolicySummary);
  const policyNo: PolicyNo = decodeURIComponent(
    searchParams.get('no') ?? '',
  ) as unknown as PolicyNo;

  const { data, isFetching } = usePolicies({
    policyNo: policyNo ?? null,
    policyStatus: searchParams.get('status') ?? '',
    policyType: searchParams.get('type') ?? '',
    tags: searchParams.get('tags') ?? '',
    queryStr: searchParams.get('query') ?? '',
  } as PolicyPayload);

  const selPolicyType: PolicyType =
    (searchParams.get('type') as unknown as PolicyType) ?? 'all';
  const policies = useMemo<Policy[]>(
    () => (data?.data?.results ?? []) as Policy[],
    [data],
  );
  const summary = useMemo<PolicySummary>(() => {
    if (isFetching) return summaryRef.current;

    return (summaryRef.current = (data?.data?.summary ?? {}) as PolicySummary);
  }, [data, isFetching]);

  const policyDetail = useMemo<Policy | null>(() => {
    if (!policyNo || !policies) return null;

    return policies?.find((policy) => policy.policy_no === policyNo) ?? null;
  }, [policies, policyNo]);

  const pushQuery = (
    queryParams: { key: QueryKeys; value?: QueryValues }[] = [],
    path?: string,
  ): void => {
    const params = new URLSearchParams(searchParams);
    for (const { key, value } of queryParams)
      value ? params.set(key, value) : params.delete(key);

    router.push(`${path ?? ''}?${params.toString()}`);
  };

  return (
    <PolicyContext.Provider
      value={{
        selPolicyType,
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
