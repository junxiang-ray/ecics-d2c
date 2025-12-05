'use client';

import { ROUTES } from '@/constants/routes';

import { useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';
import { Button } from 'antd';
import UploadOutlined from '@/assets/icons/add-on/upload-outlined.svg';
import BackOutlined from '@/assets/icons/renewal/back.svg';
import CarClaim from '@/components/page/claim/claim-detail/CarClaim';

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
            className='font-body flex flex-nowrap items-center gap-2 text-gray-600 transition-colors hover:text-gray-900'
            onClick={backToPreviousPage}
          >
            <BackOutlined />
            Back
          </button>
          <div className='h-6 w-px bg-gray-300' />
          <div>
            <div className='font-heading text-3xl font-bold text-gray-900'>
              Claim Details
            </div>
            <p className='font-body text-gray-600'>{claimDetail?.claim_no}</p>
          </div>
        </div>
        <Button className='bg-[#02ADEF] hover:bg-[#02ADEF]/90' type='primary'>
          <UploadOutlined className='mr-2 h-4 w-4' />
          Submit Additional Info
        </Button>
      </div>
      <CarClaim />
    </div>
  );
};
export default ClaimDetail;
