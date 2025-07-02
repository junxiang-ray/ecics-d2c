'use client';

import AddOnBonusDetailManualForm from './AddOnBonusDetailManualForm';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

export default function PersonalDetailPage() {
  return (
    <MotorInsuranceLayout>
      {({ onSave }) => <AddOnBonusDetailManualForm onSaveRegister={onSave} />}
    </MotorInsuranceLayout>
  );
}
