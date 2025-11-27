import { POLICY_TYPE_ICON } from '@/constants/policy';

import { Claim, ClaimStatus } from '@/libs/types/claim';
import { PolicyType } from '@/libs/types/policy';

import { formatDateString } from '@/libs/utils/dayjs';
import { formatNumber } from '@/libs/utils/utils';
import { getPolicyTypeName } from '@/libs/utils/policy';
import { getClaimStatusTag } from '@/libs/utils/claim';

import { Empty } from 'antd';
import Badge from '@/components/ui/Badge';
import CalendarOutlined from '@/assets/icons/add-on/calendar-outlined.svg';
import EyesOutlined from '@/assets/icons/renewal/eye-open.svg';

interface Props {
  dataSource: Claim[];
  onShowDetail: (data: Claim) => void;
}

const ClaimCards = ({ dataSource, onShowDetail }: Props): JSX.Element => {
  const getIcon = (policyType: PolicyType): React.ReactNode | null => {
    const SvgIcon = POLICY_TYPE_ICON[policyType as Exclude<PolicyType, 'all'>];
    if (!SvgIcon) return null;

    return <SvgIcon width='14' height='14' />;
  };

  const renderTags = (status: ClaimStatus): JSX.Element => {
    const tag = getClaimStatusTag(status);
    if (!tag) return <></>;

    return <Badge bordered color={tag.color} content={tag.label} />;
  };

  if (!dataSource?.length)
    return (
      <div>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );

  return (
    <>
      <div className=''>
        {dataSource.map((data, idx) => (
          <div
            key={`policy_${data?.claim_no}_${idx}`}
            className='cursor-pointer border-gray-200 p-4 transition-colors hover:bg-gray-50 [&:not(:last-child)]:border-b'
            onClick={() => onShowDetail(data)}
          >
            <div className='mb-3 flex items-start justify-between'>
              <div className='min-w-0 flex-1'>
                <div className='mb-1 font-body font-medium text-gray-900'>
                  {data.claim_no}
                </div>
                <div className='font-body text-sm text-gray-500'>
                  {!!data?.short_description && (
                    <span
                      className='block max-w-xs truncate text-sm text-gray-500'
                      title={data.short_description}
                    >
                      {data.short_description}
                    </span>
                  )}
                  {!!data?.policy?.policy_no && (
                    <span className='block text-xs text-gray-400'>
                      Policy: {data?.policy?.policy_no}
                    </span>
                  )}
                </div>
              </div>
              <div className='ml-3 flex shrink-0 flex-col items-end gap-2'>
                {renderTags(data.status)}
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex flex-nowrap items-center gap-2 text-gray-700'>
                {getIcon(data?.policy?.policy_type)}
                {getPolicyTypeName(data?.policy?.policy_type)}
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='mb-1 block font-body text-xs text-gray-500'>
                    Claim Amount
                  </label>
                  <div className='font-body text-sm'>
                    <a className='font-medium'>
                      ${formatNumber(data?.amount, 2, true)}
                    </a>
                  </div>
                </div>
                <div>
                  <label className='mb-1 block font-body text-xs text-gray-500'>
                    Last Updated
                  </label>
                  <div className='flex flex-nowrap items-center gap-2 text-sm'>
                    <CalendarOutlined
                      className='text-gray-400'
                      width='14'
                      height='14'
                    />
                    <span className='leading-none'>
                      {formatDateString(
                        data?.last_update,
                        'YYYY-MM-DD',
                        'DD MMM YYYY',
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-3'>
              <button
                className='text-foreground inline-flex h-8 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-sm font-medium outline-none transition-all hover:bg-gray-200'
                data-slot='button'
              >
                <EyesOutlined className='mr-2 h-4 w-4' />
                View Claim
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default ClaimCards;
