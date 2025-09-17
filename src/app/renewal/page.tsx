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
import { useRetriveNricSingpass } from '@/hook/auth/login-renewal';
import {
  useCheckPolicyRenewal,
  useVerifyRetrieveRenewal,
} from '@/hook/insurance/renewal';
import {
  useGetTimeoutRenewal,
  usePostCheckPolicies,
} from '@/hook/renewal/renewalQuote';
import { setIsSingpassFlowRenewal } from '@/redux/slices/general.slice';
import {
  setEditRenewal,
  setProductType,
  setTimeoutValue,
  updateRenewalQuote,
  updateVehData,
} from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import { AllInsurancesRenewed } from './components/AllInsurancesRenewed';

export default function RenewalPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
  );
  const [payload, setPayload] = useState({
    code_verifier: '',
    nonce: '',
    state: '',
    code: '',
  });

  const { mutate: retriveNricSingpass, isPending: isRetriveNricLoading } =
    useRetriveNricSingpass();
  const {
    mutate: verifyRetrieveRenewal,
    data: vehData,
    isPending: isVehLoading,
  } = useVerifyRetrieveRenewal();
  const { mutate: checkPolicyRenewal, isPending: isLoadingCheckPolicy } =
    useCheckPolicyRenewal();
  const { mutate: getTimeoutRenewal } = useGetTimeoutRenewal();
  const { mutate: checkPolicies } = usePostCheckPolicies();
  const vehDataStore = useAppSelector((state) => state.renewalQuote.vehData);

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
    if (!renewalQuote?.uinfin?.value && payload.code_verifier && payload.code) {
      retriveNricSingpass(
        { payload },
        {
          onSuccess: (res) => {
            if (res?.data) {
              dispatch(
                updateRenewalQuote({
                  uinfin: { value: res.data },
                }),
              );
            }
          },
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
  }, [renewalQuote?.uinfin?.value]);

  useEffect(() => {
    if (vehData) {
      dispatch(updateVehData(vehData));
    }
  }, [vehData]);

  useEffect(() => {
    if (!vehData?.policies?.length) return;
    // case < 2 policies
    if (vehData?.policies?.length < 2) {
      const policy = vehData.policies[0];
      const veh_reg_no = policy?.veh_reg_no;
      if (policy?.status?.toLowerCase() === 'renewed') return;

      if (policy?.dob && renewalQuote?.uinfin?.value) {
        const passphrase = createPassphrase(
          policy.dob,
          renewalQuote.uinfin.value,
        );

        checkPolicies([{ veh_reg_no }], {
          onSuccess: (res) => {
            if (res?.data?.length) {
              const vehRegNo = res.data[0].veh_reg_no;
              checkPolicyRenewal(
                { veh_reg_no: vehRegNo, passphrase },
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
            } else {
              // Get list of reg_no confirmed by API
              const validVehs = res.data.map(
                (r: { veh_reg_no: string }) => r.veh_reg_no,
              );
              const updatedPolicies = vehData.policies.filter((p: any) =>
                validVehs.includes(p.veh_reg_no),
              );
              dispatch(
                updateVehData({
                  insuredname: vehData.insuredname,
                  policies: updatedPolicies,
                }),
              );
            }
          },
        });
      }
    } else {
      // case >= 2 policies
      const payload = vehData.policies.map((p: any) => ({
        veh_reg_no: p.veh_reg_no,
      }));

      checkPolicies(payload, {
        onSuccess: (res) => {
          if (res?.data?.length > 0) {
            // Get list of reg_no confirmed by API
            const validVehs = res.data.map(
              (r: { veh_reg_no: string }) => r.veh_reg_no,
            );

            const updatedPolicies = vehData.policies.filter((p: any) =>
              validVehs.includes(p.veh_reg_no),
            );

            dispatch(
              updateVehData({
                insuredname: vehData.insuredname,
                policies: updatedPolicies,
              }),
            );
          } else {
            dispatch(updateVehData({ insuredname: '', policies: [] }));
          }
        },
      });
    }
  }, [vehData, router, renewalQuote, dispatch]);

  if (isRetriveNricLoading || isVehLoading || isLoadingCheckPolicy) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  const policiesPending =
    vehDataStore?.policies?.filter(
      (item: any) => item?.status?.trim().toLowerCase() !== 'renewed',
    ) ?? [];

  return (
    <main>
      <div className='border-b border-gray-200 '>
        <RenewalHeader />
      </div>
      <div className='mx-auto max-w-[1200px] px-4 py-4 md:px-0 md:py-8'>
        <h1 className='mb-2 text-2xl font-bold md:text-3xl'>
          Welcome back {renewalQuote?.renewal_info?.insured_info?.name || ''}!
        </h1>
        <p className='mb-6 text-gray-500'>
          Manage your policies and stay protected
        </p>
      </div>

      {(!vehDataStore ||
        vehDataStore.policies?.length === 0 ||
        (vehDataStore.policies?.length === 1 &&
          vehDataStore.policies[0]?.status?.toLowerCase() === 'renewed') ||
        policiesPending.length === 0) && <AllInsurancesRenewed />}

      {vehDataStore?.policies && policiesPending.length > 0 && (
        <section className='mb-8'>
          <PoliciesPendingRenewal policies={policiesPending} />
        </section>
      )}

      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        <Promotions />
        <Announcements />
      </div>

      <QuickActions />
    </main>
  );
}
