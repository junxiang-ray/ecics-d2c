'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Policy, PolicySummary, PolicyType } from '@/libs/types/policy';
import { usePolicies } from '@/hook/policy/policy';
import { usePolicyData } from '@/hook/policy/usePolicyData'; // ⭐ Add this import
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

  // ⭐ Filtered policies (reads status/tags from URL automatically)
  const { data: policies = [], isFetching } = usePolicies();

  // ⭐ Unfiltered policies for summary counts
  const { data: allPolicies = [] } = usePolicyData();

  // ⭐ Compute summary from ALL policies (unfiltered)
  const summary = useMemo<PolicySummary>(() => {
    return {
      total: allPolicies.length,
      active: allPolicies.filter((p) => p.policy_status === 'active').length,
      expired: allPolicies.filter((p) => p.policy_status === 'expired').length,
      pending_renewal: allPolicies.filter((p) => p.tags === 'pending_renewal')
        .length,
    } as PolicySummary;
  }, [allPolicies]);

  // ⭐ Filter by search query and policy type (client-side only)
  const filteredPolicies = useMemo(() => {
    let result = policies;

    // Filter by policy type
    if (selPolicyType && selPolicyType !== 'all') {
      result = result.filter((p) => p.policy_type === selPolicyType);
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const matchPolicyNo = p.policy_no?.toLowerCase().includes(searchLower);
        const matchVehicle = p.vehicle?.registration_no
          ?.toLowerCase()
          .includes(searchLower);
        const matchType = p.policy_type_name
          ?.toLowerCase()
          .includes(searchLower);
        return matchPolicyNo || matchVehicle || matchType;
      });
    }

    return result;
  }, [policies, selPolicyType, searchQuery]);

  const policyDetail = useMemo<Policy>(() => {
    if (!policyNo) return {} as Policy;

    return (
      filteredPolicies.find((p) => p.policy_no === policyNo) ?? ({} as Policy)
    );
  }, [filteredPolicies, policyNo]);

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
        policies: filteredPolicies,
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
