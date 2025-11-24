import { Props as BadgeProps } from '@/components/ui/Badge';

import { PolicyStatus, PolicyTag, PolicyType } from '@/libs/types/policy';

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
    if (tags === 'pending') return { label: 'Pending', color: 'yellow' };
    if (tags === 'pending_renewal')
      return { label: 'Pending Renewal', color: 'orange' };
    if (tags === 'renewed') return { label: 'Renewed', color: 'blue' };
  }

  return null;
};

export const getPolicyTypeName = (policyType?: PolicyType): string | null => {
  if (policyType === 'all') return 'All Types';
  if (policyType === 'car') return 'Motor Vehicle - Car';
  if (policyType === 'motorcycle') return 'Motor Vehicle - Motocycle';
  if (policyType === 'maid') return 'Maid';
  if (policyType === 'home') return 'Home Content';
  if (policyType === 'travel') return 'Traval Insuarance';

  return null;
};
