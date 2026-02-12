// src/libs/utils/policy.ts

import { Props as BadgeProps } from '@/components/ui/Badge';
import { PolicyStatus, PolicyTag, PolicyType } from '@/libs/types/policy';

/* =========================================================
 * Domain logic (source of truth)
 * ========================================================= */

const MS_IN_DAY = 1000 * 60 * 60 * 24;

export const computePolicyStatus = (
  backendStatus: string,
  startDate: string,
  endDate: string,
): PolicyStatus => {
  if (backendStatus?.toLowerCase() === 'cancelled') {
    return 'cancelled';
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'pending';
  if (now > end) return 'expired';
  return 'active';
};

export const computePolicyTag = (
  status: PolicyStatus,
  endDate: string,
): PolicyTag | undefined => {
  if (status !== 'active') return undefined;

  const now = new Date();
  const end = new Date(endDate);

  return (end.getTime() - now.getTime()) / MS_IN_DAY <= 60
    ? 'pending_renewal'
    : undefined;
};

/* =========================================================
 * UI helpers (presentation only)
 * ========================================================= */

export const getPolicyStatusTag = (
  status?: PolicyStatus,
  tags?: PolicyTag,
): { color: BadgeProps['color']; label: string } | null => {
  if (status) {
    if (status === 'active') return { label: 'Active', color: 'green' };
    if (status === 'pending') return { label: 'Pending', color: 'yellow' };
    if (status === 'cancelled') return { label: 'Cancelled', color: 'gray' };
    if (status === 'expired') return { label: 'Expired', color: 'red' };
  }

  if (tags) {
    if (tags === 'pending_renewal') {
      return { label: 'Pending Renewal', color: 'orange' };
    }
    if (tags === 'renewed') {
      return { label: 'Renewed', color: 'blue' };
    }
  }

  return null;
};

export const getPolicyTypeName = (policyType?: PolicyType): string | null => {
  if (policyType === 'all') return 'All Types';
  if (policyType === 'car') return 'Motor Vehicle - Car';
  if (policyType === 'motorcycle') return 'Motor Vehicle - Motorcycle';
  if (policyType === 'maid') return 'Maid';
  if (policyType === 'home') return 'Home Content';
  if (policyType === 'travel') return 'Travel Insurance';
  return null;
};
