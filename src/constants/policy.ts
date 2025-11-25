import { PolicyType } from '@/libs/types/policy';

import CarOutlined from '@/assets/icons/add-on/car-outlined.svg';
import UserGroupOutlined from '@/assets/icons/add-on/user-group-outlined.svg';
import MotorcycleOutlined from '@/assets/icons/add-on/motorcycle-outlined.svg';
import HomeOutlined from '@/assets/icons/add-on/home-outlined.svg';
import PlaneOutlined from '@/assets/icons/add-on/plane-outlined.svg';

export const POLICY_TYPE_ICON: Record<
  Exclude<PolicyType, 'all'>,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  car: CarOutlined,
  motorcycle: MotorcycleOutlined,
  maid: UserGroupOutlined,
  home: HomeOutlined,
  travel: PlaneOutlined,
};
