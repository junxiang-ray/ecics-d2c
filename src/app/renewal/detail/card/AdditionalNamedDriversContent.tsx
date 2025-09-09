import { Form } from 'antd';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { InputField } from '@/components/ui/form/inputfield';

const AdditionalNamedDriversContent = () => {
  const { getValues } = useFormContext();
  const named_drivers = getValues('named_drivers') || [];

  const detailsMap = [
    { label: 'NRIC', name: 'nric' },
    { label: 'Date of Birth', name: 'dob' },
    { label: 'Gender', name: 'gender' },
    { label: 'Marital Status', name: 'marital_status' },
    { label: 'Driving Experience', name: 'driv_exp' },
  ];

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border border-[#FFF085] bg-yellow-50 p-4 text-sm'>
        First Driver is included within the plan at no additional cost,
        additional drivers cost SGD 65.40 each
      </div>

      {named_drivers.map((driver: any, idx: number) => (
        <div
          key={idx}
          className='space-y-3 rounded-lg border-[2px] border-gray-200 p-4'
        >
          {/* Header */}
          <div className='flex items-center justify-between font-bold'>
            {driver.name}
            <span className='rounded-xl bg-green-100 px-2 py-1 text-xs text-green-700'>
              Included
            </span>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {detailsMap.map((detail, i) => (
              <Form.Item
                key={`${driver.name}-${i}`}
                name={`named_drivers.${idx}.${detail.name}`}
              >
                <InputField
                  label={detail.label}
                  name={`named_drivers.${idx}.${detail.name}`}
                  disabled
                  className='cursor-not-allowed bg-gray-100'
                />
              </Form.Item>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalNamedDriversContent;
