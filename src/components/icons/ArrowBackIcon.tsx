'use client';

import ArrowBackIconSvg from '@/assets/icons/arrow_back.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const ArrowBackIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={ArrowBackIconSvg} {...props} />;
};

export default ArrowBackIcon;
