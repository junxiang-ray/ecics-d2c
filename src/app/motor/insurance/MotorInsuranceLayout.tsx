import { StepProcessBar } from '@/libs/enums/processBarEnums';

import InsuranceLayout from '@/components/layouts/InsuranceLayout';

import { ROUTES } from '@/constants/routes';

const motorSteps = {
  [StepProcessBar.POLICY_DETAILS]: ROUTES.INSURANCE.BASIC_DETAIL,
  [StepProcessBar.SELECT_PLAN]: ROUTES.INSURANCE.PLAN,
  [StepProcessBar.SELECT_ADD_ON]: ROUTES.INSURANCE.ADD_ON,
  [StepProcessBar.PERSONAL_DETAIL]: ROUTES.INSURANCE.PERSONAL_DETAIL,
  [StepProcessBar.COMPLETE_PURCHASE]: ROUTES.INSURANCE.COMPLETE_PURCHASE,
};
type OnSaveHandler = (fn: () => any) => void;

type MotorInsuranceLayoutProps = {
  children: (props: { onSave: OnSaveHandler }) => React.ReactNode;
};

export default function MotorInsuranceLayout({
  children,
}: MotorInsuranceLayoutProps) {
  return (
    <InsuranceLayout
      stepToRoute={motorSteps}
      headerTitle='Car Insurance Quotation'
      redirectToLoginPath={ROUTES.MOTOR.LOGIN}
    >
      {children}
    </InsuranceLayout>
  );
}
