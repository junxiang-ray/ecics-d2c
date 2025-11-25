import { Policy, PolicyType } from '@/libs/types/policy';

import { POLICY_TYPE_ICON } from '@/constants/policy';

import { formatDateString } from '@/libs/utils/dayjs';
import { getPolicyStatusTag } from '@/libs/utils/policy';

import { Skeleton } from 'antd';

import BoxIcon from '@/components/ui/BoxIcon';
import Badge from '@/components/ui/Badge';

import RightOutlined from '@/assets/icons/add-on/right-outlined.svg';

type SvgIconName = Exclude<PolicyType, 'all'>;

interface Props {
  data: Policy | null;
  onShowDetail: (policy: Policy | null) => void;
}

const PolicyCard = ({ data, onShowDetail }: Props): React.ReactNode => {
  if (data == null)
    return (
      <div className='transform overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
        <Skeleton.Input active block className='h-[230px] opacity-50' />
      </div>
    );

  const SvgIcon: React.FC<React.SVGProps<SVGSVGElement>> | null =
    POLICY_TYPE_ICON[data.policy_type as SvgIconName] ?? null;

  const getCardTitle = (policyType?: PolicyType): string => {
    if (policyType === 'car') return 'Private Motor Car';
    if (policyType === 'motorcycle') return 'Private Motorcycle';
    if (policyType === 'maid') return 'Maid Insurance';
    if (policyType === 'home') return 'Home Insurance';
    if (policyType === 'travel') return 'Home Insurance';
    return '';
  };

  const isPendingRenewal: boolean = data.tags === 'pending_renewal';
  const tags = getPolicyStatusTag(
    isPendingRenewal ? undefined : data.policy_status,
    data.tags,
  );

  return (
    <div
      className='transform cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg'
      onClick={!!onShowDetail && (() => onShowDetail(data))}
    >
      <div className='border-b border-gray-100 p-6'>
        <div className='mb-4 flex items-start justify-between'>
          <div className='flex min-w-0 flex-1 items-center pr-3'>
            <BoxIcon
              className='mr-4 text-primary'
              icon={SvgIcon && <SvgIcon width='21' height='21' />}
            />
            <div className='min-w-0 flex-1'>
              <h3 className='truncate font-heading text-lg font-semibold text-gray-900'>
                {getCardTitle(data.policy_type)}
              </h3>
              <p className='truncate font-body text-sm text-gray-600'>
                {data.plan?.plan_name}
              </p>
            </div>
          </div>
          {!!tags && (
            <Badge
              bordered
              color={tags.color}
              font='medium'
              size='lg'
              content={tags.label}
            />
          )}
        </div>
      </div>

      <div className='p-5'>
        <div className='mb-4 flex items-start justify-between'>
          <div>
            <p className='mb-1 font-body text-xs font-medium uppercase tracking-wide text-gray-500'>
              Policy Number
            </p>
            <p className='font-body text-sm font-semibold text-gray-900'>
              {data.policy_no}
            </p>
          </div>
          <div className='text-right'>
            <p className='mb-1 font-body text-xs font-medium uppercase tracking-wide text-gray-500'>
              Expiry Date
            </p>
            <p className='font-body text-sm font-semibold text-gray-900'>
              {formatDateString(data.end_date, 'YYYY-MM-DD', 'DD MMM YYYY')}
            </p>
          </div>
        </div>
        <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
          {['car', 'motorcycle'].includes(data.policy_type) && (
            <>
              <div>
                <p className='mb-1 font-body text-xs font-medium uppercase tracking-wide text-gray-500'>
                  Vehicle Registration
                </p>
                <p className='font-body text-sm font-semibold text-gray-900'>
                  {data.vehicle?.vehicle_number ?? '-'}
                </p>
              </div>
            </>
          )}
          {data.policy_type === 'maid' && (
            <>
              <div>
                <p className='mb-1 font-body text-xs font-medium uppercase tracking-wide text-gray-500'>
                  HELPER'S NAME
                </p>
                <p className='font-body text-sm font-semibold text-gray-900'>
                  {data.maid_info?.name ?? '-'}
                </p>
              </div>
            </>
          )}
          <div className='flex items-center font-body text-primary transition-all duration-200 hover:text-primary/80'>
            <span className='mr-2 text-sm font-semibold'>Renew Now</span>
            <RightOutlined />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PolicyCard;
