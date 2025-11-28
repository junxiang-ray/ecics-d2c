import ClaimInfo from './ClaimInfo';
import ClaimProgress from './ClaimProgressInfo';
import Documents from './ClaimDocuments';
import Notes from './Notes';
import PolicyInfo from './PolicyInfo';
import Contact from './ContactInfo';
import Actions from './QuickActions';

const CarClaim = (): JSX.Element => {
  return (
    <>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 [&>:not(:last-child)]:mb-6'>
          <ClaimInfo />
          <ClaimProgress />
          <Documents />
          <Notes />
        </div>
        <div className='[&>:not(:last-child)]:mb-6'>
          <PolicyInfo />
          <Contact />
          <Actions />
        </div>
      </div>
    </>
  );
};
export default CarClaim;
