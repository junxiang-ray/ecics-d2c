import { Policy } from '@/libs/types/policy';

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
  ): JSX.Element => {
    return (
      <div className='flex items-start justify-between border-gray-100 py-3'>
        {/* Left text group */}
        <div className='max-w-[220px] break-words min-[450px]:max-w-[280px] sm:max-w-none'>
          {/* Item title – normal weight */}
          <p className='font-body text-left text-base text-gray-900'>
            {title ?? '-'}
          </p>

          {/* Item description – smaller & muted */}
          {!!description && (
            <p className='font-body mt-1 text-left text-sm text-gray-600'>
              {description}
            </p>
          )}
        </div>

        {/* Amount */}
        <p className='font-body shrink-0 text-right text-base font-semibold text-gray-900'>
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
        {/* Policy Excess */}
        <div>
          <div className='font-body mb-4 text-base font-semibold text-gray-900'>
            Policy Excess
          </div>
          <div className='[&>:not(:last-child)]:mb-4 [&>:not(:last-child)]:border-b'>
            {!!data.policy_excess?.length &&
              data.policy_excess.map((excess, idx) => (
                <Fragment key={idx}>
                  {row(excess?.name, excess?.description, excess?.amount)}
                </Fragment>
              ))}
          </div>
        </div>

        {/* Additional Excess */}
        <div>
          <div className='font-body mb-4 text-base font-semibold text-gray-900'>
            Additional Excess
          </div>
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
