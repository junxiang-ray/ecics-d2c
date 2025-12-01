import { Button } from 'antd';

import EditOutlined from '@/assets/icons/add-on/edit-outlined.svg';

export interface Props {
  onClick?: () => void;
}

const BtnEdit = ({ onClick }: Props): JSX.Element => {
  return (
    <Button
      className='p-1 text-blue-500 hover:text-blue-700'
      color='default'
      variant='link'
      onClick={(evt) => {
        evt?.preventDefault();
        if (onClick) onClick();
      }}
    >
      <EditOutlined />
    </Button>
  );
};
export default BtnEdit;
