import Card from './PolicyCard';
import InfoCircleOutlined from '@/assets/icons/add-on/info-circle-outlined.svg';
import { Policy } from '@/libs/types/policy';

interface Props {
  data?: Policy['policy_clauses'];
}

const PolicyClausesDetail = ({ data }: Props): JSX.Element | null => {
  if (!data?.clauses?.length) return null;

  return (
    <Card
      title='Optional Benefit'
      subTitle='Terms and conditions applicable to this policy'
      icon={<InfoCircleOutlined width='21' height='21' />}
    >
      <div className='[&>:not(:last-child)]:mb-4'>
        {data.clauses
          .sort((a, b) => a.seq_no - b.seq_no)
          .map((clause) => (
            <div key={clause.code} className='border-b border-gray-100 py-3'>
              <p className='font-body text-sm font-semibold text-gray-900'>
                {clause.code}
              </p>
              <p className='font-body mt-1 text-sm text-gray-600'>
                {clause.title}
              </p>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default PolicyClausesDetail;
