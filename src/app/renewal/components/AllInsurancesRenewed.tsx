import CheckCircle from '@/components/icons/CheckCircle';

export const AllInsurancesRenewed = () => {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-6'>
      <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500'>
        <CheckCircle className='text-white' size={48} />
      </div>
      <p className='text-xl font-semibold text-[#101828]'>All Caught Up!</p>
      <p className='max-w-[450px] text-center text-base text-[#6A7282]'>
        You don't have any policies pending renewal at the moment. All your
        policies are up to date.
      </p>
    </div>
  );
};
