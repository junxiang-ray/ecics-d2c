'use client';

import { DATE_TIME_FORMAT } from '@/constants/date-time';
import { CLAIM_PROGRESS } from '@/constants/claim';

import { ClaimProgress, ProgressHistory } from '@/libs/types/claim';

import { formatDateString } from '@/libs/utils/dayjs';

import { useMemo, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';

import { Progress } from 'antd';
import CheckCircleOutlined from '@/assets/icons/check-circle.svg';
import CloseCircleOutlined from '@/assets/icons/close-circle-outlined.svg';

const ClaimProgressInfo = (): JSX.Element => {
  const { claimDetail: claim } = useContext(ClaimContext);

  const currProgress = claim?.progress as ClaimProgress;
  const progressHistories = (claim?.progress_histories ??
    []) as ProgressHistory[];

  const progressHistortory = useMemo<
    Record<ProgressHistory['progress'], ProgressHistory>
  >(
    () =>
      Object.fromEntries(
        progressHistories.map((progressHistory) => [
          progressHistory.progress,
          progressHistory,
        ]),
      ) as Record<ProgressHistory['progress'], ProgressHistory>,
    [progressHistories],
  );

  const formatDate = (dateStr?: string): string =>
    formatDateString(
      dateStr,
      DATE_TIME_FORMAT.ISO_DATE_TIME,
      DATE_TIME_FORMAT.ISO_DATE,
    ) ?? '';

  const progressPct = useMemo(() => {
    switch (currProgress) {
      default:
        return 0;
      case 'submitted':
        return 20;
      case 'initial_review':
        return 40;
      case 'in_review':
        return 60;
      case 'decision':
        return 80;
      case 'settlement':
        return 100;
    }
  }, [currProgress]);

  const progressTag = (
    status: string,
    description: string,
    progress: ProgressHistory,
  ): JSX.Element => {
    const processTimestamp = new Date(progress?.process_date).valueOf() || 0;
    const expectProcessTimestamp =
      new Date(progress?.expected_process_date).valueOf() || 0;
    let isFailed = false;
    let isFinished: boolean | undefined;
    if (processTimestamp) {
      if (expectProcessTimestamp)
        isFinished = processTimestamp >= expectProcessTimestamp;
      else isFailed = true;
    }

    return (
      <>
        <div className='flex items-start gap-3 [&:hover_.progress-icon]:opacity-80'>
          <div className='progress-icon flex-shrink-0 transition-opacity duration-200'>
            {isFinished === true ? (
              <CheckCircleOutlined className='h-5 w-5 text-green-600' />
            ) : isFinished === false ? (
              <CheckCircleOutlined className='h-5 w-5 text-yellow-600' />
            ) : isFailed ? (
              <CloseCircleOutlined className='h-5 w-5 text-red-600' />
            ) : (
              <div className='h-5 w-5 rounded-full border-2 border-gray-300' />
            )}
          </div>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <h4
                className={`font-body text-base font-medium leading-tight ${
                  isFinished === true
                    ? 'text-green-700'
                    : isFinished === false
                      ? 'text-orange-700'
                      : isFailed
                        ? 'text-red-700'
                        : 'text-black-500 opacity-90'
                }`}
              >
                {status}
              </h4>
              <div className='font-body text-sm text-gray-500'>
                {processTimestamp ? (
                  <span className='inline-block whitespace-nowrap'>
                    {formatDate(progress?.process_date)}
                  </span>
                ) : expectProcessTimestamp ? (
                  <span className='inline-block whitespace-nowrap'>
                    Expected:&nbsp;{formatDate(progress?.expected_process_date)}
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

  return (
    <>
      <div className='rounded-xl border border-gray-200 bg-white p-6 pb-4'>
        <h4 className='font-heading font-medium leading-none'>
          Claim Progress
        </h4>
        <div className='mb-6'>
          <Progress
            percent={100}
            success={{ percent: progressPct, strokeColor: '#02adef' }}
            showInfo={false}
            strokeColor='#e4f7ff'
            size='small'
          />
        </div>
        <div className='flex flex-col gap-4'>
          {progressTag(
            'Submitted',
            'Claim submitted with initial documentation',
            progressHistortory[CLAIM_PROGRESS.SUBMITTED],
          )}
          {progressTag(
            'Initial Review',
            'Claim assigned to adjuster for initial assessment',
            progressHistortory[CLAIM_PROGRESS.INITIAL_REVIEW],
          )}
          {progressTag(
            'In Review',
            'Adjuster reviewing documentation and repair quotes',
            progressHistortory[CLAIM_PROGRESS.IN_REVIEW],
          )}
          {progressTag(
            'Decision',
            'Claim approval or additional requirements',
            progressHistortory[CLAIM_PROGRESS.DECISION],
          )}
          {progressTag(
            'Settlement',
            'Payment processing and claim closure',
            progressHistortory[CLAIM_PROGRESS.SETTLEMENT],
          )}
        </div>
      </div>
    </>
  );
};
export default ClaimProgressInfo;
