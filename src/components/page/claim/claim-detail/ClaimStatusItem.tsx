'use client';

import { DATE_TIME_FORMAT } from '@/constants/date-time';
import { CLAIM_STATUS_CONF } from '@/constants/claim';

import { formatDateString } from '@/libs/utils/dayjs';

import { memo, useMemo } from 'react';

interface Props {
  title: string;
  description: string;
  processDate: string | null;
  expectProcessDate: string | null;
}

const ClaimStatusItem = ({
  title,
  description,
  processDate,
  expectProcessDate,
}: Props): JSX.Element => {
  const processTimestamp = new Date(processDate ?? '').valueOf() || 0;
  const expectProcessTimestamp =
    new Date(expectProcessDate ?? '').valueOf() || 0;
  const isFailed = !!processTimestamp && !expectProcessTimestamp;
  const isFinished =
    processTimestamp && expectProcessTimestamp
      ? processTimestamp >= expectProcessTimestamp
      : null;

  const { ICON: Icon, COLOR: color } = useMemo(() => {
    if (isFailed) return CLAIM_STATUS_CONF.FAILED;
    if (isFinished) return CLAIM_STATUS_CONF.SUCCESS;
    if (isFinished === false) return CLAIM_STATUS_CONF.IN_PROGRESS;

    return CLAIM_STATUS_CONF.WAITING;
  }, [isFinished, isFailed]);

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';

    return (
      formatDateString(
        dateStr,
        DATE_TIME_FORMAT.ISO_DATE_TIME,
        DATE_TIME_FORMAT.ISO_DATE,
      ) ?? ''
    );
  };

  return (
    <>
      <div className='flex items-start gap-3 [&:hover_.progress-icon]:opacity-80'>
        <div className='progress-icon flex-shrink-0 transition-opacity duration-200'>
          {Icon ? (
            <Icon className={`h-5 w-5 opacity-90 ${color}`} />
          ) : (
            <div className='h-5 w-5 rounded-full border-2 border-gray-300' />
          )}
        </div>
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h4
              className={`font-body text-base font-medium leading-tight ${color}`}
            >
              {title}
            </h4>
            <div className='font-body text-sm text-gray-500'>
              {processTimestamp ? (
                <span className='inline-block whitespace-nowrap'>
                  {formatDate(processDate)}
                </span>
              ) : expectProcessTimestamp ? (
                <span className='inline-block whitespace-nowrap'>
                  Expected:&nbsp;{formatDate(expectProcessDate)}
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
          <p className='font-body text-sm text-gray-600'>{description}</p>
        </div>
      </div>
    </>
  );
};
export default memo(ClaimStatusItem);
