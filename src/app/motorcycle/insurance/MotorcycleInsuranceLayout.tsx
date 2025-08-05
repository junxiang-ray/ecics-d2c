'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import InsuranceLayout from '@/components/layouts/InsuranceLayout';

import { ROUTES } from '@/constants/routes';
import { setIsSingpassFlow } from '@/redux/slices/general.slice';
import { useAppDispatch } from '@/redux/store';

// import { ProductType } from './basic-detail/options';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';

const motorcycleSteps = {
  [StepProcessBar.POLICY_DETAILS]: ROUTES.INSURANCE_MOTORCYCLE.BASIC_DETAIL,
  [StepProcessBar.SELECT_PLAN]: ROUTES.INSURANCE_MOTORCYCLE.PLAN,
  [StepProcessBar.SELECT_ADD_ON]: ROUTES.INSURANCE_MOTORCYCLE.ADD_ON,
  [StepProcessBar.PERSONAL_DETAIL]: ROUTES.INSURANCE_MOTORCYCLE.PERSONAL_DETAIL,
  [StepProcessBar.COMPLETE_PURCHASE]:
    ROUTES.INSURANCE_MOTORCYCLE.COMPLETE_PURCHASE,
};

type OnSaveHandler = (fn: () => any) => void;

type MotorcycleInsuranceLayoutProps = {
  children: (props: { onSave: OnSaveHandler }) => React.ReactNode;
};

export default function MotorcycleInsuranceLayout({
  children,
}: MotorcycleInsuranceLayoutProps) {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const manual = searchParams.get('manual') || '';
  const isManual = manual === 'true';

  useEffect(() => {
    dispatch(setIsSingpassFlow(!isManual));
  }, [manual, dispatch]);

  return (
    <InsuranceLayout
      stepToRoute={motorcycleSteps}
      headerTitle='Motorcycle Insurance Quotation'
      redirectToLoginPath={ROUTES.MOTORCYCLE.LOGIN}
      productType={ProductType.MOTORCYCLE}
    >
      {children}
    </InsuranceLayout>
  );
}
