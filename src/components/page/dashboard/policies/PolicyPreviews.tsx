'use client';

import {
  PolicyStatus,
  PolicyTag,
  Policy,
  PolicyPayload,
} from '@/libs/types/policy';
import { ROUTES } from '@/constants/routes';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePoliciePreviews } from '@/hook/policy/policy';

import { Tabs } from 'antd';
import Card from './PolicyCard';

type TabKey = 'all' | PolicyStatus | PolicyTag;

const PolicyPreviews = (): React.ReactNode => {
  const [payload, setPayload] = useState<{
    policyStatus?: PolicyStatus;
    tags?: PolicyTag[];
  }>({});

  const router = useRouter();
  const { data, isFetching, refetch } = usePoliciePreviews(
    payload.policyStatus,
    payload.tags,
  );

  const policies: Array<Policy | null> =
    data == null && isFetching
      ? [null, null, null]
      : ((data?.data?.results ?? []) as unknown as Policy[]);

  const onTabChange = (tabKey: TabKey): void => {
    setPayload((prev) => {
      if (tabKey === 'all') return {};

      if (tabKey === 'active')
        return { policyStatus: 'active', tags: ['pending', 'renewed'] };

      if (tabKey === 'pending_renewal')
        return { policyStatus: 'active', tags: ['pending_renewal'] };

      return { ...prev };
    });
  };

  const tabItems = useRef([
    {
      key: 'all',
      label: (
        <label className='pointer-events-none m-0 flex flex-col items-center'>
          <span className='invisible relative block h-0 font-semibold opacity-0'>
            All
          </span>
          All
        </label>
      ),
    },
    {
      key: 'pending_renewal',
      label: (
        <label className='pointer-events-none m-0 flex flex-col items-center'>
          <span className='invisible relative block h-0 font-semibold opacity-0'>
            Pending Renewal
          </span>
          Pending Renewal
        </label>
      ),
    },
    {
      key: 'active',
      label: (
        <label className='pointer-events-none m-0 flex flex-col items-center'>
          <span className='invisible relative block h-0 font-semibold opacity-0'>
            Active
          </span>
          Active
        </label>
      ),
    },
  ] as { key: TabKey; label: React.ReactNode }[]).current;

  const extraContent: Partial<Record<'left' | 'right', React.ReactNode>> =
    useRef({
      right: (
        <button
          className='ml-auto whitespace-nowrap border-b-2 border-transparent px-2 pb-4 font-body font-medium text-[#02ADEF] transition-colors hover:border-[#02ADEF] hover:text-[#02ADEF]/80'
          onClick={() => router.push(ROUTES.PORTAL.POLICIES.ROOT)}
        >
          View all
        </button>
      ),
    }).current;

  const navigateToDetailScreen = (policy: Policy | null): void => {
    if (!policy?.policy_no) {
      router.push(ROUTES.PORTAL.POLICIES.ROOT);
      return;
    }

    router.push(
      `${ROUTES.PORTAL.POLICIES.DETAIL}?no=${encodeURIComponent(policy.policy_no)}`,
    );
  };

  return (
    <div className='mb-12'>
      <Tabs
        className='mb-6 [&_.ant-tabs-ink-bar]:bg-[#02ADEF] [&_.ant-tabs-nav-list]:gap-6 [&_.ant-tabs-nav]:m-0 [&_.ant-tabs-tab-active]:font-semibold [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-[#02ADEF] [&_.ant-tabs-tab:hover]:text-gray-900 [&_.ant-tabs-tab]:m-0 [&_.ant-tabs-tab]:cursor-pointer [&_.ant-tabs-tab]:select-none [&_.ant-tabs-tab]:px-2 [&_.ant-tabs-tab]:px-2 [&_.ant-tabs-tab]:pb-4 [&_.ant-tabs-tab]:pt-0 [&_.ant-tabs-tab]:font-body [&_.ant-tabs-tab]:text-gray-600 [&_.ant-tabs-tab]:transition-colors'
        items={tabItems}
        tabBarExtraContent={extraContent}
        onChange={(activeKey) => onTabChange(activeKey as TabKey)}
      />
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        {policies?.map((policy, idx) => (
          <Card
            key={`${policy?.policy_no}_#_${idx}`}
            data={policy}
            onShowDetail={navigateToDetailScreen}
          />
        ))}
      </div>
    </div>
  );
};
export default PolicyPreviews;
