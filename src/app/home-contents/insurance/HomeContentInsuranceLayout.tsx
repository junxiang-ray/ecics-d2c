'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import InsuranceLayout from '@/components/layouts/InsuranceLayout';

// import { ProductType } from './basic-detail/options';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ROUTES } from '@/constants/routes';
import { setIsSingpassFlow } from '@/redux/slices/general.slice';
import { useAppDispatch } from '@/redux/store';

// set steps here for home content
const homeSteps = {
  [StepProcessBar.FIRST]: ROUTES.INSURANCE_HOMECONTENTS.BASIC_DETAIL,
  [StepProcessBar.POLICY_DETAILS]: ROUTES.INSURANCE_HOMECONTENTS.BASIC_DETAIL,
  [StepProcessBar.SELECT_PLAN]: ROUTES.INSURANCE_HOMECONTENTS.PLAN,
  [StepProcessBar.SELECT_ADD_ON]: ROUTES.INSURANCE_HOMECONTENTS.ADD_ON,
  [StepProcessBar.PERSONAL_DETAIL]:
    ROUTES.INSURANCE_HOMECONTENTS.PERSONAL_DETAIL,
  [StepProcessBar.COMPLETE_PURCHASE]:
    ROUTES.INSURANCE_HOMECONTENTS.COMPLETE_PURCHASE,
};

type OnSaveHandler = (fn: () => any) => void;

type HomeContentInsuranceLayoutProps = {
  children: (props: { onSave: OnSaveHandler }) => React.ReactNode;
};

export default function HomeContentInsuranceLayout({
  children,
}: HomeContentInsuranceLayoutProps) {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const manual = searchParams.get('manual') || '';
  const isManual = manual === 'true';

  useEffect(() => {
    dispatch(setIsSingpassFlow(!isManual));
  }, [manual, dispatch]);

  return (
    <>
      <InsuranceLayout
        stepToRoute={homeSteps}
        headerTitle='Home Content Insurance Quotation'
        redirectToLoginPath={ROUTES.HOMECONTENT.LOGIN}
        productType={ProductType.HOMECONTENTS}
      >
        {children}
      </InsuranceLayout>
    </>
  );
}
