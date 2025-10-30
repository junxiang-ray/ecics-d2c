import { Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CalendarIcon from '@/components/icons/CalendarIcon';
import { WheelPicker, WheelPickerWrapper } from '@/components/wheel-picker';

import { useDatePickerLogic } from '@/hook/useDatePickerLogic';
import { useHandleClickOutside } from '@/hook/useHandleClickOutside';
import { useHandlePosition } from '@/hook/useHandlePosition';

interface DatePickerFieldWheelProps {
  name: string;
  label?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  isRequired?: boolean;
  defaultPickerValue?: Dayjs;
  disabled?: boolean;
  onChange?: (value: any) => void;
  placeholder?: string;
}

export const DatePickerFieldWheel = ({
  name,
  label,
  minDate,
  maxDate,
  disabled,
  isRequired,
  onChange,
  defaultPickerValue,
  placeholder,
}: DatePickerFieldWheelProps) => {
  const { control, setValue, getValues } = useFormContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { dropdownDirection, handlePosition } = useHandlePosition(
    isOpen,
    wrapperRef,
  );
  useHandleClickOutside(wrapperRef, () => setIsOpen(false));

  const rawValue = getValues(name);
  const initialValue = rawValue
    ? dayjs(rawValue)
    : (defaultPickerValue ?? minDate ?? dayjs());

  const {
    selectedYear,
    selectedMonth,
    selectedDay,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDay,
    yearOptions,
    monthOptions,
    dayOptions,
    handleDateChange,
  } = useDatePickerLogic({
    minDate,
    maxDate,
    defaultValue: initialValue,
    onChange: (newDate) => {
      setValue(name, newDate.toDate(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      onChange?.(newDate);
    },
  });

  const formattedValue = rawValue ? dayjs(rawValue).format('DD/MM/YYYY') : '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className='relative w-full' ref={wrapperRef}>
          {label && (
            <span className='text-base font-semibold'>
              {label}
              {isRequired && <span className='text-[#C80F1E]'> *</span>}
            </span>
          )}

          <div className='relative'>
            <Input
              {...field}
              readOnly
              disabled={disabled}
              placeholder={placeholder || 'Select date'}
              value={formattedValue}
              status={fieldState.invalid ? 'error' : undefined}
              onClick={() => {
                if (!disabled) {
                  setIsOpen(true);
                  handlePosition();
                }
              }}
              className={`h-10 w-full rounded border py-2 pl-3 pr-10 text-left ${
                fieldState.invalid ? 'border-red-500' : 'border-gray-300'
              } ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : ''}`}
            />
            <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
              <CalendarIcon
                size={24}
                className={
                  disabled
                    ? 'text-[rgba(0,0,0,0.25)]'
                    : 'text-[rgba(0,0,0,0.85)]'
                }
              />
            </div>
          </div>

          {isOpen && (
            <div
              className='absolute z-50 w-full rounded border bg-white shadow-lg'
              style={{
                top: dropdownDirection === 'down' ? '100%' : undefined,
                bottom: dropdownDirection === 'up' ? '100%' : undefined,
                transform:
                  dropdownDirection === 'up'
                    ? 'translateY(-4px)'
                    : 'translateY(4px)',
              }}
            >
              <WheelPickerWrapper className='flex min-h-[150px] w-full gap-2'>
                <WheelPicker
                  options={monthOptions}
                  value={selectedMonth}
                  onValueChange={(value) => {
                    setSelectedMonth(value);
                    handleDateChange(selectedYear, value, selectedDay);
                  }}
                  infinite={monthOptions.length > 12}
                />
                <WheelPicker
                  options={dayOptions}
                  value={selectedDay}
                  onValueChange={(value) => {
                    setSelectedDay(value);
                    handleDateChange(selectedYear, selectedMonth, value);
                  }}
                  infinite={dayOptions.length > 7}
                />
                <WheelPicker
                  options={yearOptions}
                  value={selectedYear}
                  onValueChange={(value) => {
                    setSelectedYear(value);
                    handleDateChange(value, selectedMonth, selectedDay);
                  }}
                  infinite={false}
                />
              </WheelPickerWrapper>
            </div>
          )}

          {fieldState.error && (
            <span className='mt-1 block text-sm text-red-500'>
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};
