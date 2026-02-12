'use client';

import { ROUTES } from '@/constants/routes';

import { PolicyType } from '@/libs/types/policy';

import { useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PolicyContext } from '@/components/contexts/PolicyLayoutContext';

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
import PolicyClausesDetail from '@/components/page/policy/policy-detail/PolicyClausesDetail';
import LowerTextDetail from '@/components/page/policy/policy-detail/LowerTextDetail';

const PolicyDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { policyDetail, loading } = useContext(PolicyContext);

  const isNoData = !loading && !policyDetail;

  const backToPreviousPage = (): void => {
    if (window.history.length > 0) return router.back();

    const params = new URLSearchParams(searchParams.toString());
    params.delete('no');
    let paramsStr = params.toString();
    if (paramsStr) paramsStr = `?${paramsStr}`;
    return router.push(`${ROUTES.PORTAL.POLICIES.ROOT}${paramsStr}`);
  };

  const isVehicle =
    !!policyDetail &&
    (['car', 'motorcycle'] as unknown as PolicyType[]).includes(
      policyDetail.policy_type,
    );
  const isPendingRenewal =
    !!policyDetail && policyDetail.tags === 'pending_renewal';

  return (
    <div>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <button
          className='font-body flex flex-nowrap items-center gap-2 text-gray-600 transition-colors hover:text-gray-900'
          onClick={backToPreviousPage}
        >
          <BackOutlined />
          Back
        </button>

        <div className='flex gap-3'>
          <button className='bg-background font-body flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#02ADEF] px-4 py-2 text-sm font-medium leading-none text-[#02ADEF] transition-all hover:bg-[#02ADEF] hover:text-white'>
            <DownloadOutlined className='h-4 w-4' />
            Download Policy Schedule
          </button>
          {isPendingRenewal && (
            <button className='font-body h-9 whitespace-nowrap rounded-md bg-[#52c41a] px-4 py-2 text-sm font-medium leading-none text-white outline-none transition-all hover:bg-[#52c41a]/90 disabled:pointer-events-none disabled:opacity-50'>
              Renew Now
            </button>
          )}
        </div>
      </div>
      {isNoData && <Empty className='my-[5rem]' />}
      {isVehicle ? (
        <VehiclePolicyDetail data={policyDetail} />
      ) : (
        <PolicyDetail data={policyDetail} />
      )}
      <InsuredMaidDetail data={policyDetail?.maid_info} />
      <VehicleDetail data={policyDetail?.vehicle} />
      <PolicyClausesDetail data={policyDetail?.policy_clauses} />
      <LowerTextDetail data={policyDetail?.lower_text} />

      <ExcessApplicableDetail data={policyDetail?.excess} />
      <CoverageDetail data={policyDetail?.maid_info} />
      <PolicyholderDetail data={policyDetail?.policy_holder} />
      <DriverDetail data={policyDetail?.drivers} />
    </div>
  );
};
export default PolicyDetailPage;
