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
        // POLICY_NUMBER: policy.POLICY_NUMBER,
        // INSDNAME: policy.INSDNAME,
        // POL_EXPDATE: policy.POL_EXPDATE,

        // // Summary meta
        // policy_type: policy.summary.policy_type,
        // policy_number: policy.summary.policy_number,

        // // Policy details
        // policy_details_status: policy.summary.data.policy_details.status,
        // policy_details: policy.summary.data.policy_details.data,

        // // Vehicle details
        // vehicle_details_status: policy.summary.data.vehicle_details.status,
        // vehicle_details: policy.summary.data.vehicle_details.data,

        // // Excess text
        // excess_text_status: policy.summary.data.excess_text.status,
        // excess_text: policy.summary.data.excess_text.data,

        // // Lower text / endorsements
        // lower_text_status: policy.summary.data.lower_text.status,
        // lower_text: policy.summary.data.lower_text.data,

        // // Clauses
        // policy_clauses_status: policy.summary.data.policy_clauses.status,
        // policy_clauses: policy.summary.data.policy_clauses.data.clauses,

        // // Insured drivers
        // insured_drivers_status: policy.summary.data.insured_drivers.status,
        // insured_drivers: policy.summary.data.insured_drivers.data.named_drivers,
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
