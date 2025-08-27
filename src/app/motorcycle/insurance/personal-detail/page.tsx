'use client';

import AddOnBonusDetailManualForm from './AddOnBonusDetailManualForm';
import MotorcycleInsuranceLayout from '../MotorcycleInsuranceLayout';

export default function PersonalDetailPage() {
  return (
    <MotorcycleInsuranceLayout>
      {({ onSave }) => <AddOnBonusDetailManualForm onSaveRegister={onSave} />}
    </MotorcycleInsuranceLayout>
  );
}
