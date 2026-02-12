'use client';
// can delete
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hook/auth/useAuth';
import type { PolicySummary } from '@/hook/policy/usePolicyData';

export const usePolicyCache = (): PolicySummary[] | undefined => {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return queryClient.getQueryData<PolicySummary[]>(['policies', auth?.nric]);
};
