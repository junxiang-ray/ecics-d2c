import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';

type Props = TextAreaProps;

const MTextArea = ({ className = '', ...props }: Props) => {
  return (
    <Input.TextArea
      {...props}
      autoSize={{ minRows: 1 }}
      className={`resize-y ${className}`}
      count={{
        strategy: (value: string) =>
          value ? value.replace(/\r/g, '').length : 0,
      }}
    />
  );
};

export default MTextArea;
