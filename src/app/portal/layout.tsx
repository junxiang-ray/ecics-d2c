import Header from '@/components/page/header/PortalPageHeader';

interface Props {
  children: React.ReactNode;
}

const PortalLayout = ({ children }: Props): React.ReactNode => {
  return (
    <div className='site portal-site h-[100svh] bg-gray-50'>
      <Header />
      <div className='mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8'>
        {children}
      </div>
    </div>
  );
};
export default PortalLayout;
