import CloseCircleOutlined from '@/assets/icons/close-circle-outlined.svg';

interface Props {
  message: string;
  valid?: boolean | null;
}

const PasswordRequirementItem = ({ message, valid }: Props): JSX.Element => {
  const color = valid
    ? 'text-green-700'
    : valid === false
      ? 'text-red-600'
      : '';
  return (
    <div
      className={`flex items-center gap-2 ${color || '[&>:first-child]:opacity-30'}`}
    >
      <CloseCircleOutlined className='transform-color h-4 w-4 opacity-80 duration-200' />
      <span className='transform-color font-body text-sm duration-200'>
        {message}
      </span>
    </div>
  );
};
export default PasswordRequirementItem;
