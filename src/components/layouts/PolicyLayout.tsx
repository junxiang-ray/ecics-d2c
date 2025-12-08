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
  QUERY_KEY,
} from '@/components/contexts/PolicyLayoutContext';

const QUERY_KEYS: QueryKeys[] = [
  QUERY_KEY.POLICY_NO,
  QUERY_KEY.POLICY_TYPE,
  QUERY_KEY.POLICY_STATUS,
  QUERY_KEY.POLICY_TAGS,
  QUERY_KEY.SEARCH_QUERY,
];

interface Props {
  children: React.ReactNode;
}

const PolicyProvider = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const summaryRef = useRef<PolicySummary>({} as PolicySummary);
  const policyNo: PolicyNo = decodeURIComponent(
    searchParams.get(QUERY_KEY.POLICY_NO) ?? '',
  ) as unknown as PolicyNo;
  const selPolicyType: PolicyType =
    (searchParams.get(QUERY_KEY.POLICY_TYPE) as unknown as PolicyType) ?? 'all';
  const searchQuery = decodeURIComponent(
    searchParams.get(QUERY_KEY.SEARCH_QUERY) ?? '',
  );

  const { data, isFetching } = usePolicies({
    policyNo: policyNo ?? null,
    policyStatus: searchParams.get('status') ?? '',
    policyType: selPolicyType,
    tags: searchParams.get('tags') ?? '',
    queryStr: searchQuery,
  } as PolicyPayload);

  const policies = useMemo<Policy[]>(
    () => (data?.data?.results ?? []) as Policy[],
    [data],
  );
  const summary = useMemo<PolicySummary>(() => {
    if (isFetching) return summaryRef.current;

    return (summaryRef.current = (data?.data?.summary ?? {}) as PolicySummary);
  }, [data, isFetching]);

  const policyDetail = useMemo<Policy>(() => {
    if (!policyNo || !policies) return {} as Policy;

    return (
      policies?.find((policy) => policy.policy_no === policyNo) ??
      ({} as Policy)
    );
  }, [policies, policyNo]);

  const appendQueryParams = (
    queryParams: { key: QueryKeys; value?: QueryValues }[] = [],
  ): URLSearchParams => {
    const params = new URLSearchParams(searchParams);
    for (const { key, value } of queryParams)
      value ? params.set(key, value) : params.delete(key);

    return new URLSearchParams(
      (Array.from(params.entries()) as [QueryKeys, string][]).sort(
        ([leftKey], [rightKey]) =>
          QUERY_KEYS.indexOf(leftKey) - QUERY_KEYS.indexOf(rightKey),
      ),
    );
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
