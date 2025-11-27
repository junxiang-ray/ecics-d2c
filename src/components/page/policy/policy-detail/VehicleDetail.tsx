import { VehicleInfo } from '@/libs/types/policy';

import Card from './PolicyCard';
import CarOutlined from '@/assets/icons/add-on/car-outlined.svg';

interface Props {
  data?: VehicleInfo;
}

const VehicleDetail = ({ data }: Props): JSX.Element | null => {
  if (!data) return null;

  const row = (
    label: string,
    indexKey: keyof Omit<VehicleInfo, 'company'>,
  ): JSX.Element => {
    return (
      <div>
        <label className='mb-1.5 block font-body text-sm font-medium text-gray-700'>
          {label}
        </label>
        <p className='font-body text-base font-semibold text-gray-900 opacity-80'>
          {data[indexKey] || 'N/A'}
        </p>
      </div>
    );
  };

  return (
    <Card
      title='Vehicle Details'
      subTitle='Information about your insured vehicle'
      icon={<CarOutlined width='21' height='21' />}
    >
      <>
        <h3 className='mb-4 font-heading text-base font-semibold text-gray-900'>
          Vehicle Information
        </h3>
        <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
          {row('Registration Number', 'registration_no')}
          {row('Make / Model', 'vehicle_make')}
          {row('Chassis Number', 'chasis_number')}
          {row('Engine / Motor Number', 'engine_no')}
          {row('Capacity', 'engine_capacity')}
          {row('Registration Year', 'first_registered_year')}
          {row('Vehicle Usage', 'vehicle_usage')}
          {row('Hire Purchase Company', 'hire_purchase_company')}
        </div>
      </>
    </Card>
  );
};
export default VehicleDetail;
