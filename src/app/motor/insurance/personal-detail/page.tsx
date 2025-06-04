'use client';

import AddOnBonusDetailManualForm from './AddOnBonusDetailManualForm';
import InsuranceLayout from '../InsuranceLayout';

export default function AddonPage() {
  return (
    <InsuranceLayout>
      {({ onSave, handleBack }) => (
        <AddOnBonusDetailManualForm
          onSaveRegister={onSave}
          handleBack={handleBack}
        />
      )}
    </InsuranceLayout>
  );
}
