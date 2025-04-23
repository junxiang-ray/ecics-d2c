'use client';

import ArrowDownIconSvg from '@/assets/icons/arrow_down.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const ArrowDownIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={ArrowDownIconSvg} {...props} />;
};

export default ArrowDownIcon;
