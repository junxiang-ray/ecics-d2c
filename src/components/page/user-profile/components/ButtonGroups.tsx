import { Button, Form } from 'antd';
import { useFormContext } from 'react-hook-form';

interface Props {
  hidden: boolean;
  loading: boolean;
  onCancel: () => void;
}

const ButtonGroups = ({
  hidden,
  loading,
  onCancel,
}: Props): JSX.Element | null => {
  const {
    reset,
    formState: { isValid, dirtyFields },
  } = useFormContext();

  const isDirty = !!Object.keys(dirtyFields).length;

  if (hidden) return null;

  return (
    <>
      <div className='mt-3 grid grid-cols-2 gap-3'>
        <Button
          color='default'
          variant='filled'
          disabled={loading}
          onClick={() => {
            reset();
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          className='bg-[#52c41a] text-white transition-colors hover:bg-[#52c41a]/90 disabled:cursor-not-allowed disabled:opacity-50 [&_.ant-btn-loading-icon]:pb-1 [&_.ant-btn-loading-icon]:leading-none'
          color='green'
          variant='filled'
          disabled={!isDirty || !isValid || loading}
          loading={loading}
          htmlType='submit'
        >
          Save Changes
        </Button>
      </div>
    </>
  );
};
export default ButtonGroups;
