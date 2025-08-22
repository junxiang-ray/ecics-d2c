'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { PrivateMotorCarIcon } from '@/components/icons/renewal-icons';

import { ROUTES } from '@/constants/routes';

interface Policy {
  id: string;
  type: string;
  coverage: string;
  policyNumber: string;
  expiryDate: string;
  extraLabel: string;
  extraValue: string;
  icon: JSX.Element;
}

const policies: Policy[] = [
  {
    id: '1',
    type: 'Private Motor Car',
    coverage: 'Comprehensive Plus',
    policyNumber: 'MC2024001',
    expiryDate: '21 May 2025',
    extraLabel: 'Vehicle Registration',
    extraValue: 'SJK1234A',
    icon: <PrivateMotorCarIcon className='text-2xl text-sky-500' />,
  },
  {
    id: '2',
    type: 'Maid Insurance',
    coverage: 'Standard Coverage',
    policyNumber: 'MI2024001',
    expiryDate: '15 Jun 2025',
    extraLabel: "Helper's Name",
    extraValue: 'Maria Santos',
    icon: <PrivateMotorCarIcon className='text-2xl text-sky-500' />,
  },
  {
    id: '3',
    type: 'Private Motor Car',
    coverage: 'Comprehensive Plus',
    policyNumber: 'MC2024003',
    expiryDate: '30 Aug 2025',
    extraLabel: 'Vehicle Registration',
    extraValue: 'SLA8888B',
    icon: <PrivateMotorCarIcon className='text-2xl text-sky-500' />,
  },
];

const PoliciesPendingRenewal: FC = () => {
  const router = useRouter();
  const handleRenew = (policy: Policy) => {
    router.push(ROUTES.RENEWAL.RENEWAL_NOTICE);
  };

  return (
    <div className='mx-auto max-w-[1200px]'>
      <h2 className='mb-4 text-lg font-semibold'>Policies Pending Renewal</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {policies.map((policy) => (
          <div
            key={policy.id}
            onClick={() => handleRenew(policy)}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 2px 5px rgba(0,0,0,0.08), -2px 2px 5px rgba(0,0,0,0.06), 2px 2px 5px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            className='flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1'
          >
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center rounded-[10px] bg-sky-100 p-2'>
                {policy.icon}
              </div>

              <div className='flex-1'>
                <p className='font-semibold'>{policy.type}</p>
                <p className='text-xs text-gray-500'>{policy.coverage}</p>
              </div>
              <span className='flex-shrink-0 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700'>
                Pending Renewal
              </span>
            </div>
            <hr className='-mx-4 mt-4 border-t border-gray-100' />
            <div className='mt-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='text-xs font-semibold text-gray-500'>
                  POLICY NUMBER
                </div>
                <div className='text-right text-xs font-semibold text-gray-500'>
                  EXPIRY DATE
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='text-[12px] font-semibold text-gray-900'>
                  {policy.policyNumber}
                </div>
                <div className='text-right text-[12px] font-semibold text-gray-900'>
                  {policy.expiryDate}
                </div>
              </div>
              <hr className='my-3 border-t border-gray-100' />
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-xs font-semibold text-gray-500'>
                    {policy.extraLabel?.toUpperCase() ?? ''}
                  </div>
                  <div className='text-[12px] font-semibold text-gray-900'>
                    {policy.extraValue}
                  </div>
                </div>
                <span className='mr-2 text-[12px] font-semibold text-sky-500'>
                  Renew Now &gt;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoliciesPendingRenewal;
