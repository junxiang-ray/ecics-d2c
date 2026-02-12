import Card from './PolicyCard';
import InfoCircleOutlined from '@/assets/icons/add-on/info-circle-outlined.svg';
import { Policy } from '@/libs/types/policy';

interface Props {
  data?: Policy['lower_text'];
}

const LowerTextDetail = ({ data }: Props): JSX.Element | null => {
  if (!data?.endorsements) return null;

  const entries = Object.entries(data.endorsements);
  if (!entries.length) return null;

  return (
    <Card
      title='Standard Clauses'
      subTitle='Private Vehicle Clauses'
      icon={<InfoCircleOutlined width='21' height='21' />}
    >
      <div className='[&>:not(:last-child)]:mb-4'>
        {entries.map(([code, text]) => (
          <div key={code} className='border-b border-gray-100 py-3'>
            <p className='font-body text-sm font-semibold text-gray-900'>
              {code}
            </p>
            <p className='font-body mt-1 text-sm text-gray-600'>{text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LowerTextDetail;
