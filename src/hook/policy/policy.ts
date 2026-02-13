// src/hook/policy/policy.ts
import { usePolicyData, usePolicyDetail } from './usePolicyData';

export { usePolicyData, usePolicyDetail };

export const usePoliciePreviews = (
  policyStatus?: import('@/libs/types/policy').PolicyStatus,
  tags?: import('@/libs/types/policy').PolicyTag[],
) => usePolicyData({ policyStatus, tags, limit: 3 });

export const usePolicies = () => usePolicyData();
