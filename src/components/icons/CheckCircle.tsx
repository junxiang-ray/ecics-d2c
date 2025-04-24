'use client';

import CheckCircleIconSvg from '@/assets/icons/check_circle.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const CheckCircle = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={CheckCircleIconSvg} {...props} />;
};

export default CheckCircle;
