'use client';

import { ClaimSummary, ClaimStatus } from '@/libs/types/claim';

import { useContext, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';

import { Tabs } from 'antd';

type TabKeys = 'all' | ClaimStatus;

type Tab = {
  key: TabKeys;
  label: string;
  dataIndex: keyof ClaimSummary;
};

const TabBars = (): JSX.Element => {
  const { summary, pushQuery } = useContext(ClaimContext);
  const params = useSearchParams();

  const tabItems = useRef<Tab[]>([
    {
      key: 'all',
      dataIndex: 'total',
      label: 'All',
    },
    {
      key: 'draft',
      dataIndex: 'draft',
      label: 'Draft',
    },
    {
      key: 'processing',
      dataIndex: 'processing',
      label: 'Processing',
    },
    {
      key: 'approved',
      dataIndex: 'approved',
      label: 'Approved',
    },
    {
      key: 'settled',
      dataIndex: 'settled',
      label: 'Settled',
    },
    {
      key: 'rejected',
      dataIndex: 'rejected',
      label: 'Rejected',
    },
  ]).current;

  const defaultActiveTabKey = useRef<TabKeys>(
    (() => {
      const tabKey = params.get('status') as TabKeys;
      if (!tabKey) return 'all';

      return tabItems.find((item) => item.key === tabKey)?.key || 'all';
    })(),
  ).current;

  const onChange = (tabKey: TabKeys): void => {
    if (tabKey === 'all') return pushQuery([{ key: 'status', value: '' }]);

    pushQuery([{ key: 'status', value: tabKey }]);
  };

  const tabLabelRender = (item: Tab): React.ReactNode => (
    <div className='flex items-center justify-center gap-[.25em] px-2 text-sm text-[#000]/90'>
      <span>{item.label}</span>
      {!!summary && <span>({summary[item.dataIndex] || 0})</span>}
    </div>
  );

  return (
    <Tabs
      className='[&_.ant-tabs-nav-list]:w-full [&_.ant-tabs-nav-list]:overflow-x-auto [&_.ant-tabs-nav-more]:hidden [&_.ant-tabs-tab]:flex-1 [&_.ant-tabs-tab]:justify-center'
      defaultActiveKey={defaultActiveTabKey}
      items={tabItems.map((item) => ({
        key: item.key,
        label: tabLabelRender(item),
      }))}
      centered
      onChange={(activeKey: string) => onChange(activeKey as TabKeys)}
    />
  );
};
export default TabBars;
