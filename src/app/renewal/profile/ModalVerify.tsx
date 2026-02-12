'use client';

import { useState } from 'react';
import { Button, Input, Modal } from 'antd';

interface Props {
  /** Controls modal visibility */
  isOpen: boolean;

  /** Called when modal is closed */
  onClose: (isOpen: boolean) => void;

  /** Optional overrides (safe defaults provided) */
  title?: string;
  destinationLabel?: string; // e.g. email / phone number
  onVerify?: (code: string) => void;
  onResend?: () => void;
  resendCooldown?: number; // Seconds remaining
  isResending?: boolean;
}

export default function ModalVerify({
  isOpen,
  onClose,
  title = 'Verify Email',
  destinationLabel = 'email',
  onVerify,
  onResend,
  resendCooldown = 0,
  isResending = false,
}: Props) {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (!code) return;
    onVerify?.(code);
  };

  // Format cooldown display (MM:SS)
  const formatCooldown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCooldownActive = resendCooldown > 0;

  return (
    <Modal
      title={<span className='font-semibold'>{title}</span>}
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      width={400}
      centered
      styles={{
        mask: {
          backgroundColor: 'black',
        },
      }}
    >
      <div className='flex flex-col gap-4'>
        {/* Info */}
        <div>
          <p>We've sent a 6-digit verification code to</p>
          <p className='font-semibold'>{destinationLabel}</p>
        </div>

        {/* Code input */}
        <div>
          <p className='mb-2'>Enter verification code</p>
          <Input
            className='h-[40px] text-center tracking-widest'
            placeholder='123456'
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Verify button */}
        <Button
          className='h-[40px] w-full bg-blue-600 text-white hover:bg-blue-500'
          onClick={handleVerify}
          disabled={code.length !== 6}
        >
          Verify Code
        </Button>

        {/* Resend */}
        <div className='flex flex-col items-center justify-center gap-1 text-sm'>
          <p>Didn't receive the code?</p>
          <Button
            type='link'
            className='h-auto p-0'
            onClick={onResend}
            disabled={isCooldownActive || isResending}
            loading={isResending}
          >
            {isCooldownActive
              ? `Resend in ${formatCooldown(resendCooldown)}`
              : 'Resend Code'}
          </Button>
        </div>

        {/* Testing notice (safe to keep or remove later) */}
        <div className='rounded-md border border-yellow-200 bg-yellow-50 p-2 text-[11px] text-yellow-700'>
          <strong>For testing:</strong> Use code <code>123456</code> to verify
        </div>
      </div>
    </Modal>
  );
}
