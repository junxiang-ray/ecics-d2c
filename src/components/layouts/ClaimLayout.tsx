'use client';

import { PolicyType } from '@/libs/types/policy';

import { Claim, ClaimPayload, ClaimSummary } from '@/libs/types/claim';

import { useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClaims } from '@/hook/claim/claim';
import {
  ClaimContext,
  ClaimNo,
  QueryKeys,
  QueryValues,
  QUERY_KEY,
} from '@/components/contexts/ClaimLayoutContext';

const QUERY_KEYS: QueryKeys[] = [
  QUERY_KEY.CLAIM_NO,
  QUERY_KEY.CLAIM_STATUS,
  QUERY_KEY.POLICY_TYPE,
  QUERY_KEY.SEARCH_QUERY,
];

interface Props {
  children: React.ReactNode;
}

const ClaimProvider = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const summaryRef = useRef<ClaimSummary>({} as ClaimSummary);
  const claimNo: ClaimNo = decodeURIComponent(
    searchParams.get(QUERY_KEY.CLAIM_NO) ?? '',
  ) as unknown as ClaimNo;
  const selPolicyType: PolicyType =
    (searchParams.get('type') as unknown as PolicyType) ?? 'all';
  const searchQuery = decodeURIComponent(
    searchParams.get(QUERY_KEY.SEARCH_QUERY) ?? '',
  );

  const { data, isFetching } = useClaims({
    claimNo: claimNo ?? null,
    claimStatus: searchParams.get('status') ?? '',
    policyType: selPolicyType,
    queryStr: searchQuery,
  } as ClaimPayload);

  const claims = useMemo<Claim[]>(
    () => (data?.data?.results ?? []) as Claim[],
    [data],
  );
  const summary = useMemo<ClaimSummary>(() => {
    if (isFetching) return summaryRef.current;

    return (summaryRef.current = (data?.data?.summary ?? {}) as ClaimSummary);
  }, [data, isFetching]);

  const claimDetail = useMemo<Claim | null>(() => {
    if (!claimNo || !claims) return null;

    return claims?.find((claim) => claim.claim_no === claimNo) ?? null;
  }, [claims, claimNo]);

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
    <ClaimContext.Provider
      value={{
        selPolicyType,
        searchQuery,
        loading: isFetching,
        claims,
        summary,
        claimDetail,
        pushQuery,
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
};
export default ClaimProvider;
