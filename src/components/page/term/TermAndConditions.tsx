'use client';

import { TermAndConditionAttr } from '@/libs/types/term-and-condition';

import { formatDateString } from '@/libs/utils/dayjs';

import { Button } from 'antd';
import BackOutlined from '@/assets/icons/renewal/back.svg';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useRouter } from 'next/navigation';
import { useTermAndConditions } from '@/hook/term-and-condition/term-and-condition';

const TermAndConditions = (): JSX.Element => {
  const router = useRouter();
  const { data, isFetching } = useTermAndConditions();

  const isNodata: boolean = !isFetching && !data;
  const termDetail: TermAndConditionAttr = (data?.data?.attributes ??
    {}) as TermAndConditionAttr;

  return (
    <>
      <div className='mb-3'>
        <div className='flex flex-nowrap items-start gap-4'>
          <Button
            className='px-2 text-black'
            color='default'
            type='link'
            size='large'
            title='Back'
            onClick={() => router.back()}
          >
            <BackOutlined />
          </Button>
          <div className='mb-2 flex flex-col items-start gap-3'>
            <div className='font-heading text-3xl font-bold text-gray-900'>
              Terms and Conditions
            </div>
            <p className='font-body text-gray-600'>
              Please read our terms and conditions carefully
            </p>
          </div>
        </div>
      </div>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='prose prose-gray'>
          <p className='mb-6 text-gray-600'>
            Last updated:{' '}
            {!isNodata &&
              formatDateString(
                termDetail.updatedAt,
                'YYYY-MM-DDTHH:mm:sssZ',
                'MMM DD, YYYY',
              )}
          </p>
        </div>
        <div className='prose prose-strong:font-extrabold whitespace-pre-line'>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {termDetail.content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
};
export default TermAndConditions;
