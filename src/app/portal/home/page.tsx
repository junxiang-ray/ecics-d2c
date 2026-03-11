// app/portal/home/page.tsx - ✅ PURE REACT QUERY
// Force push
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
  if (isLoading) {
    return <Spin className='pointer-events-none' fullscreen delay={150} />;
  }

  if (error) {
    console.warn('❌ Policy error:', error.message);
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
