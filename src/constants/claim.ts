import { PolicyType } from '@/libs/types/policy';

import CarOutlined from '@/assets/icons/add-on/car-outlined.svg';
import UserGroupOutlined from '@/assets/icons/add-on/user-group-outlined.svg';
import MotorcycleOutlined from '@/assets/icons/add-on/motorcycle-outlined.svg';
import HomeOutlined from '@/assets/icons/add-on/home-outlined.svg';
import BriefcaseOutlined from '@/assets/icons/briefcase-outlined.svg';

import CheckCircleOutlined from '@/assets/icons/check-circle.svg';
import CloseCircleOutlined from '@/assets/icons/close-circle-outlined.svg';

export const CLAIM_POLICY_TYPE_ICON: Record<
  Exclude<PolicyType, 'all'>,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  car: CarOutlined,
  motorcycle: MotorcycleOutlined,
  maid: UserGroupOutlined,
  home: HomeOutlined,
  travel: BriefcaseOutlined,
};

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
    COLOR: 'text-orange-600',
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
