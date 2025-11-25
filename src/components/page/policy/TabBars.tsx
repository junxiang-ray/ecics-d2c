'use client';

import { PolicySummary } from '@/libs/types/policy';

import { useContext, useRef } from 'react';
import { PolicyContext } from '@/app/portal/policies/layout';

import { Tabs } from 'antd';

type TabKeys = 'all' | 'active' | 'pending_renewal' | 'expired';

type Tab = {
  key: TabKeys;
  label: string;
  dataIndex: keyof PolicySummary;
};

const TabBars = (): JSX.Element => {
  const { summary, pushQuery } = useContext(PolicyContext);

  const tabItems = useRef<Tab[]>([
    {
      key: 'all',
      dataIndex: 'total',
      label: 'All',
    },
    {
      key: 'active',
      dataIndex: 'active',
      label: 'Active',
    },
    {
      key: 'pending_renewal',
      dataIndex: 'pending_renewal',
      label: 'Pending Renewal',
    },
    {
      key: 'expired',
      dataIndex: 'expired',
      label: 'Expired/Cancelled',
    },
  ]).current;

  const onChange = (tabKey: TabKeys): void => {
    if (tabKey === 'active')
      return pushQuery([
        { key: 'status', value: 'active' },
        { key: 'tags', value: '' },
      ]);

    if (tabKey === 'expired')
      return pushQuery([
        { key: 'status', value: 'expired' },
        { key: 'tags', value: '' },
      ]);

    if (tabKey === 'all')
      return pushQuery([
        { key: 'status', value: '' },
        { key: 'tags', value: '' },
      ]);

    if (tabKey === 'pending_renewal')
      return pushQuery([
        { key: 'status', value: '' },
        { key: 'tags', value: 'pending_renewal' },
      ]);
  };

  const tabLabelRender = (item: Tab): React.ReactNode => (
    <div className='flex items-center justify-center gap-[.25em] text-sm text-[#000]/90'>
      <span>{item.label}</span>
      {!!summary && <span>({summary[item.dataIndex] || 0})</span>}
    </div>
  );

  return (
    <Tabs
      className='[&_.ant-tabs-nav-list]:w-full [&_.ant-tabs-tab]:flex-1 [&_.ant-tabs-tab]:justify-center'
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
