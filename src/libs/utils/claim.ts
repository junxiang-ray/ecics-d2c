import { Props as BadgeProps } from '@/components/ui/Badge';
import { ClaimStatus } from '@/libs/types/claim';

export const getClaimStatusTag = (
  status: ClaimStatus,
): { color: BadgeProps['color']; label: string } | null => {
  switch (status) {
    default:
      return null;
    case 'draft':
      return { label: 'Draft', color: 'orange' };
    case 'processing':
      return { label: 'Processing', color: 'yellow' };
    case 'approved':
      return { label: 'Approved', color: 'blue' };
    case 'settled':
      return { label: 'Settled', color: 'green' };
    case 'rejected':
      return { label: 'Rejected', color: 'red' };
  }
};
