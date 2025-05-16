import { Select, SelectProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import ArrowDownIcon from '@/components/icons/ArrowDownIcon';

interface DropdownFieldProps extends SelectProps {
  name: string;
  options: DropdownOption[];
  label?: string;
  className?: string;
  renderOption?: (option: DropdownOption) => React.ReactNode;
}

export interface DropdownOption {
  value: string | number;
  text: string;
}

interface OptionType {
  value: string;
  label: JSX.Element;
}

interface AddOnDropDownFieldProps {
  options: OptionType[];
  selectedOption: string;
  handleSelectOption: (value: string) => void;
}

export const DropdownField = ({
  name,
  label,
  options,
  disabled,
  className,
  renderOption,
  ...props
}: DropdownFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            {label && <span className='text-base font-semibold'>{label}</span>}
            <Select
              {...props}
              {...field}
              value={field.value}
              onChange={(value, option) => {
                field.onChange(value);
                props.onChange?.(value, option);
              }}
              disabled={disabled}
              optionFilterProp='children'
              status={fieldState.invalid ? 'error' : ''}
              className={`custom-select h-10 w-full ${fieldState.invalid ? '!border-red-500' : ''}`}
              suffixIcon={
                <ArrowDownIcon
                  size={20}
                  className={
                    disabled
                      ? 'text-[rgba(0,0,0,0.25)]'
                      : 'text-[rgba(0,0,0,0.85)]'
                  }
                />
              }
              placement='bottomRight'
              dropdownStyle={{
                maxWidth: '100vw',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
              virtual={false} // to resolve the scrolling bug for ant design exist after Ant v4.6 but may be less performant with very large option lists
              // https://github.com/ant-design/ant-design/issues/26480
            >
              {options.map((option: DropdownOption) => (
                <Select.Option key={option.value} value={option.value}>
                  {renderOption ? renderOption(option) : option.text}
                </Select.Option>
              ))}
            </Select>
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

export const AddOnDropDownField = ({
  options,
  selectedOption,
  handleSelectOption,
}: AddOnDropDownFieldProps) => {
  return (
    <Select
      style={{ width: 120 }}
      className='[&_.ant-select-selector]:border-0.5 w-28 [&_.ant-select-selector]:border-[#00ADEF]'
      options={options}
      value={selectedOption}
      placeholder='Select'
      onChange={(value) => handleSelectOption(value)}
      placement='bottomRight'
      dropdownStyle={{
        minWidth: 112,
        width: 'fit-content',
        maxWidth: '100vw',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
    />
  );
};
