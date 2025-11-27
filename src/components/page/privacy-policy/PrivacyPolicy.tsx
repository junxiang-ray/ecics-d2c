'use client';

import { PrivacyPolicyAttr } from '@/libs/types/privacy-policy';

import { formatDateString } from '@/libs/utils/dayjs';

import BackOutlined from '@/assets/icons/renewal/back.svg';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrivacyPolicies } from '@/hook/privacy-policy/privacy-policy';

const PrivacyPolicy = (): JSX.Element => {
  const { data, isFetching } = usePrivacyPolicies();

  const isNodata: boolean = !isFetching && !data;
  const privacyDetail: PrivacyPolicyAttr = (data?.data?.attributes ??
    {}) as PrivacyPolicyAttr;

  return (
    <>
      <div className='mb-3'>
        <button
          className='-ml-2 flex flex-nowrap items-start gap-4'
          aria-label='Back'
        >
          <span className='rou:nded-md inline-block p-2 hover:bg-gray-100'>
            <BackOutlined />
          </span>
          <div className='mb-2 flex flex-col items-start gap-3'>
            <h1 className='font-heading text-3xl font-bold text-gray-900'>
              Privacy Policy
            </h1>
            <p className='font-body text-gray-600'>
              Learn how we protect and manage your personal information
            </p>
          </div>
        </button>
      </div>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='prose prose-gray'>
          <p className='mb-6 text-gray-600'>
            Last updated:{' '}
            {!isNodata &&
              formatDateString(
                privacyDetail.updatedAt,
                'YYYY-MM-DDTHH:mm:sssZ',
                'MMM DD, YYYY',
              )}
          </p>
        </div>
        <div className='prose prose-strong:font-extrabold whitespace-pre-line'>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {privacyDetail.content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
};
export default PrivacyPolicy;
