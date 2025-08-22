'use client';

import AddOnDetail from './AddonDetail';
import MaidInsuranceLayout from '../HomeContentInsuranceLayout';

export default function AddonPage() {
  return (
    <MaidInsuranceLayout>
      {({ onSave }) => <AddOnDetail onSaveRegister={onSave} />}
    </MaidInsuranceLayout>
  );
}
