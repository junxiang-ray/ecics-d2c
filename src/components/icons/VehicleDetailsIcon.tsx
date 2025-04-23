'use client';

import VehicleDetailsIconSvg from '@/assets/icons/vehicle_details.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const VehicleDetailsIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={VehicleDetailsIconSvg} {...props} />;
};

export default VehicleDetailsIcon;
