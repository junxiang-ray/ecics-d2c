import { Policy } from '@/libs/types/policy';
import { formatDateString } from '@/libs/utils/dayjs';

import { Fragment } from 'react';
import Card from './PolicyCard';
import DocumentOutlined from '@/assets/icons/document-oulined.svg';

interface Props {
  data?: Policy['maid_info'];
}

const CoverageDetail = ({ data }: Props): JSX.Element | null => {
  if (!data) return null;

  return (
    <Card
      title='Coverage Details'
      subTitle='Comprehensive coverage breakdown'
      icon={<DocumentOutlined width='21' height='21' />}
    >
      <div className='[&>:not(:last-child)]:mb-3 [&>:not(:last-child)]:border-b'>
        {!!data.coverage_details &&
          data.coverage_details.map((detail, idx) => (
            <Fragment key={`coveragedetail_${idx}`}>
              <div className='flex items-start gap-4 border-gray-100 py-4'>
                <div className='mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#02ADEF]/10'>
                  <span className='font-body font-semibold text-[#02ADEF]'>
                    {idx + 1}
                  </span>
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='font-body text-base font-medium text-gray-900'>
                    {detail?.name || '-'}
                  </p>
                </div>
                {detail?.notes && (
                  <div className='ml-4 flex-shrink-0'>
                    <span className='font-body text-base font-semibold text-[#02ADEF]'>
                      {detail.notes}
                    </span>
                  </div>
                )}
              </div>
              {detail?.subDetails?.length &&
                detail.subDetails.map((subDetail, idx) => (
                  <Fragment key={`subcoveragedetail_${idx}`}>
                    <div className='flex items-start gap-4 py-2.5 pl-12 '>
                      <div className='mt-2 flex-shrink-0'>
                        <div className='bullet h-2 w-2 rounded-full bg-gray-400' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='font-body text-sm text-gray-700'>
                          {subDetail.name}
                        </p>
                      </div>
                      {subDetail?.notes && (
                        <div className='ml-4 flex-shrink-0'>
                          <span className='font-body text-sm font-medium text-gray-900'>
                            {subDetail.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  </Fragment>
                ))}
            </Fragment>
          ))}
      </div>
    </Card>
  );
};
export default CoverageDetail;
