'use client';

import MaidInsuranceLayout from '../MaidInsuranceLayout';
import HelpersDetail from './HelpersDetail';

export default function AddonPage() {
  return (
    <MaidInsuranceLayout>
      {({ onSave }) => <HelpersDetail onSaveRegister={onSave} />}
    </MaidInsuranceLayout>
  );
}
