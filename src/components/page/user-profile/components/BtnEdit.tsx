import { memo } from 'react';

import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export interface Props {
  hidden?: boolean;
  onClick?: () => void;
}

const BtnEdit = ({ hidden, onClick }: Props): JSX.Element => {
  return (
    <Button
      className='h-8 py-1 pl-3 pr-0 text-blue-500 hover:text-blue-700'
      color='default'
      variant='link'
      size='large'
      hidden={hidden}
      disabled={hidden}
      onClick={(evt) => {
        evt?.preventDefault();
        if (onClick) onClick();
      }}
    >
      <EditOutlined height='2rem' />
    </Button>
  );
};
export default memo(BtnEdit);
