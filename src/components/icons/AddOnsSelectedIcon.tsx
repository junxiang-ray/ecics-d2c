'use client';

import AddOnsSelectedIconSvg from '@/assets/icons/add_ons_selected.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const AddOnsSelectedIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={AddOnsSelectedIconSvg} {...props} />;
};

export default AddOnsSelectedIcon;
