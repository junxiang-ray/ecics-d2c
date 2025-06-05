'use client';

import AddOnBonusDetailManualForm from './AddOnBonusDetailManualForm';
import InsuranceLayout from '../InsuranceLayout';

export default function AddonPage() {
  return (
    <InsuranceLayout>
      {({ onSave }) => <AddOnBonusDetailManualForm onSaveRegister={onSave} />}
    </InsuranceLayout>
  );
}
