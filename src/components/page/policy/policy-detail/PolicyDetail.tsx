import { Policy, PolicyStatus, PolicyTag } from '@/libs/types/policy';
import { formatNumber } from '@/libs/utils/utils';
import { formatDateString } from '@/libs/utils/dayjs';
import { getPolicyStatusTag } from '@/libs/utils/policy';

import Card from './PolicyCard';
import Badge from '@/components/ui/Badge';
import DocumentOutlined from '@/assets/icons/document-oulined.svg';

interface Props {
  data?: Policy;
}

const PolicyDetail = ({ data }: Props): JSX.Element | null => {
  if (!data) return null;

  const renderTags = (
    policyStatus?: PolicyStatus,
    policyTags?: PolicyTag,
  ): JSX.Element => {
    const tag = getPolicyStatusTag(policyStatus, policyTags);
    if (!tag) return <></>;

    return (
      <span className='inline-block [&>span>span:last-child]:px-3 [&>span>span:last-child]:px-3 [&>span>span:last-child]:py-[8px] [&>span>span]:rounded-lg [&>span>span]:text-base [&>span]:h-fit'>
        <Badge bordered color={tag.color} content={tag.label} size='lg' />
      </span>
    );
  };

  const row = (
    label: string,
    content?: JSX.Element | string | number,
    className?: string,
  ): JSX.Element => {
    return (
      <div>
        <label className='font-body mb-1.5 block text-sm font-medium text-gray-700'>
          {label}
        </label>
        <p
          className={`font-body text-base font-semibold text-gray-900 opacity-80 ${className ?? ''}`}
        >
          {content || 'N/A'}
        </p>
      </div>
    );
  };

  return (
    <Card
      title='Policy Details'
      subTitle='Your current policy information'
      icon={<DocumentOutlined width='21' height='21' />}
    >
      <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
        {row('Policy No.', data.policy_no)}
        {row('Date of Issue', data.issue_date)}
        {row('Start Date', data.start_date)}
        {row('End Date', data.end_date)}
        {row('Plan Type', data.plan?.plan_name)}
        {row('Intermediary Name', data.intermediary_name)}
        {row('Premium', `$${formatNumber(data.premium, 2, true)}`)}
        {row('Policy Status', renderTags(data.policy_status))}
        {row('Tags', renderTags(undefined, data.tags))}
      </div>
    </Card>
  );
};
export default PolicyDetail;
