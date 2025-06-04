'use client';

import PlanDetail from './PlanDetail';
import InsuranceLayout from '../InsuranceLayout';

function PlanPage({}) {
  return (
    <InsuranceLayout>
      {({ onSave, handleBack }) => (
        <PlanDetail onSaveRegister={onSave} handleBack={handleBack} />
      )}
    </InsuranceLayout>
  );
}

export default PlanPage;
