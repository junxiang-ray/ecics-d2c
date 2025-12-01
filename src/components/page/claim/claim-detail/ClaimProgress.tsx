'use client';

import { CLAIM_PROGRESS } from '@/constants/claim';

import { ClaimProgress, ProgressHistory } from '@/libs/types/claim';

import { useMemo, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';

import { Progress } from 'antd';
import StatusItem from './ClaimStatusItem';

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
          <StatusItem
            title='Submitted'
            description='Claim submitted with initial documentation'
            processDate={
              progressHistortory[CLAIM_PROGRESS.SUBMITTED]?.process_date
            }
            expectProcessDate={
              progressHistortory[CLAIM_PROGRESS.SUBMITTED]
                ?.expected_process_date
            }
          />
          <StatusItem
            title='Initial Review'
            description='Claim assigned to adjuster for initial assessment'
            processDate={
              progressHistortory[CLAIM_PROGRESS.INITIAL_REVIEW]?.process_date
            }
            expectProcessDate={
              progressHistortory[CLAIM_PROGRESS.INITIAL_REVIEW]
                ?.expected_process_date
            }
          />
          <StatusItem
            title='In Review'
            description='Adjuster reviewing documentation and repair quotes'
            processDate={
              progressHistortory[CLAIM_PROGRESS.IN_REVIEW]?.process_date
            }
            expectProcessDate={
              progressHistortory[CLAIM_PROGRESS.IN_REVIEW]
                ?.expected_process_date
            }
          />
          <StatusItem
            title='Decision'
            description='Claim approval or additional requirements'
            processDate={
              progressHistortory[CLAIM_PROGRESS.DECISION]?.process_date
            }
            expectProcessDate={
              progressHistortory[CLAIM_PROGRESS.DECISION]?.expected_process_date
            }
          />
          <StatusItem
            title='Settlement'
            description='Payment processing and claim closure'
            processDate={
              progressHistortory[CLAIM_PROGRESS.SETTLEMENT]?.process_date
            }
            expectProcessDate={
              progressHistortory[CLAIM_PROGRESS.SETTLEMENT]
                ?.expected_process_date
            }
          />
        </div>
      </div>
    </>
  );
};
export default ClaimProgressInfo;
