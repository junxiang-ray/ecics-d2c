import { Policy } from '@/libs/types/policy';
import { formatDateString } from '@/libs/utils/dayjs';

import Card from './PolicyCard';
import DocumentOutlined from '@/assets/icons/document-oulined.svg';

interface Props {
  data?: Policy['maid_info'];
}

const InsuredMaidDetail = ({ data }: Props): JSX.Element | null => {
  if (!data) return null;

  const row = (
    label: string,
    content?: JSX.Element | string | number,
    className?: string,
  ): JSX.Element => {
    return (
      <div>
        <label className='mb-1.5 block font-body text-sm font-medium text-gray-700'>
          {label}
        </label>
        <p
          className={`font-body text-base font-semibold text-gray-900 opacity-80 ${className ?? ''}`}
        >
          {content ?? 'N/A'}
        </p>
      </div>
    );
  };

  return (
    <Card
      title='Insured Maid'
      subTitle='Domestic helper details'
      icon={<DocumentOutlined width='21' height='21' />}
    >
      <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
        {row('Full Name', data.name)}
        {row(
          'Date of Birth',
          formatDateString(data.date_of_birth, 'YYYY-MM-DD', 'DD/MM/YYYY'),
        )}
        {row('Nationality', data.nationality)}
        {row('Passport No.', data.passport_number)}
        {row('FIN No.', data.fin)}
      </div>
    </Card>
  );
};
export default InsuredMaidDetail;
