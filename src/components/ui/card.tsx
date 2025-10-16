import { Card } from 'antd';
import { ReactNode } from 'react';

interface CardUiProps {
  className?: string | '';
  children?: ReactNode;
}

const CardUi: React.FC<CardUiProps> = ({ className, children }) => {
  return <Card className={className}>{children}</Card>;
};

export default CardUi;
