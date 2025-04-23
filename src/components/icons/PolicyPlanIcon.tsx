'use client';

import PolicyPlanIconSvg from '@/assets/icons/policy_plan.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const PolicyPlanIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={PolicyPlanIconSvg} {...props} />;
};

export default PolicyPlanIcon;
