'use client';

import MainDriverDetailsIconSvg from '@/assets/icons/main_driver_details.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const MainDriverDetailsIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={MainDriverDetailsIconSvg} {...props} />;
};

export default MainDriverDetailsIcon;
