'use client';

import { ROUTES } from '@/constants/routes';

import { ColumnsType as Columns } from 'antd/es/table';
import { Policy, PolicyType } from '@/libs/types/policy';

import { POLICY_TYPE_ICON, POLICY_TYPE_NAME } from '@/constants/policy';

import { formatDateString } from '@/libs/utils/dayjs';
import { formatNumber } from '@/libs/utils/utils';
import { getPolicyStatusTag, getPolicyTypeName } from '@/libs/utils/policy';

import { useRef } from 'react';
import { useContext } from 'react';
import {
  PolicyContext,
  QueryValues,
} from '@/components/contexts/PolicyLayoutContext';

import { Table as AntTable } from 'antd';
import PolicyCards from '@/components/page/policy/PolicyCards';

import Badge from '@/components/ui/Badge';
import CalendarOutlined from '@/assets/icons/add-on/calendar-outlined.svg';

const Table = (): JSX.Element => {
  const { loading, policies, pushQuery } = useContext(PolicyContext);

  const getIcon = (policyType: PolicyType): React.ReactNode | null => {
    const SvgIcon = POLICY_TYPE_ICON[policyType as Exclude<PolicyType, 'all'>];
    if (!SvgIcon) return null;

    return <SvgIcon width='14' height='14' />;
  };

  const columns = useRef<Columns<Policy>>([
    {
      key: 'policy',
      title: 'Policy',
      className: 'text-nowrap text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Policy) => (
        <>
          {row?.policy_no && (
            <span className='block font-[500] leading-none text-[#000]/90'>
              {row.policy_no}
            </span>
          )}
          {row?.vehicle?.registration_no && (
            <span className='text-[#000]/60'>
              {row.vehicle.registration_no}
            </span>
          )}
          {row?.maid_info?.name && (
            <span className='leading-none text-[#000]/60'>
              {row.maid_info.name}
            </span>
          )}
        </>
      ),
    },
    {
      key: 'policy_type',
      title: 'Type',
      className: 'text-nowrap text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Policy) => (
        <div className='flex flex-nowrap items-center gap-2 text-gray-700'>
          {getIcon(row?.policy_type)}
          {getPolicyTypeName(row?.policy_type)}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      className: 'text-nowrap text-[12px] text-[#000]/90 p-[7px] []',
      render: (row: Policy) => {
        const tag = getPolicyStatusTag(row?.policy_status);
        if (!tag) return <span className='text-gray-400'>—</span>;

        return (
          <Badge bordered color={tag.color} content={tag.label} size='sm' />
        );
      },
    },
    {
      key: 'tag',
      title: 'Tag',
      className: 'text-nowrap text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Policy) => {
        const tags = getPolicyStatusTag(undefined, row?.tags);
        if (!tags) return <span className='text-gray-400'>—</span>;

        return (
          <Badge bordered color={tags.color} content={tags.label} size='sm' />
        );
      },
    },
    {
      key: 'subscription_type',
      title: 'Premium',
      className: 'text-nowrap text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Policy) => (
        <span>
          <a className='font-medium'>$ {formatNumber(row.premium, 2, true)}</a>
          <span className='text-gray-500'> /year</span>
        </span>
      ),
    },
    {
      key: 'expiry_date',
      title: 'Expiry Date',
      className: 'text-nowrap text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Policy) => (
        <div className='flex flex-nowrap items-center gap-2'>
          <CalendarOutlined className='text-gray-400' width='14' height='14' />
          <span className='leading-none'>
            {formatDateString(row.end_date, 'YYYY-MM-DD', 'DD MMM YYYY')}
          </span>
        </div>
      ),
    },
  ]).current;

  const openDetail = (policy: Policy): void => {
    if (policy?.policy_no)
      pushQuery(
        [
          {
            key: 'no',
            value: encodeURIComponent(policy.policy_no) as QueryValues,
          },
        ],
        ROUTES.PORTAL.POLICIES.DETAIL,
      );
  };

  return (
    <>
      <div className='hidden md:block'>
        <AntTable
          rowKey='policy_no'
          className='mt-3 text-sm [&_.ant-table-body_.ant-table-row]:cursor-pointer [&_.ant-table-header_.ant-table-cell]:bg-white/0'
          bordered={false}
          dataSource={policies}
          columns={columns}
          loading={loading}
          pagination={false}
          size='small'
          sticky
          scroll={{ x: 'max-content' }}
          onRow={(record: Policy) => ({
            onClick: () => openDetail(record),
          })}
        />
      </div>
      <div className='block md:hidden'>
        <PolicyCards dataSource={policies} onShowDetail={openDetail} />
      </div>
    </>
  );
};
export default Table;
