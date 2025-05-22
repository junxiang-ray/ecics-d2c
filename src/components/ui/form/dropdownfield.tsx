import { Input, Select, SelectProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import ArrowDownIcon from '@/components/icons/ArrowDownIcon';

interface DropdownFieldProps extends SelectProps {
  name: string;
  options: DropdownOption[];
  label?: string;
  className?: string;
  renderOption?: (option: DropdownOption) => React.ReactNode;
  setValue?: any;
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
  isPending: boolean;
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
              // virtual={false} // to resolve the scrolling bug for ant design exist after Ant v4.6 but may be less performant with very large option lists
              // // https://github.com/ant-design/ant-design/issues/26480
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

export const LongOptionDropdownField = ({
  name,
  label,
  options,
  disabled,
  renderOption,
  setValue,
  ...props
}: DropdownFieldProps) => {
  const { control } = useFormContext();
  const [searchTerm, setSearchTerm] = useState(
    control._formValues[name] || null,
  );
  const open = searchTerm !== null;
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions =
    searchTerm == null
      ? options
      : searchTerm == ''
        ? options
        : options.filter((opt) =>
            opt.text.toLowerCase().includes(searchTerm.toLowerCase()),
          );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSearchTerm(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selected = options.find((opt) => opt.value === field.value);

        return (
          <div
            className={props.className}
            ref={containerRef}
            style={{ position: 'relative' }}
          >
            {label && (
              <label className='text-base font-semibold'>{label}</label>
            )}
            <Input
              {...field}
              type='text'
              placeholder={`Select ${label?.toLowerCase() || ''}`}
              value={searchTerm || selected?.text || ''}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              disabled={disabled}
              status={fieldState.invalid ? 'error' : undefined}
              className='w-full rounded border px-3 py-2'
              readOnly={false}
            />

            <span
              className='absolute right-3 transform cursor-pointer pt-[10px]'
              onClick={() =>
                setSearchTerm((prev: any) => {
                  return prev == null ? '' : null;
                })
              }
            >
              <ArrowDownIcon size={20} />
            </span>

            {/* Dropdown option */}
            {open && (
              <ul
                className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border bg-white'
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <li
                      key={opt.value}
                      className='cursor-pointer px-3 py-2 hover:bg-blue-100'
                      onClick={() => {
                        if (setValue)
                          setValue(name, opt.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        field.onChange(opt.value);
                        setSearchTerm(null);
                      }}
                    >
                      {renderOption ? renderOption(opt) : opt.text}
                    </li>
                  ))
                ) : (
                  <li className='px-3 py-2 text-gray-400'>No options found</li>
                )}
              </ul>
            )}

            {fieldState.error && (
              <span className='block text-sm text-red-500'>
                {fieldState.error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export const AddOnDropDownField = ({
  options,
  selectedOption,
  handleSelectOption,
  isPending,
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
      disabled={isPending}
    />
  );
};
