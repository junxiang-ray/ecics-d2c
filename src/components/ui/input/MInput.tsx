import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input/Input';
import './index.scss';
import CrossMarkIcon from '@/components/icons/CrossMark';

export type ValueType =
  | string
  | number
  | bigint
  | readonly string[]
  | undefined;
export type MInputProps = Omit<InputProps, 'onChange'> & {
  onChange?: (value: ValueType) => void;
};

const MInput = ({
  value,
  onChange,
  className,
  allowClear,
  suffix,
  autoComplete = 'off',
  maxLength = 255,
  ...props
}: MInputProps) => {
  const [localValue, setLocalValue] = useState<ValueType>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  className = (className || '') + ' m-input ';
  if (allowClear && !suffix) {
    suffix = (
      <CrossMarkIcon
        size={16}
        className={`text-gray-60 text-gray-80-hover ease-all cursor-pointer ${
          localValue == '' ? 'd-none' : ''
        }`}
        onClick={() => {
          setLocalValue('');
          onChange && onChange('');
        }}
      />
    );
  }
  return (
    <Input
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
        onChange && onChange(e.target.value);
      }}
      className={className}
      suffix={suffix}
      autoComplete={autoComplete}
      maxLength={maxLength}
      {...props}
    />
  );
};
export default MInput;
