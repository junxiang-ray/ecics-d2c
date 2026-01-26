// hooks/policy/usePolicyCookie.ts - SIMPLE SERVER CALL
'use client';
import { useQuery } from '@tanstack/react-query';
import { PolicySummary } from './usePolicyData';

export function usePolicyCookie() {
  return useQuery({
    queryKey: ['policies', 'cookie'],
    queryFn: async (): Promise<PolicySummary[] | null> => {
      const response = await fetch('/api/v1/policy/cookie-policies', {
        method: 'GET',
        credentials: 'include', // Sends cookies automatically
      });

      if (!response.ok) {
        console.log('ℹ️ No _pd cookie available');
        return null;
      }

      const { policies } = await response.json() as { policies: PolicySummary[] };
      console.log('✅ Loaded policies from _pd cookie:', policies.length);
      return policies;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: false,
    enabled: true,
  });
}
