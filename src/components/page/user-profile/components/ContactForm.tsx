import { parsePhoneNumber, formatPhoneNumber } from '@/libs/utils/utils';
import { useCallback } from 'react';
import { FORM_ITEM, FormValues } from '../PersonalInfo';
import FormItem from './FormItem';
import MailOutlined from '@/assets/icons/basic-detail/mail.svg';
import PhoneOutlined from '@/assets/icons/basic-detail/phone.svg';

type AddressGroupValues = Pick<
  FormValues,
  'address_1' | 'address_2' | 'address_3' | 'postal_code'
>;

interface Props {
  isEdit: boolean;
}

const ContactForm = ({ isEdit }: Props): JSX.Element => {
  const parsePhone = useCallback<(value: string) => string>((value) => {
    const { prefix, areaCode, nbr } = parsePhoneNumber(value);
    return formatPhoneNumber(`${areaCode}${nbr}`, areaCode);
  }, []);

  return (
    <>
      <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
        <FormItem<FormValues>
          label='Email Address'
          name={FORM_ITEM.EMAIL}
          enabled={isEdit}
          prefix={<MailOutlined className='text-gray-500' />}
        />
        <FormItem<FormValues>
          label='Phone Number'
          name={FORM_ITEM.PHONE}
          enabled={isEdit}
          parser={parsePhone}
          placeholder
          formatter={formatPhoneNumber}
          prefix={<PhoneOutlined className='text-gray-500' />}
        />
      </div>
    </>
  );
};
export default ContactForm;
