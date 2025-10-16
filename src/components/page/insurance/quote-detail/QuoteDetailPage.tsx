import AppBar from '@/components/ui/appbar';
import CardUi from '@/components/ui/card';
import { memo, useCallback } from 'react';

const QuoteDetail = () => {
  return (
    <>
      <AppBar />
      <div className='mx-2 flex-1 text-center sm:mx-4'>
        <h1 className='m-0 py-10 text-base font-bold leading-tight text-gray-800 sm:text-[2rem]'>
          Home Content Insurance Quotation
        </h1>
      </div>

      <CardUi className='m-4 p-4'>
        <h1 className='mb-4 text-center text-2xl font-bold'>
          Quote Detail Page
        </h1>
        <p>This is the quote detail page content.</p>
      </CardUi>
    </>
  );
};

export default QuoteDetail;
