'use client';

import CrossMarkIconSvg from '@/assets/icons/cross_mark.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const CrossMarkIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={CrossMarkIconSvg} {...props} />;
};

export default CrossMarkIcon;
