// src/hook/policy/policy.ts
import { usePolicyData, usePolicyDetail } from './usePolicyData';
import { PolicyStatus, PolicyTag } from '@/libs/types/policy';

export { usePolicyData, usePolicyDetail };

export const usePoliciePreviews = (
  policyStatus?: PolicyStatus,
  tags?: PolicyTag[],
) => usePolicyData({ policyStatus, tags, limit: 10 });

// ⭐ Read filters from URL
export const usePolicies = () => usePolicyData({ readFromUrl: true });
