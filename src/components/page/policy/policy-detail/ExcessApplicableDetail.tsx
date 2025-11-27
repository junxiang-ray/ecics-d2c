import { Policy } from '@/libs/types/policy';
import { formatDateString } from '@/libs/utils/dayjs';

import { Fragment } from 'react';
import Card from './PolicyCard';
import InfoCircleOutlined from '@/assets/icons/add-on/info-circle-outlined.svg';

interface Props {
  data?: Policy['excess'];
}

const ExcessApplicableDetail = ({ data }: Props): JSX.Element | null => {
  if (!data) return null;

  const row = (
    title: string,
    description?: string,
    content?: JSX.Element | string | number,
    className?: string,
  ): JSX.Element => {
    return (
      <div className='flex items-start justify-between border-gray-100 py-3'>
        <div>
          <p className='font-body text-base font-medium text-gray-900'>
            {title ?? '-'}
          </p>
          {!!description && (
            <p className='mt-1 font-body text-sm text-gray-600'>
              {description}
            </p>
          )}
        </div>
        <p className='font-body text-base font-semibold text-gray-900'>
          {content}
        </p>
      </div>
    );
  };

  return (
    <Card
      title='Excess Applicable'
      subTitle='Deductible amounts for claims'
      icon={<InfoCircleOutlined width='21' height='21' />}
    >
      <div className='[&>:not(:last-child)]:mb-6'>
        <div>
          <h3 className='mb-4 font-heading text-base font-semibold text-gray-900'>
            Policy Excess
          </h3>
          <div className='[&>:not(:last-child)]:mb-4 [&>:not(:last-child)]:border-b'>
            {!!data.policy_excess?.lenth &&
              data.policy_excess.map((excess, idx) => (
                <Fragment key={idx}>
                  {row(excess?.name, excess?.description, excess?.amount)}
                </Fragment>
              ))}
          </div>
        </div>
        <div>
          <h3 className='mb-4 font-heading text-base font-semibold text-gray-900'>
            Additional Excess
          </h3>
          <div className='[&>:not(:last-child)]:mb-4 [&>:not(:last-child)]:border-b'>
            {!!data.additional_excess?.length &&
              data.additional_excess.map((excess, idx) => (
                <Fragment key={idx}>
                  {row(excess?.name, excess?.description, excess?.amount)}
                </Fragment>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ExcessApplicableDetail;
