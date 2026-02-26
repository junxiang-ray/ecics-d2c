'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hook/auth/useAuth';
import type { Policy } from '@/libs/types/policy'; // ⭐ Changed from PolicySummary to Policy

export const usePolicyCache = (): Policy[] | undefined => {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  // ⭐ Updated query key to match usePolicyData
  return queryClient.getQueryData<Policy[]>(['policies', 'list', auth?.nric]);
};
