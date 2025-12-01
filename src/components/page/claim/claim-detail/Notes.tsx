'use client';

import { DATE_TIME_FORMAT } from '@/constants/date-time';

import { Note } from '@/libs/types/claim';

import { useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';

import { formatDateString } from '@/libs/utils/dayjs';

const Notes = (): JSX.Element => {
  const { claimDetail: claim } = useContext(ClaimContext);

  const notes = (claim?.notes ?? []) as Note[];

  return (
    <>
      <div className='rounded-xl border border-gray-200 bg-white p-6'>
        <h4 className='mb-6 font-heading leading-none'>Notes & Updates</h4>
        <div className='flex flex-col gap-4'>
          {notes.map((note, idx) => (
            <div
              key={idx}
              className='transform-bg border-l-4 border-blue-200 pl-4 duration-200 hover:bg-gray-50'
            >
              <div className='mb-1 flex items-center justify-between'>
                <h5 className='font-body font-medium'>{note?.title}</h5>
                <span className='font-body text-sm text-gray-400'>
                  {formatDateString(
                    note?.publish_date,
                    DATE_TIME_FORMAT.ISO_DATE_TIME,
                    DATE_TIME_FORMAT.EU_DATE_SLASH,
                  )}
                  &nbsp;
                </span>
              </div>
              <p className='font-body text-gray-500'>{note?.content}&nbsp;</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Notes;
