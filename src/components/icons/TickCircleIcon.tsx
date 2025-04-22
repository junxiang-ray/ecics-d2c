'use client';

import TickCircleIconSvg from '@/assets/icons/tick_circle.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const TickCircleIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={TickCircleIconSvg} {...props} />;
};

export default TickCircleIcon;
