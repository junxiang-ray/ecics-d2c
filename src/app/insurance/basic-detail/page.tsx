import { VehicleSelection } from '@/components/VehicleSelection';
import { PolicyDetail } from './PolicyDetail';
import { Suspense } from 'react';

export default function PolicyDetailPage() {
  // list from Singpass
  // const veh_selection_option = [
  //   { value: 'BMW | 116d 1.5', text: 'BMW 116d 1.5' },
  //   {
  //     value: 'MERCEDES BENZ | A200 AMG Line 1.4',
  //     text: 'MERCEDES BENZ A200 AMG Line 1.4',
  //   },
  // ];

  //selected vehicle from singpass page
  const selected_vehicle_singpass: VehicleSelection = {
    regNo: 'SPT1818T',
    make: 'BMW',
    model: '116d 1.5',
    first_registered_year: 2024,
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PolicyDetail
        isSingPassFlow={true}
        selected_vehicle_singpass={selected_vehicle_singpass}
      />
    </Suspense>
  );
}
