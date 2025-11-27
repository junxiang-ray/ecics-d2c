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
} from '@/components/contexts/ClaimLayoutContext';

interface Props {
  children: React.ReactNode;
}

const ClaimProvider = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const summaryRef = useRef<ClaimSummary>({} as ClaimSummary);
  const claimNo: ClaimNo = decodeURIComponent(
    searchParams.get('no') ?? '',
  ) as unknown as ClaimNo;

  const { data, isFetching } = useClaims({
    claimNo: claimNo ?? null,
    claimStatus: searchParams.get('status') ?? '',
    policyType: searchParams.get('type') ?? '',
    queryStr: searchParams.get('query') ?? '',
  } as ClaimPayload);

  const selPolicyType: PolicyType =
    (searchParams.get('type') as unknown as PolicyType) ?? 'all';
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
    <ClaimContext.Provider
      value={{
        selPolicyType,
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
