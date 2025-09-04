import { Form } from 'antd';
import React from 'react';

import { InputField } from '@/components/ui/form/inputfield';

const ExcessContent = ({ renewal }: { renewal: any }) => {
  const { policy_excess = [], additional_excess = [] } =
    renewal?.renewal_excess || {};

  const renderFields = (
    fields: { title: string; value: string }[],
    prefix: string,
  ) =>
    fields.map((field, idx) => (
      <Form.Item key={`${prefix}-${idx}`} name={`${prefix}_${idx}`}>
        <InputField
          label={field.title}
          name={`${prefix}_${idx}`}
          disabled
          className='cursor-not-allowed bg-gray-100'
        />
      </Form.Item>
    ));

  return (
    <div className='space-y-6'>
      <div>
        <div className='mb-3 text-[14px] font-semibold'>Policy Excess</div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {renderFields(policy_excess, 'policy_excess')}
        </div>
      </div>
      <div>
        <div className='mb-3 text-[14px] font-semibold'>Additional Excess</div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {renderFields(additional_excess, 'additional_excess')}
        </div>
      </div>
    </div>
  );
};

export default ExcessContent;
