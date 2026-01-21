'use client';

import { Form } from 'antd';
import React from 'react';

import { DropdownField } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';

import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '@/app/motor/insurance/basic-detail/options';

type Field = {
  label: string;
  name: string;
  disabled?: boolean;
  isDropdown?: boolean;
  isRequired?: boolean;
};

const PolicyHolderContent = () => {
  const sections: { title: string; fields: Field[] }[] = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', name: 'name', disabled: true },
        { label: 'NRIC', name: 'nric', disabled: true },
        { label: 'Date of Birth', name: 'dob', disabled: true },
        { label: 'Gender', name: 'gender', isDropdown: true, disabled: true },
        { label: 'Marital Status', name: 'marital_status', isDropdown: true },
        {
          label: 'Driving Experience',
          name: 'driv_exp',
          disabled: true,
        },
      ],
    },
    {
      title: 'Full Address',
      fields: [
        { label: 'Address Line 1', name: 'address_line1', isRequired: true },
        { label: 'Address Line 2', name: 'address_line2' },
        { label: 'Country', name: 'country', disabled: true },
        { label: 'Postal Code', name: 'postal', isRequired: true },
      ],
    },
    {
      title: 'Contact Details',
      fields: [
        { label: 'Email', name: 'email', isRequired: true },
        { label: 'Phone Number', name: 'contact_no', isRequired: true },
      ],
    },
  ];

  return (
    <>
      {sections.map(({ title, fields }, idx) => (
        <div key={idx} className='mb-6'>
          <div className='mb-3 text-[14px] font-semibold'>{title}</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {fields.map(
              ({ label, name, disabled, isDropdown, isRequired }, idx) => (
                <Form.Item key={idx} name={name}>
                  {isDropdown ? (
                    <DropdownField
                      name={name}
                      label={label}
                      options={
                        name === 'gender'
                          ? GENDER_OPTIONS
                          : MARITAL_STATUS_OPTIONS
                      }
                      isRenewalFlow={true}
                      placeholder={`Select ${label.toLowerCase()}`}
                      isRequired={!!isRequired}
                      disabled={!!disabled}
                    />
                  ) : (
                    <InputField
                      name={name}
                      label={label}
                      disabled={!!disabled}
                      isRequired={!!isRequired}
                      isRenewalFlow={true}
                    />
                  )}
                </Form.Item>
              ),
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default PolicyHolderContent;
