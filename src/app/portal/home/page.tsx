import Welcome from '@/components/page/dashboard/Welcome';
import Policies from '@/components/page/dashboard/policies/PolicyPreviews';
import Promotions from '@/components/page/dashboard/promotions/Promotions';
import Announcement from '@/components/page/dashboard/important-announcements/ImportantAnnouncements';
import QuickActions from '@/components/page/dashboard/quick-actions/QuickActions';

const Home = (): React.ReactNode => {
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
