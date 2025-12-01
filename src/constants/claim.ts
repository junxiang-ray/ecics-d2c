import CheckCircleOutlined from '@/assets/icons/check-circle.svg';
import CloseCircleOutlined from '@/assets/icons/close-circle-outlined.svg';

export const CLAIM_PROGRESS = {
  SUBMITTED: 'submitted',
  INITIAL_REVIEW: 'initial_review',
  IN_REVIEW: 'in_review',
  DECISION: 'decision',
  SETTLEMENT: 'settlement',
} as const;

export const CLAIM_STATUS_CONF = {
  WAITING: {
    ICON: '',
    COLOR: 'text-[#000]/50',
  },
  IN_PROGRESS: {
    ICON: CheckCircleOutlined,
    COLOR: 'text-orange-700',
  },
  SUCCESS: {
    ICON: CheckCircleOutlined,
    COLOR: 'text-green-700',
  },
  FAILED: {
    ICON: CloseCircleOutlined,
    COLOR: 'text-red-700',
  },
} as const;
