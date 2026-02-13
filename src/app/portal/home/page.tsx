// app/portal/home/page.tsx - ✅ PURE REACT QUERY
'use client';
import { Spin } from 'antd';
import { usePolicyData } from '@/hook/policy/usePolicyData';

import Welcome from '@/components/page/dashboard/Welcome';
import Policies from '@/components/page/dashboard/policies/PolicyPreviews';
import Promotions from '@/components/page/dashboard/promotions/Promotions';
import Announcement from '@/components/page/dashboard/important-announcements/ImportantAnnouncements';
import QuickActions from '@/components/page/dashboard/quick-actions/QuickActions';

const Home = () => {
  const { data: policies, isLoading, error } = usePolicyData();

  console.log('🔍 Policy Debug:', {
    isLoading,
    error: error?.message || null,
    policiesCount: policies?.length || 0,
    source: 'React Query cache (24hr)',
  });

  if (isLoading) {
    console.log('⏳ Loading policies...');
    return <Spin className='pointer-events-none' fullscreen delay={150} />;
  }

  if (error) {
    console.log('❌ Policy error:', error.message);
  }

  if (policies?.length) {
    console.log('✅ Policies loaded:', policies.length);

    policies.forEach((policy, index) => {
      console.log(`📋 Policy ${index + 1} FULL OBJECT:`, policy);

      console.log(`📋 Policy ${index + 1} SUMMARY:`, {
        // Top-level
        policy
      
      });
    });
  } else {
    console.log('ℹ️ No policies found');
  }


  return (
    <div>
      <Welcome />
      <Policies />
      <div className='mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <Promotions />
        <Announcement />
      </div>
      <QuickActions />
    </div>
  );
};

export default Home;
