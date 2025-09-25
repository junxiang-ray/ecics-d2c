import { Form } from 'antd';
import React from 'react';

import { InputField } from '@/components/ui/form/inputfield';

const PolicyDetailsContent = ({ errors }: { errors: any }) => {
  const fields = [
    { name: 'current_policy_no', label: 'Existing Policy No.' },
    { name: 'coverage', label: 'Plan Type' },
    { name: 'current_policy_expiry_date', label: 'Current Expiry Date' },
    { name: 'date_extracted', label: 'Renewal Notice Dated on' },
    { name: 'sum_insured', label: 'Sum Insured' },
    { name: 'scheme', label: 'Scheme' },
    { name: 'agency', label: 'Intermediary Name' },
  ];

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            validateStatus={errors?.[field.name] ? 'error' : ''}
          >
            <InputField
              name={field.name}
              label={field.label}
              isRenewalFlow={true}
              disabled
            />
          </Form.Item>
        ))}
      </div>
    </div>
  );
};

export default PolicyDetailsContent;
