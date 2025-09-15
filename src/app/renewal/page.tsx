'use client';

import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createPassphrase } from '@/libs/utils/utils';

import Announcements from '@/app/renewal/components/announcements/Announcements';
import PoliciesPendingRenewal from '@/app/renewal/components/policies-renewal/PoliciesPendingRenewal';
import Promotions from '@/app/renewal/components/promotions/Promotions';
import QuickActions from '@/app/renewal/components/quick-action/QuickActions';
import RenewalHeader from '@/app/renewal/components/renewal-header/RenewalHeader';
import { ROUTES } from '@/constants/routes';
import { usePostUserInfoRenewal } from '@/hook/auth/login-renewal';
import {
  useCheckPolicyRenewal,
  useVerifyRetrieveRenewal,
} from '@/hook/insurance/renewal';
import { useGetTimeoutRenewal } from '@/hook/renewal/renewalQuote';
import { setIsSingpassFlowRenewal } from '@/redux/slices/general.slice';
import {
  setTimeoutValue,
  updateRenewalQuote,
  updateVehData,
} from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import { AllInsurancesRenewed } from './components/AllInsurancesRenewed';
import { PRODUCT_NAME } from '../api/constants/product';

export default function RenewalPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
  );
  const timeOut = useAppSelector(
    (state) => state.renewalQuote.idleWorker.timeoutValue,
  );

  const [payload, setPayload] = useState({
    code_verifier: '',
    nonce: '',
    state: '',
    code: '',
  });

  const { mutateAsync: postUserInfoRenewal, isPending } =
    usePostUserInfoRenewal();
  const {
    mutateAsync: verifyRetrieveRenewal,
    data: vehData,
    isPending: isVehLoading,
  } = useVerifyRetrieveRenewal();
  const { mutateAsync: checkPolicyRenewal, isPending: isLoadingCheckPolicy } =
    useCheckPolicyRenewal();
  const { mutate: getTimeoutRenewal } = useGetTimeoutRenewal();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      const code = query.get('code') || '';
      const state = query.get('state') || '';
      const code_verifier = sessionStorage.getItem('code_verifier') || '';
      const nonce = sessionStorage.getItem('nonce') || '';
      setPayload({ code_verifier, nonce, state, code });
    }
  }, []);

  useEffect(() => {
    if (
      !renewalQuote?.uinfin?.value &&
      payload.code_verifier &&
      payload.nonce &&
      payload.state &&
      payload.code
    ) {
      postUserInfoRenewal({ payload, productType: PRODUCT_NAME.RENEWAL }).then(
        (res) => {
          if (res?.data) {
            dispatch(updateRenewalQuote(res.data));
          }
        },
      );
    }
  }, [payload, renewalQuote?.renewal_info?.insured_info?.nric]);

  useEffect(() => {
    if (renewalQuote?.uinfin?.value) {
      verifyRetrieveRenewal(
        { nric: renewalQuote?.uinfin?.value },
        {
          onSuccess: (res) => {
            dispatch(setIsSingpassFlowRenewal(true));
            getTimeoutRenewal(undefined, {
              onSuccess: (timeoutRes) => {
                const minutes =
                  timeoutRes?.data?.attributes?.session_timeout_minutes ?? 0;
                const timeoutMs = Number(minutes) * 60 * 1000;
                dispatch(setTimeoutValue(timeoutMs));
              },
            });
          },
        },
      );
    }
  }, [renewalQuote?.uinfin?.value, timeOut]);

  useEffect(() => {
    if (vehData) {
      dispatch(updateVehData(vehData));
    }
  }, [vehData]);

  useEffect(() => {
    if (!vehData || !Array.isArray(vehData)) return;
    if (vehData?.length < 2) {
      const policy = vehData[0];
      const veh_reg_no = policy?.veh_reg_no;
      if (policy.status.toLowerCase() === 'renewed') {
        return;
      }
      if (policy.dob && renewalQuote?.uinfin?.value) {
        const passphrase = createPassphrase(
          policy.dob,
          renewalQuote.uinfin.value,
        );
        checkPolicyRenewal({
          veh_reg_no: veh_reg_no,
          passphrase,
        }).then((res) => {
          if (res) {
            dispatch(updateRenewalQuote(res));
          }
          router.push(ROUTES.RENEWAL.RENEWAL_NOTICE);
        });
      }
    }
  }, [vehData, router]);

  if (isPending || isVehLoading || isLoadingCheckPolicy) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  const policiesPending = Array.isArray(vehData)
    ? vehData.filter((item: any) => item?.status?.toLowerCase() !== 'renewed')
    : [];

  return (
    <main>
      <div className='border-b border-gray-200 '>
        <RenewalHeader />
      </div>
      <div className='mx-auto max-w-[1200px] px-4 py-4 md:px-0 md:py-8'>
        <h1 className='mb-2 text-2xl font-bold md:text-3xl'>
          Welcome back, {renewalQuote?.name?.value}
        </h1>
        <p className='mb-6 text-gray-500'>
          Manage your policies and stay protected
        </p>
      </div>

      {vehData?.length === 1 &&
        vehData[0]?.status?.toLowerCase() === 'renewed' && (
          <AllInsurancesRenewed />
        )}
      {vehData?.length >= 2 && policiesPending.length > 0 && (
        <section className='mb-8'>
          <PoliciesPendingRenewal policies={policiesPending} />
        </section>
      )}
      {vehData?.length >= 2 && policiesPending.length === 0 && (
        <AllInsurancesRenewed />
      )}

      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        <Promotions />
        <Announcements />
      </div>

      <QuickActions />
    </main>
  );
}
