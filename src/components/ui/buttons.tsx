import React, { forwardRef } from 'react';
import { Button, ButtonProps } from 'antd';

interface CustomButtonProps extends ButtonProps {}

export const PrimaryButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <Button
        type='primary'
        size='large'
        className={`${className} bg-[#00adef] px-3 text-base font-semibold hover:opacity-85`}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

export const SecondaryButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <Button
        type='default'
        size='large'
        className={`${className} border-blue-400 px-3 text-base font-semibold text-blue-400 hover:bg-blue-50`}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);
