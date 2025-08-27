'use client';

import PlanDetail from './PlanDetail';
import MotorcycleInsuranceLayout from '../MotorcycleInsuranceLayout';

function PlanPage({}) {
  return (
    <MotorcycleInsuranceLayout>
      {({ onSave }) => <PlanDetail onSaveRegister={onSave} />}
    </MotorcycleInsuranceLayout>
  );
}

export default PlanPage;
