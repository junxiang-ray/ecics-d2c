import Announcements from '@/app/renewal/components/announcements/Announcements';
import Promotions from '@/app/renewal/components/promotions/Promotions';
import QuickActions from '@/app/renewal/components/quick-action/QuickActions';
import PoliciesPendingRenewal from '@/app/renewal/components/policies-renewal/PoliciesPendingRenewal';
import RenewalHeader from '@/app/renewal/components/renewal-header/RenewalHeader';

export default function RenewalPage() {
  return (
    <main className='p-6'>
      <RenewalHeader />
      <h1 className='text-2xl font-bold'>Welcome back, John</h1>
      <p className='mb-6 text-gray-500'>
        Manage your policies and stay protected
      </p>

      <section className='mb-8'>
        <PoliciesPendingRenewal />
      </section>

      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        <Promotions />
        <Announcements />
      </div>

      <QuickActions />
    </main>
  );
}
