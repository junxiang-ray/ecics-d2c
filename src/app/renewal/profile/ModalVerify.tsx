import { Button, Input, Modal } from 'antd';

interface Props {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}
export default function ModalVerify({ isOpen, onClose }: Props) {
  const content = (
    <div className='flex flex-col gap-4'>
      <div>
        <p>We've sent a 6-digit verification code to</p>
        <p className='font-semibold'>email</p>
      </div>
      <div>
        <p className='mb-2'>Enter verification code</p>
        <Input className='h-[40px] text-center' placeholder='123456' />
      </div>
      <Button className='h-[40px] w-full bg-blue-600 text-white hover:bg-blue-400'>
        Verify Code
      </Button>
      <div className='flex flex-col items-center justify-center gap-1'>
        <p>Didn't receive the code?</p>
        <p className='text-blue-600'>Resend Code</p>
      </div>
      <div className='rounded-md border border-yellow-200 bg-yellow-50 p-2 text-[11px] text-yellow-700'>
        <strong>For testing:</strong> Use code "123456" to verify changes
      </div>
    </div>
  );

  return (
    <Modal
      title={<span className='font-semibold'>Verify Email</span>}
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      className='opacity-1 bg-opacity-100'
      styles={{
        mask: {
          backgroundColor: 'black',
        },
      }}
      width={400}
      centered
    >
      {content}
    </Modal>
  );
}
