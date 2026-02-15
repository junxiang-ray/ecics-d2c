'use client';

import { Form } from 'antd';
import React from 'react';

import { DropdownOption } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { useGetHirePurchaseList } from '@/hook/insurance/quote';

const VehicleDetailsContent = () => {
  const { data: hirePurchaseList } = useGetHirePurchaseList(PRODUCT_NAME.CAR);
  // Options for Dropdown
  const hirePurchaseListFormatted: DropdownOption[] = [
    ...(Array.isArray(hirePurchaseList)
      ? hirePurchaseList.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      : []),
  ];

  const sections = [
    {
      title: 'Vehicle Information',
      fields: [
        { label: 'Vehicle Registration No.', name: 'reg_no' },
        { label: 'Vehicle Make', name: 'make' },
        { label: 'Vehicle Model', name: 'model' },
        {
          label: 'First Registered Year',
          name: 'first_reg_on',
        },
        {
          label: 'Hire Purchase Company',
          name: 'hire_purchase',
        },
      ],
    },
    {
      title: 'Claims and NCD',
      fields: [
        { label: 'No. of Claims', name: 'no_of_claims' },
        { label: 'Claim Amount', name: 'claim_incurred' },
        { label: 'Current NCD', name: 'current_ncd' },
        { label: 'Renewal NCD', name: 'renewal_ncd' },
      ],
    },
  ];

  return (
    <>
      {sections.map(({ fields, title }, idx) => (
        <div key={idx} className='mb-6'>
          <div className='mb-3 text-[14px] font-semibold'>{title}</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {fields.map(({ label, name }, idx) => (
              <Form.Item key={idx} name={name}>
                {/*{name === 'hire_purchase' ? (*/}
                {/*    <LongOptionDropdownField*/}
                {/*        name='hire_purchase'*/}
                {/*        label={label}*/}
                {/*        isRequired*/}
                {/*        placeholder='Select hire purchase company'*/}
                {/*        options={hirePurchaseListFormatted}*/}
                {/*        showSearch*/}
                {/*    />*/}
                {/*) : (*/}
                <InputField
                  name={name}
                  disabled
                  label={label}
                  isRenewalFlow={true}
                />
                {/*)}*/}
              </Form.Item>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default VehicleDetailsContent;
