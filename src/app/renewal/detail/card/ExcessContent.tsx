import { Form } from 'antd';
import React from 'react';

import { InputField } from '@/components/ui/form/inputfield';

interface ExcessItem {
  title: string;
  value: string;
}

interface ExcessContentProps {
  renewal: {
    renewal_excess?: {
      policy_excess?: ExcessItem[];
      additional_excess?: ExcessItem[];
    };
  };
}

const ExcessContent = ({ renewal }: ExcessContentProps) => {
  const { policy_excess = [], additional_excess = [] } =
    renewal?.renewal_excess || {};

  const fields = [
    ...policy_excess.map((item: ExcessItem, idx: number) => ({
      name: `policy_excess_${idx}`,
      label: item.title,
      value: item.value,
      section: 'Policy Excess',
    })),
    ...additional_excess.map((item: ExcessItem, idx: number) => ({
      name: `additional_excess_${idx}`,
      label: item.title,
      value: item.value,
      section: 'Additional Excess',
    })),
  ];

  // Group fields by section
  const groupedFields = fields.reduce<Record<string, typeof fields>>(
    (acc, field) => {
      if (!acc[field.section]) acc[field.section] = [];
      acc[field.section].push(field);
      return acc;
    },
    {},
  );

  return (
    <div className='space-y-6'>
      {Object.entries(groupedFields).map(([sectionName, sectionFields]) => (
        <div key={sectionName}>
          <div className='mb-3 text-[14px] font-semibold'>{sectionName}</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {sectionFields.map((field) => (
              <Form.Item key={field.name} name={field.name}>
                <InputField
                  name={field.name}
                  label={field.label}
                  value={field.value}
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

export default ExcessContent;
