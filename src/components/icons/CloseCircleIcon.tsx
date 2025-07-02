'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import CloseCircleIconSvg from '@/assets/icons/close_circle.svg';

const CloseCircleIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={CloseCircleIconSvg} {...props} />;
};

export default CloseCircleIcon;
