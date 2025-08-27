'use client';

import PlanDetail from './PlanDetail';
import HomeContentInsuranceLayout from '../HomeContentInsuranceLayout';

function PlanPage({}) {
  return (
    <HomeContentInsuranceLayout>
      {({ onSave }) => <PlanDetail onSaveRegister={onSave} />}
    </HomeContentInsuranceLayout>
  );
}

export default PlanPage;
