'use client';

import { DATE_TIME_FORMAT } from '@/constants/date-time';

import { Document } from '@/libs/types/claim';

import { Button } from 'antd';
import { useContext } from 'react';
import { ClaimContext } from '@/components/contexts/ClaimLayoutContext';

import { formatDateString } from '@/libs/utils/dayjs';

import DocumentOutlined from '@/assets/icons/document-oulined.svg';
import DownloadOutlined from '@/assets/icons/renewal/download.svg';

const ClaimDocuments = (): JSX.Element => {
  const { claimDetail: claim } = useContext(ClaimContext);

  const documents = (claim?.documents ?? []) as Document[];

  const download = (document: Document): void => {
    // todo: trigger call api to download document;
  };

  return (
    <>
      <div className='rounded-xl border border-gray-200 bg-white p-6'>
        <div className='font-heading mb-4 text-lg font-semibold leading-none'>
          Documents
        </div>
        <div className='flex flex-col gap-4'>
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className='flex flex-nowrap items-center gap-3 rounded-lg border border-gray-200 p-3'
            >
              <DocumentOutlined className='h-5 w-5 text-gray-500' />
              <div>
                <div className='font-body font-medium'>{doc?.title}</div>
                <div className='font-body flex flex-col text-sm text-gray-500 sm:flex-row'>
                  <span>
                    {doc?.file_count > 2 ? (
                      <span>{doc?.file_count || 0} files</span>
                    ) : (
                      <span>{doc?.file_count || 0} file</span>
                    )}
                  </span>
                  <span className='mx-1 hidden sm:inline-block'>•</span>
                  <span>
                    Uploaded &nbsp;
                    {formatDateString(
                      doc?.upload_date,
                      DATE_TIME_FORMAT.ISO_DATE_TIME,
                      DATE_TIME_FORMAT.EU_DATE_SLASH,
                    ) ?? <span className='opacity-50'>--/--/----</span>}
                  </span>
                </div>
              </div>
              <Button
                className='ml-auto'
                color='default'
                variant='text'
                title='Download'
                icon={<DownloadOutlined />}
                onClick={() => download(doc)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default ClaimDocuments;
