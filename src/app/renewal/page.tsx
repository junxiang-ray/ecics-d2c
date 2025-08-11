// import RenewalList from './components/RenewalList';
// import Promotions from './components/Promotions';
// import Announcements from './components/Announcements';
// import QuickActions from './components/QuickActions';

export default function RenewalPage() {
  return (
    <main className='p-6'>
      <h1 className='text-2xl font-bold'>Welcome back, John</h1>
      <p className='mb-6 text-gray-500'>
        Manage your policies and stay protected
      </p>

      <section className='mb-8'>{/*<RenewalList />*/}</section>

      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        {/*<Promotions />*/}
        {/*<Announcements />*/}
      </div>

      {/*<QuickActions />*/}
    </main>
  );
}
