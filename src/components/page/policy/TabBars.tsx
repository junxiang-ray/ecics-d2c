'use client';

import { PolicySummary } from '@/libs/types/policy';

import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  QUERY_KEY,
  usePolicyContext,
} from '@/components/contexts/PolicyLayoutContext';

import { Tabs } from 'antd';

type TabKeys = 'all' | 'active' | 'pending_renewal' | 'expired';

type Tab = {
  key: TabKeys;
  label: string;
  dataIndex: keyof PolicySummary;
};

const TabBars = (): JSX.Element => {
  const { summary, pushQuery } = usePolicyContext();
  const params = useSearchParams();

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

  const defaultActiveTabKey = useRef<TabKeys>(
    (() => {
      const tabKey = (params.get('status') || params.get('tags')) as TabKeys;
      if (!tabKey) return 'all';

      return tabItems.find((item) => item.key === tabKey)?.key || 'all';
    })(),
  ).current;

  const onChange = (tabKey: TabKeys): void => {
    if (tabKey === 'active')
      return pushQuery([
        { key: QUERY_KEY.POLICY_STATUS, value: 'active' },
        { key: QUERY_KEY.POLICY_TAGS, value: '' },
      ]);

    if (tabKey === 'expired')
      return pushQuery([
        { key: QUERY_KEY.POLICY_STATUS, value: 'expired' },
        { key: QUERY_KEY.POLICY_TAGS, value: '' },
      ]);

    if (tabKey === 'all')
      return pushQuery([
        { key: QUERY_KEY.POLICY_STATUS, value: '' },
        { key: QUERY_KEY.POLICY_TAGS, value: '' },
      ]);

    if (tabKey === 'pending_renewal')
      return pushQuery([
        { key: QUERY_KEY.POLICY_STATUS, value: '' },
        { key: QUERY_KEY.POLICY_TAGS, value: 'pending_renewal' },
      ]);
  };

  const tabLabelRender = (item: Tab): React.ReactNode => (
    <div className='flex items-center justify-center gap-[.25em] px-2 text-sm text-[#000]/90'>
      <span>{item.label}</span>
      {!!summary && <span>({summary[item.dataIndex] || 0})</span>}
    </div>
  );

  return (
    <Tabs
      // fix here
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
