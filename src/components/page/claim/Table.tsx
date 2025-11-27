'use client';

import { ROUTES } from '@/constants/routes';

import { ColumnsType as Columns } from 'antd/es/table';
import { PolicyType } from '@/libs/types/policy';
import { Claim } from '@/libs/types/claim';

import { POLICY_TYPE_ICON } from '@/constants/policy';

import { formatDateString } from '@/libs/utils/dayjs';
import { formatNumber } from '@/libs/utils/utils';
import { getClaimStatusTag } from '@/libs/utils/claim';
import { getPolicyTypeName } from '@/libs/utils/policy';

import { useContext, useRef } from 'react';

import {
  ClaimContext,
  QueryValues,
} from '@/components/contexts/ClaimLayoutContext';

import { Table as AntTable } from 'antd';
import Badge from '@/components/ui/Badge';
import ClaimCards from '@/components/page/claim/ClaimCards';
import CalendarOutlined from '@/assets/icons/add-on/calendar-outlined.svg';
import EyesOutlined from '@/assets/icons/renewal/eye-open.svg';

const Table = (): JSX.Element => {
  const { loading, claims, pushQuery } = useContext(ClaimContext);

  const getIcon = (policyType: PolicyType): React.ReactNode | null => {
    const SvgIcon = POLICY_TYPE_ICON[policyType as Exclude<PolicyType, 'all'>];
    if (!SvgIcon) return null;

    return <SvgIcon width='14' height='14' />;
  };

  const columns = useRef<Columns<Claim>>([
    {
      key: 'policy',
      title: 'Policy',
      className: 'text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Claim) => (
        <>
          {!!row?.claim_no && (
            <span className='mb-1 block font-medium leading-none text-[#000]/90'>
              {row.claim_no}
            </span>
          )}
          {!!row?.short_description && (
            <span
              className='mb-[.15rem] block max-w-xs truncate text-sm leading-none text-gray-500'
              title={row.short_description}
            >
              {row.short_description}
            </span>
          )}
          {!!row?.policy?.policy_no && (
            <span className='mt-1 block text-xs leading-none text-gray-400'>
              Policy: {row?.policy?.policy_no}
            </span>
          )}
        </>
      ),
    },
    {
      key: 'policy_type',
      title: 'Type',
      className: 'text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Claim) => (
        <div className='flex flex-nowrap items-center gap-2 text-gray-700'>
          {getIcon(row?.policy?.policy_type)}
          {getPolicyTypeName(row?.policy?.policy_type)}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      className: 'text-[12px] text-[#000]/90 p-[7px] []',
      render: (row: Claim) => {
        const tag = getClaimStatusTag(row?.status);
        if (!tag) return <span className='text-gray-400'>—</span>;

        return <Badge bordered color={tag.color} content={tag.label} />;
      },
    },
    {
      key: 'amount',
      title: 'Amount',
      className: 'text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Claim) => (
        <span>
          <a className='font-medium'>$ {formatNumber(row.amount, 2, true)}</a>
        </span>
      ),
    },
    {
      key: 'last_update',
      title: 'Last Updated',
      className: 'text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Claim) => (
        <div className='flex flex-nowrap items-center gap-2'>
          <CalendarOutlined className='text-gray-400' width='14' height='14' />
          <span className='leading-none'>
            {formatDateString(row.last_update, 'YYYY-MM-DD', 'DD MMM YYYY')}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      title: 'Actions',
      className: 'text-[12px] text-[#000]/90 p-[7px]',
      render: (row: Claim) => (
        <button
          className='text-foreground inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-sm font-medium outline-none transition-all hover:bg-gray-200'
          data-slot='button'
        >
          <EyesOutlined className='mr-2 h-4 w-4' />
          View
        </button>
      ),
    },
  ]).current;

  const openDetail = (claim: Claim): void => {
    if (claim?.claim_no)
      pushQuery(
        [
          {
            key: 'no',
            value: encodeURIComponent(claim.claim_no) as QueryValues,
          },
        ],
        ROUTES.PORTAL.CLAIMS.DETAIL,
      );
  };

  return (
    <>
      <div className='hidden md:block'>
        <AntTable
          rowKey='claim_no'
          className='mt-3 text-sm [&_.ant-table-body_.ant-table-row]:cursor-pointer [&_.ant-table-header_.ant-table-cell]:bg-white/0'
          bordered={false}
          dataSource={claims}
          columns={columns}
          loading={loading}
          pagination={false}
          size='small'
          sticky
          scroll={{ x: 'max-content' }}
          onRow={(record: Claim, idx: number) => ({
            onClick: () => openDetail(record),
          })}
        />
      </div>
      <div className='block md:hidden'>
        <ClaimCards dataSource={claims} onShowDetail={openDetail} />
      </div>
    </>
  );
};
export default Table;
