'use client';

import { ROUTES } from '@/constants/routes';

import { Policy, PolicyType } from '@/libs/types/policy';

import { useEffect, useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';

import { Empty } from 'antd';

import DownloadOutlined from '@/assets/icons/renewal/download.svg';
import BackOutlined from '@/assets/icons/renewal/back.svg';
import PolicyDetail from '@/components/page/policy/policy-detail/PolicyDetail';
import VehiclePolicyDetail from '@/components/page/policy/policy-detail/VehiclePolicyDetail';
import InsuredMaidDetail from '@/components/page/policy/policy-detail/InsuredMaidDetail';
import VehicleDetail from '@/components/page/policy/policy-detail/VehicleDetail';
import CoverageDetail from '@/components/page/policy/policy-detail/CoverageDetail';
import PolicyholderDetail from '@/components/page/policy/policy-detail/PolicyholderDetail';
import ExcessApplicableDetail from '@/components/page/policy/policy-detail/ExcessApplicableDetail';
import DriverDetail from '@/components/page/policy/policy-detail/DriverDetail';

const ClaimDetail = (): React.ReactNode => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { claimDetail } = useContext(ClaimContext);

  const backToPreviousPage = (): void => {
    if (window.history.length > 0) return router.back();

    const params = new URLSearchParams(searchParams.toString());
    params.delete('no');
    let paramsStr = params.toString();
    if (paramsStr) paramsStr = `?${paramsStr}`;
    return router.push(`${ROUTES.PORTAL.POLICIES.ROOT}${paramsStr}`);
  };

  return (
    <div>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-5'>
          <button
            className='flex flex-nowrap items-center gap-2 font-body text-gray-600 transition-colors hover:text-gray-900'
            onClick={backToPreviousPage}
          >
            <BackOutlined />
            Back
          </button>
          <div className='h-6 w-px bg-gray-300' />
          <div>
            <h1 className='font-heading text-3xl font-bold text-gray-900'>
              Claim Details
            </h1>
            <p className='font-body text-gray-600'>{claimDetail?.claim_no}</p>
          </div>
        </div>
      </div>
      <div>{/*todo: Render claim detail here*/}</div>
    </div>
  );
};
export default ClaimDetail;
