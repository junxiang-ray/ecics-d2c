'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import InsuranceLayout from '../InsuranceLayout';
import PlanDetail from './PlanDetail';

function PlanPage({}) {
  return (
    <InsuranceLayout>
      {({ onSave }) => <PlanDetail onSaveRegister={onSave} />}
    </InsuranceLayout>
  );
}

export default PlanPage;
