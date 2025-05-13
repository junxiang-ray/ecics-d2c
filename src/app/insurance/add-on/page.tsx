'use client';

import { Plan } from '@/libs/types/quote';
import 'swiper/css';
import 'swiper/css/navigation';
import InsuranceLayout from '../InsuranceLayout';
import AddOnDetail from './AddonDetail';

export interface FormatPlan extends Plan {
  discount: number;
  currentPrice: number;
}
function AddonPage({}) {
  return (
    <InsuranceLayout>
      {({ onSave }) => <AddOnDetail onSaveRegister={onSave} />}
    </InsuranceLayout>
  );
}

export default AddonPage;
