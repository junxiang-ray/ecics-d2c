import { POLICY_TYPE_ICON } from '@/constants/policy';

import {
  Policy,
  PolicyStatus,
  PolicyTag,
  PolicyType,
} from '@/libs/types/policy';
import { formatDateString } from '@/libs/utils/dayjs';
import { formatNumber } from '@/libs/utils/utils';
import { getPolicyStatusTag, getPolicyTypeName } from '@/libs/utils/policy';

import Badge from '@/components/ui/Badge';
import CalendarOutlined from '@/assets/icons/add-on/calendar-outlined.svg';

interface Props {
  dataSource: Policy[];
  onShowDetail: (data: Policy) => void;
}

const PolicyCards = ({ dataSource, onShowDetail }: Props): JSX.Element => {
  const getIcon = (policyType: PolicyType): React.ReactNode | null => {
    const SvgIcon = POLICY_TYPE_ICON[policyType as Exclude<PolicyType, 'all'>];
    if (!SvgIcon) return null;

    return <SvgIcon width='14' height='14' />;
  };

  const renderTags = (
    policyStatus?: PolicyStatus,
    policyTags?: PolicyTag,
  ): JSX.Element | null => {
    const tag = getPolicyStatusTag(policyStatus, policyTags);
    if (!tag) return null;

    return <Badge bordered color={tag.color} content={tag.label} size='sm' />;
  };

  if (!dataSource?.length) return <div>No data</div>;

  return (
    <>
      <div className=''>
        {dataSource.map((data, idx) => (
          <div
            key={`policy_${data?.policy_no}_${idx}`}
            className='cursor-pointer border-gray-200 p-4 transition-colors hover:bg-gray-50 [&:not(:last-child)]:border-b'
            onClick={() => onShowDetail(data)}
          >
            <div className='mb-3 flex items-start justify-between'>
              <div className='min-w-0 flex-1'>
                <div className='mb-1 font-body font-medium text-gray-900'>
                  {data.policy_no}
                </div>
                <div className='font-body text-sm text-gray-500'>
                  <span className='block'>
                    {data?.vehicle?.registration_no}
                  </span>
                  <span className='block'>{data?.maid_info?.name}</span>
                </div>
              </div>
              <div className='ml-3 flex shrink-0 flex-col items-end gap-2'>
                {renderTags(data.policy_status)}
                {renderTags(undefined, data.tags)}
              </div>
            </div>

            <div className='mb-3 flex flex-col gap-2'>
              <div className='flex flex-nowrap items-center gap-2 text-gray-700'>
                {getIcon(data?.policy_type)}
                {getPolicyTypeName(data?.policy_type)}
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='mb-1 block font-body text-xs text-gray-500'>
                    Premium
                  </label>
                  <div className='font-body text-sm'>
                    <a className='font-medium'>
                      $ {formatNumber(data?.premium, 2, true)}
                    </a>
                    <span className='text-gray-500'> /year</span>
                  </div>
                </div>
                <div>
                  <label className='mb-1 block font-body text-xs text-gray-500'>
                    Expiry Date
                  </label>
                  <div className='flex flex-nowrap items-center gap-2 text-sm'>
                    <CalendarOutlined
                      className='text-gray-400'
                      width='14'
                      height='14'
                    />
                    <span className='leading-none'>
                      {formatDateString(
                        data?.end_date,
                        'YYYY-MM-DD',
                        'DD MMM YYYY',
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default PolicyCards;
