'use client';

import { Drawer, Modal } from 'antd';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

function DeclarationConfirmModal({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
}) {
  const { isMobile } = useDeviceDetection();

  const handleConfirmClick = () => {
    onOk();
  };

  const content = (
    <div className='flex flex-col gap-6'>
      <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
        Declaration and Undertaking
      </p>
      <div className='scrollbar-hide flex max-h-[60vh] flex-col gap-2 overflow-y-auto bg-[#F4FBFD] px-2 text-justify text-sm text-[#000000]'>
        <p>
          <strong>Counter Indemnity</strong>
        </p>
        <p>
          The Counter Indemnity shall apply if I have not selected the Waiver of
          Counter Indemnity for Insurance Guarantee Bond (hereinafter referred
          to as "Guarantee") to Ministry of Manpower, Singapore (hereinafter
          referred to as "MOM").
        </p>
        <p>
          In consideration of ECICS Insurance (Singapore) Pte. Ltd. (hereinafter
          referred to as "ECICS") agreeing at my request to provide a Guarantee
          for the sum of Singapore Dollars Five Thousand Only (S$5,000) to MOM,
          as security for the due and satisfactory observance and performance of
          all conditions under the Security Bond in connection with my
          employment of a foreign domestic worker.
        </p>
        <p>
          I hereby irrevocably and unconditionally agree and undertake as
          follows:
        </p>
        <ol className='list-[lower-alpha] space-y-2 pl-6 text-sm text-[#000000]'>
          <li>
            To indemnify ECICS on demand in full against all claims, payments,
            demands, actions, suits, proceedings, losses, liabilities, costs,
            interests and expenses whatsoever which may be taken or made against
            ECICS or incurred or become payable by ECICS under the
            abovementioned Guarantee;
          </li>
          <li>
            That ECICS may at its absolute discretion compromise all claims,
            payments, demands, actions, suits, proceedings, losses, liabilities,
            costs, interests and expenses which may be taken or made against
            ECICS under the Guarantee;
          </li>
          <li>
            To accept all receipts, vouchers and other evidence of all payments
            made by ECICS or of all liabilities or obligations incurred by ECICS
            by reason of the Guarantee as conclusive evidence against me and my
            estate of the fact and extent of my liability herein;
          </li>
          <li>
            To pay ECICS interest based on 6% per annum on all sums paid by
            ECICS under the Guarantee calculated from the date when payment was
            made by ECICS until the date when full payment is received by ECICS
            from me, and to pay on an indemnity basis, all costs and expenses
            ECICS incurred or may incur in enforcing its rights under this
            Counter Indemnity including but not limited to any action or legal
            proceedings that may be commenced by ECICS;
          </li>
          <li>
            That this Counter Indemnity shall be a continuing indemnity and
            ECICS may at any time or times at its discretion without giving any
            notice to me extend the validity of or renew the Guarantee, or grant
            any indulgence or make any arrangement or compromise in relation to
            the Guarantee, without discharging or impairing my liability under
            this Counter Indemnity;
          </li>
          <li>
            That no delay or omission on the part of ECICS in exercising any
            rights, power, privilege or remedy in respect of this Counter
            Indemnity shall impair such rights, power, privilege or remedy. The
            rights, powers, privileges and remedies provided in this Counter
            Indemnity are cumulative and not exclusive of any rights, powers,
            privileges and remedies provided by law;
          </li>
          <li>
            My liability herein is irrevocable and shall remain in full force
            and effect until the liability of ECICS under the Guarantee has been
            fully discharged to the satisfaction of ECICS; and
          </li>
          <li>
            That this Counter Indemnity shall be governed and construed by the
            laws of the Republic of Singapore, and I irrevocably submit to the
            jurisdiction of the Courts of the Republic of Singapore.
          </li>
        </ol>
        <p>
          <strong>DECLARATION</strong>
        </p>
        <p>
          The Counter Indemnity shall apply if I have not selected the Waiver of
          Counter Indemnity for Insurance Guarantee Bond (hereinafter referred
          to as "Guarantee") to Ministry of Manpower, Singapore (hereinafter
          referred to as "MOM").
        </p>
        <p>
          In consideration of ECICS Insurance (Singapore) Pte. Ltd. (hereinafter
          referred to as "ECICS") agreeing at my request to provide a Guarantee
          for the sum of Singapore Dollars Five Thousand Only (S$5,000) to MOM,
          as security for the due and satisfactory observance and performance of
          all conditions under the Security Bond in connection with my
          employment of a foreign domestic worker.
        </p>
        <p>
          I hereby irrevocably and unconditionally agree and undertake as
          follows:
        </p>
        <ol className='list-[lower-alpha] space-y-2 pl-6 text-sm text-[#000000]'>
          <li>
            To indemnify ECICS on demand in full against all claims, payments,
            demands, actions, suits, proceedings, losses, liabilities, costs,
            interests and expenses whatsoever which may be taken or made against
            ECICS or incurred or become payable by ECICS under the
            abovementioned Guarantee;
          </li>
          <li>
            That ECICS may at its absolute discretion compromise all claims,
            payments, demands, actions, suits, proceedings, losses, liabilities,
            costs, interests and expenses which may be taken or made against
            ECICS under the Guarantee;
          </li>
          <li>
            To accept all receipts, vouchers and other evidence of all payments
            made by ECICS or of all liabilities or obligations incurred by ECICS
            by reason of the Guarantee as conclusive evidence against me and my
            estate of the fact and extent of my liability herein;
          </li>
          <li>
            To pay ECICS interest based on 6% per annum on all sums paid by
            ECICS under the Guarantee calculated from the date when payment was
            made by ECICS until the date when full payment is received by ECICS
            from me, and to pay on an indemnity basis, all costs and expenses
            ECICS incurred or may incur in enforcing its rights under this
            Counter Indemnity including but not limited to any action or legal
            proceedings that may be commenced by ECICS;
          </li>
          <li>
            That this Counter Indemnity shall be a continuing indemnity and
            ECICS may at any time or times at its discretion without giving any
            notice to me extend the validity of or renew the Guarantee, or grant
            any indulgence or make any arrangement or compromise in relation to
            the Guarantee, without discharging or impairing my liability under
            this Counter Indemnity;
          </li>
          <li>
            That no delay or omission on the part of ECICS in exercising any
            rights, power, privilege or remedy in respect of this Counter
            Indemnity shall impair such rights, power, privilege or remedy. The
            rights, powers, privileges and remedies provided in this Counter
            Indemnity are cumulative and not exclusive of any rights, powers,
            privileges and remedies provided by law;
          </li>
          <li>
            My liability herein is irrevocable and shall remain in full force
            and effect until the liability of ECICS under the Guarantee has been
            fully discharged to the satisfaction of ECICS; and
          </li>
          <li>
            That this Counter Indemnity shall be governed and construed by the
            laws of the Republic of Singapore, and I irrevocably submit to the
            jurisdiction of the Courts of the Republic of Singapore.
          </li>
        </ol>
      </div>
      <div className='flex flex-col gap-4'>
        <p className='text-sm font-semibold text-[#000000]'>
          By agreeing, you acknowledge that you have read and agree to the
          Counter Indemnity and Declaration applicable to Online Payment.
        </p>
        <div className='flex flex-row justify-between'>
          <SecondaryButton
            onClick={onCancel}
            danger
            className='mr-[10px] w-[150px] rounded-none py-3 text-left text-base font-semibold'
          >
            Disagree
          </SecondaryButton>
          <PrimaryButton
            onClick={handleConfirmClick}
            className='ml-[10px] w-[150px] bg-[#34C759] py-3 text-end text-base font-semibold text-white'
          >
            Agree
          </PrimaryButton>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={onCancel}
        closable={false}
        height='auto'
        className='rounded-t-xl'
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Modal
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      closable={true}
      maskClosable={true}
      keyboard={true}
      footer={null}
      centered
      width={710}
    >
      {content}
    </Modal>
  );
}

export default DeclarationConfirmModal;
