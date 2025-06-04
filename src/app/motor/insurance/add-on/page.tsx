'use client';

import AddOnDetail from './AddonDetail';
import InsuranceLayout from '../InsuranceLayout';

export default function AddonPage() {
  return (
    <InsuranceLayout>
      {({ onSave, handleBack }) => (
        <AddOnDetail onSaveRegister={onSave} handleBack={handleBack} />
      )}
    </InsuranceLayout>
  );
}
