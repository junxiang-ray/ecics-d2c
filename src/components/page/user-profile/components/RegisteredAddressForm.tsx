import { FORM_ITEM, FormValues } from '../PersonalInfo';

import { useFormContext } from 'react-hook-form';
import { Input } from 'antd';
import FormItem from './FormItem';

type AddressGroupValues = Pick<
  FormValues,
  'address_1' | 'address_2' | 'address_3' | 'postal_code'
>;

interface Props {
  isEdit: boolean;
}

const RegisteredAddressForm = ({ isEdit }: Props): JSX.Element => {
  const { getValues } = useFormContext();
  const formValues = getValues() as unknown as FormValues;

  if (!isEdit)
    return (
      <div className='form-item-no-edit flex items-start justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'>
        <div className='font-body text-base leading-relaxed text-gray-900'>
          {formValues[FORM_ITEM.ADDRESS_1]}
          <br />
          {formValues[FORM_ITEM.ADDRESS_2]}
          <br />
          {formValues[FORM_ITEM.ADDRESS_3]}
          <br />
          {formValues[FORM_ITEM.ADDRESS_3]}&ensp;
          {formValues[FORM_ITEM.POSTAL_CODE]}
        </div>
      </div>
    );

  return (
    <>
      <div className='grid-row-2 grid grid-cols-2 gap-5'>
        <FormItem<FormValues>
          label='Address Line 1'
          name={FORM_ITEM.ADDRESS_1}
          enabled={isEdit}
        />
        <FormItem<FormValues>
          label='Address Line 2'
          name={FORM_ITEM.ADDRESS_2}
          enabled={isEdit}
        />
        <FormItem<FormValues>
          label='Address Line 3'
          name={FORM_ITEM.ADDRESS_3}
          enabled={isEdit}
        />
        <FormItem<FormValues>
          label='Postal Code'
          name={FORM_ITEM.POSTAL_CODE}
          enabled={isEdit}
        />
      </div>
    </>
  );
};
export default RegisteredAddressForm;
