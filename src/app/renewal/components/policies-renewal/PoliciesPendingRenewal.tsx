'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { createPassphrase } from '@/libs/utils/utils';

import { PrivateMotorCarIcon } from '@/components/icons/renewal-icons';

import { ECICS_USER_INFO } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { useCheckPolicyRenewal } from '@/hook/insurance/renewal';
import {
  setEditRenewal,
  setProductType,
  updateRenewalQuote,
} from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch } from '@/redux/store';

interface Policy {
  id?: string;
  product: string;
  plan: string;
  policy_no: string;
  expiry_date: string;
  veh_reg_no: string;
  status: string;
  dob: string;
}

interface Props {
  policies: Policy[];
}

const PoliciesPendingRenewal: FC<Props> = ({ policies }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate: checkPolicyRenewal } = useCheckPolicyRenewal();

  const handleRenew = (policy: Policy) => {
    const renewalUserInfoStr = sessionStorage.getItem(ECICS_USER_INFO);
    if (!renewalUserInfoStr) {
      console.error('User info not found in sessionStorage');
      return;
    }
    const renewalUserInfo = JSON.parse(renewalUserInfoStr);
    const nric = renewalUserInfo?.uinfin?.value || '';
    const passphrase = createPassphrase(policy.dob, nric);

    checkPolicyRenewal(
      {
        veh_reg_no: policy.veh_reg_no,
        passphrase,
      },
      {
        onSuccess: (res) => {
          if (res) {
            dispatch(updateRenewalQuote(res));
            dispatch(setEditRenewal(res.edit_renewal));
            dispatch(setProductType(res.product));
          }
          router.push(ROUTES.RENEWAL.RENEWAL_NOTICE);
        },
      },
    );
  };

  return (
    <div className='mx-auto max-w-[1200px] px-4 md:px-0'>
      <h2 className='mb-4 text-lg font-semibold'>Policies Pending Renewal</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {policies?.length ? (
          policies.map((policy) => (
            <div
              key={policy.id}
              onClick={() => handleRenew(policy)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 2px 5px rgba(0,0,0,0.08), -2px 2px 5px rgba(0,0,0,0.06), 2px 2px 5px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
              className='flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1'
            >
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center rounded-[10px] bg-sky-100 p-2'>
                  <PrivateMotorCarIcon className='text-2xl text-sky-500' />
                </div>

                <div className='flex-1'>
                  <p className='font-semibold'>{policy.product}</p>
                  <p className='text-xs text-gray-500'>{policy.plan}</p>
                </div>
                <span className='flex-shrink-0 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700'>
                  {policy.status}
                </span>
              </div>
              <hr className='-mx-4 mt-4 border-t border-gray-100' />
              <div className='mt-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-xs font-semibold text-gray-500'>
                    POLICY NUMBER
                  </div>
                  <div className='text-right text-xs font-semibold text-gray-500'>
                    EXPIRY DATE
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-[12px] font-semibold text-gray-900'>
                    {policy.policy_no}
                  </div>
                  <div className='text-right text-[12px] font-semibold text-gray-900'>
                    {policy.expiry_date}
                  </div>
                </div>
                <hr className='my-3 border-t border-gray-100' />
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-xs font-semibold text-gray-500'>
                      VEHICLE REGISTRATION
                    </div>
                    <div className='text-[12px] font-semibold text-gray-900'>
                      {policy.veh_reg_no}
                    </div>
                  </div>
                  <span className='mr-2 text-[12px] font-semibold text-sky-500'>
                    Renew Now &gt;
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No policies found</p>
        )}
      </div>
    </div>
  );
};

export default PoliciesPendingRenewal;
