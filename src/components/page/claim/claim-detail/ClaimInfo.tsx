'use client';

import { ClaimStatus } from '@/libs/types/claim';

import { formatDateString } from '@/libs/utils/dayjs';
import { formatNumber } from '@/libs/utils/utils';
import { getClaimStatusTag } from '@/libs/utils/claim';
import { getPolicyTypeName } from '@/libs/utils/policy';

import { useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';

import Badge from '@/components/ui/Badge';
import CalendarOutlined from '@/assets/icons/add-on/calendar-outlined.svg';
import ClockOutlined from '@/assets/icons/clock-outlined.svg';
import DocumentOutlined from '@/assets/icons/document-oulined.svg';
import DolarOutlined from '@/assets/icons/add-on/dolar-outlined.svg';
import MapPinOutlined from '@/assets/icons/map-pin-outlined.svg';

const ClaimInfo = (): JSX.Element => {
  const { claimDetail: claim } = useContext(ClaimContext);

  const renderStatusTag = (): JSX.Element | null => {
    const tag = getClaimStatusTag(claim?.status as ClaimStatus);
    if (!tag) return null;

    return <Badge bordered color={tag.color} content={tag.label} />;
  };

  const formatDate = (dateStr?: string): string => {
    const formatted = formatDateString(dateStr, 'YYYY-MM-DD', 'DD/MM/YYYY');
    if (!formatted) return '--/--/----';

    return formatted;
  };

  const getLocation = (): string => {
    const location = [
      claim?.address?.address_line_1,
      claim?.address?.address_line_2,
      claim?.address?.address_line_3,
    ]
      .filter(Boolean)
      .join(', ');

    return location || '-';
  };

  return (
    <>
      <div className='text-card-foreground flex flex-col gap-3 rounded-xl border border-gray-200 bg-white'>
        <div
          data-slot='card-header'
          className='@container/card-header has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6'
        >
          <div className='flex items-start justify-between'>
            <div>
              <div className='font-heading flex items-center text-lg font-semibold leading-none opacity-80'>
                <DocumentOutlined className='mr-2 h-5 w-5 opacity-90' />
                <span>Car Claim</span>
              </div>
              <p className='font-body mt-1 text-sm text-gray-600'>
                {claim?.description || '-'}
              </p>
            </div>
            {renderStatusTag()}
          </div>
        </div>
        <div className='px-6 [&>:last-child]:pb-6 [&>:not(:last-child)]:pb-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex items-center space-x-2'>
              <DolarOutlined className='h-4 w-4 text-gray-500' />
              <div>
                <label className='font-body text-sm text-gray-600'>
                  Claim Amount
                </label>
                <p className='font-body text-nowrap font-medium'>
                  <span className='mr-[.1rem] inline-block'>$</span>
                  {formatNumber(claim?.amount ?? 0, 2, true)}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <CalendarOutlined className='h-4 w-4 text-gray-500' />
              <div>
                <label className='font-body text-sm text-gray-600'>
                  Incident Date
                </label>
                <p className='font-body font-medium'>
                  {formatDate(claim?.incident_date)}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <MapPinOutlined className='h-4 w-4 text-gray-500' />
              <div>
                <label className='font-body text-sm text-gray-600'>
                  Location
                </label>
                <p className='font-body font-medium'>{getLocation()}</p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <ClockOutlined className='h-4 w-4 text-gray-500' />
              <div>
                <label className='font-body text-sm text-gray-600'>
                  Est. Settlement
                </label>
                <p className='font-body font-medium'>
                  {formatDate(claim?.estimate_settlement)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ClaimInfo;
