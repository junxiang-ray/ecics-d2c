'use client';

import { PolicyStatus, PolicyTag, Policy } from '@/libs/types/policy';
import { ROUTES } from '@/constants/routes';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePoliciePreviews } from '@/hook/policy/policy';

import { Tabs } from 'antd';
import Card from './PolicyCard';

type TabKey = 'all' | PolicyStatus | PolicyTag;

// ⭐ Helper to get display name for empty state
const getTabDisplayName = (tab: TabKey): string => {
  switch (tab) {
    case 'all':
      return '';
    case 'active':
      return 'Active';
    case 'expired':
      return 'Expired';
    case 'pending_renewal':
      return 'Pending Renewal';
    default:
      return '';
  }
};

const PolicyPreviews = (): React.ReactNode => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const router = useRouter();

  // Convert tab to filter options
  const getFilterOptions = (tab: TabKey) => {
    if (tab === 'all') return {};
    if (tab === 'active') return { policyStatus: 'active' as PolicyStatus };
    if (tab === 'expired') return { policyStatus: 'expired' as PolicyStatus };
    if (tab === 'pending_renewal')
      return {
        policyStatus: 'active' as PolicyStatus,
        tags: ['pending_renewal' as PolicyTag],
      };
    return {};
  };

  // ⭐ Stabilize filter options
  const filterOptions = useMemo(() => getFilterOptions(activeTab), [activeTab]);

  const { data: policies, isFetching } = usePoliciePreviews(
    filterOptions.policyStatus,
    filterOptions.tags,
  );

  const displayPolicies: Array<Policy | null> =
    isFetching && !policies?.length
      ? [null, null, null]
      : (policies as unknown as Policy[]) || [];

  const onTabChange = (tabKey: TabKey): void => {
    setActiveTab(tabKey);
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
    {
      key: 'expired',
      label: (
        <label className='pointer-events-none m-0 flex flex-col items-center'>
          <span className='invisible relative block h-0 font-semibold opacity-0'>
            Expired
          </span>
          Expired
        </label>
      ),
    },
  ] as { key: TabKey; label: React.ReactNode }[]).current;

  const extraContent: Partial<Record<'left' | 'right', React.ReactNode>> =
    useRef({
      right: (
        <button
          className='font-body ml-auto whitespace-nowrap border-b-2 border-transparent px-2 pb-4 font-medium text-[#02ADEF] transition-colors hover:border-[#02ADEF] hover:text-[#02ADEF]/80'
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

  // ⭐ Check if we should show empty state (not loading and no policies)
  const showEmptyState = !isFetching && displayPolicies.length === 0;
  const tabDisplayName = getTabDisplayName(activeTab);

  return (
    <div className='mb-12'>
      <Tabs
        className='[&_.ant-tabs-tab]:font-body mb-6 [&_.ant-tabs-ink-bar]:bg-[#02ADEF] [&_.ant-tabs-nav-list]:gap-6 [&_.ant-tabs-nav]:m-0 [&_.ant-tabs-tab-active]:font-semibold [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-[#02ADEF] [&_.ant-tabs-tab:hover]:text-gray-900 [&_.ant-tabs-tab]:m-0 [&_.ant-tabs-tab]:cursor-pointer [&_.ant-tabs-tab]:select-none [&_.ant-tabs-tab]:px-2 [&_.ant-tabs-tab]:px-2 [&_.ant-tabs-tab]:pb-4 [&_.ant-tabs-tab]:pt-0 [&_.ant-tabs-tab]:text-gray-600 [&_.ant-tabs-tab]:transition-colors'
        items={tabItems}
        tabBarExtraContent={extraContent}
        onChange={(activeKey) => onTabChange(activeKey as TabKey)}
      />

      {showEmptyState ? (
        <div className='flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 md:min-h-[160px]'>
          <p className='font-body text-center text-sm text-gray-500 md:text-base'>
            {activeTab === 'all'
              ? 'No policies found'
              : `No ${tabDisplayName} Policies`}
          </p>
        </div>
      ) : (
        // ⭐ Policy cards grid
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {displayPolicies?.map((policy, idx) => (
            <Card
              key={`${policy?.policy_no || 'skeleton'}_#_${idx}`}
              data={policy}
              onShowDetail={navigateToDetailScreen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicyPreviews;
