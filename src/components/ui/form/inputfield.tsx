import { Input, InputProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import MailIcon from '@/components/icons/MailIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import {
  EyeCloseIcon,
  EyeOpenIcon,
  LockIcon,
} from '@/components/icons/renewal-icons';

interface InputFieldProps extends InputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  isRenewalFlow?: boolean;
}

interface InputFieldWithIconProps extends InputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel';
  helperText?: string;
}

export const InputField = ({
  name,
  label,
  isRequired,
  isRenewalFlow,
  ...props
}: InputFieldProps) => {
  const { control, setValue } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            {label && (
              <label
                className={`${
                  isRenewalFlow ? 'text-xs font-normal text-gray-800' : ''
                }`}
              >
                {label}
                {isRequired && <span className='text-red-500'>*</span>}
              </label>
            )}
            <Input
              {...props}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              status={fieldState.invalid ? 'error' : undefined}
              className={`h-10 w-full ${isRenewalFlow ? 'font-semibold' : ''} ${fieldState.invalid ? '!border-red-500' : ''} ${props.disabled ? 'bg-gray-200' : ''}`}
              onBlur={() => {
                const trimmed = field.value?.trim();
                setValue(name, trimmed, { shouldValidate: true });
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text').trim();
                setValue(name, pastedText, { shouldValidate: true });
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' && field.value === '') {
                  e.preventDefault();
                }
              }}
            />
            {fieldState.error && (
              <span className='block text-sm text-red-500'>
                {fieldState.error.message}
              </span>
            )}
          </>
        )}
      />
    </>
  );
};

export const InputFieldWithIcon = ({
  name,
  label,
  isRequired,
  type = 'text',
  helperText,
  ...props
}: InputFieldWithIconProps) => {
  const { control, setValue } = useFormContext();

  const getIcon = () => {
    switch (type) {
      case 'email':
        return <MailIcon className='text-gray-400' size={18} />;
      case 'tel':
        return <PhoneIcon className='text-gray-400' size={18} />;
      case 'password':
        return <LockIcon className='text-gray-400' size={18} />;
      default:
        return null;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className='mb-4 flex w-full flex-col'>
          {label && (
            <label className='text-sm'>
              {label}
              {isRequired && <span className='ml-1 text-red-500'>*</span>}
            </label>
          )}
          {type === 'password' ? (
            <Input.Password
              {...props}
              {...field}
              prefix={getIcon()}
              iconRender={(visible) =>
                visible ? (
                  <EyeOpenIcon className='text-[#99A1AF]' />
                ) : (
                  <EyeCloseIcon className='text-[#99A1AF]' />
                )
              }
              status={fieldState.invalid ? 'error' : undefined}
              className={`h-10 w-full ${fieldState.invalid ? '!border-red-500' : ''} ${
                props.disabled ? 'bg-gray-200' : ''
              }`}
              onBlur={() => {
                const trimmed = field.value?.trim();
                setValue(name, trimmed, { shouldValidate: true });
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text').trim();
                setValue(name, pastedText, { shouldValidate: true });
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' && field.value === '') e.preventDefault();
              }}
            />
          ) : (
            <Input
              {...props}
              {...field}
              type={type}
              prefix={getIcon()}
              status={fieldState.invalid ? 'error' : undefined}
              className={`h-10 w-full ${fieldState.invalid ? '!border-red-500' : ''} ${
                props.disabled ? 'bg-gray-200' : ''
              }`}
              onBlur={() => {
                const trimmed = field.value?.trim();
                setValue(name, trimmed, { shouldValidate: true });
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text').trim();
                setValue(name, pastedText, { shouldValidate: true });
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' && field.value === '') e.preventDefault();
              }}
            />
          )}
          {helperText && !fieldState.error && (
            <span className='mt-1 text-sm text-gray-500'>{helperText}</span>
          )}
          {fieldState.error && (
            <span className='block text-sm text-red-500'>
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};
