'use client';

import AddOnDetail from './AddonDetail';
import MotorcycleInsuranceLayout from '../MotorcycleInsuranceLayout';

export default function AddonPage() {
  return (
    <MotorcycleInsuranceLayout>
      {({ onSave }) => <AddOnDetail onSaveRegister={onSave} />}
    </MotorcycleInsuranceLayout>
  );
}
