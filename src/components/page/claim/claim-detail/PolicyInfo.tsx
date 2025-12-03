import { Policy } from '@/libs/types/policy';

import { getPolicyTypeName } from '@/libs/utils/policy';
import { useContext } from 'react';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';

const PolicyInfo = (): JSX.Element => {
  const { claimDetail: claim } = useContext(ClaimContext);

  const policy = (claim?.policy ?? {}) as Policy;

  return (
    <>
      <div className='text-card-foreground flex flex-col gap-3 rounded-xl border border-gray-200 bg-white'>
        <div className='grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6'>
          <div className='font-heading text-lg font-semibold leading-none'>
            Policy Information
          </div>
        </div>
        <div className='px-6 [&>:last-child]:pb-4 [&>:not(:last-child)]:pb-2'>
          <div>
            <label className='font-body text-sm text-gray-600'>
              Policy Number
            </label>
            <p className='font-body font-medium'>{policy.policy_no || 'N/A'}</p>
          </div>
          <div>
            <label className='font-body text-sm text-gray-600'>
              Policy Type
            </label>
            <p className='font-body font-medium'>
              {getPolicyTypeName(policy.policy_type) || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default PolicyInfo;
