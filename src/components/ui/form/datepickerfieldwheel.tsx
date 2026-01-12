import { Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CalendarIcon from '@/components/icons/CalendarIcon';
import {
  WheelPicker,
  WheelPickerOption,
  WheelPickerWrapper,
} from '@/components/wheel-picker';

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

const createYearOptions = (
  minDate?: Dayjs,
  maxDate?: Dayjs,
): WheelPickerOption[] => {
  const currentYear = new Date().getFullYear();
  const startYear = minDate ? minDate.year() : currentYear - 50;
  const endYear = maxDate ? maxDate.year() : currentYear + 50;

  return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return { label: year.toString(), value: year.toString() };
  });
};

const createMonthOptions = (year: string, minDate?: Dayjs, maxDate?: Dayjs) => {
  const options: WheelPickerOption[] = [];
  for (let i = 1; i <= 12; i++) {
    const monthStr = i.toString().padStart(2, '0');
    const date = dayjs(`${year}-${monthStr}-01`);
    if (
      (minDate && date.endOf('month').isBefore(minDate, 'day')) ||
      (maxDate && date.startOf('month').isAfter(maxDate, 'day'))
    )
      continue;

    options.push({ label: date.format('MMMM'), value: monthStr });
  }
  return options;
};

const createDayOptions = (
  year: string,
  month: string,
  minDate?: Dayjs,
  maxDate?: Dayjs,
) => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  const options: WheelPickerOption[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = i.toString().padStart(2, '0');
    const date = dayjs(`${year}-${month}-${dayStr}`);
    if (
      (minDate && date.isBefore(minDate, 'day')) ||
      (maxDate && date.isAfter(maxDate, 'day'))
    )
      continue;

    options.push({ label: dayStr, value: dayStr });
  }
  return options;
};

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
  const { control, getValues, setValue } = useFormContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { dropdownDirection, handlePosition } = useHandlePosition(
    isOpen,
    wrapperRef,
  );

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [yearOptions, setYearOptions] = useState<WheelPickerOption[]>([]);
  const [monthOptions, setMonthOptions] = useState<WheelPickerOption[]>([]);
  const [dayOptions, setDayOptions] = useState<WheelPickerOption[]>([]);

  // Initialize yearOptions
  useEffect(() => {
    setYearOptions(createYearOptions(minDate, maxDate));
  }, [minDate, maxDate]);

  // Close when disabled
  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  // Click outside to close
  useHandleClickOutside(wrapperRef, () => setIsOpen(false));

  // Initialize picker values when opening
  const initializePicker = () => {
    const rawValue = getValues(name);
    const current = dayjs(
      rawValue || defaultPickerValue || minDate || new Date(),
    );

    const validDate = (() => {
      if (minDate && current.isBefore(minDate, 'day')) return minDate;
      if (maxDate && current.isAfter(maxDate, 'day')) return maxDate;
      return current;
    })();

    updateDate(
      validDate.format('YYYY'),
      validDate.format('MM'),
      validDate.format('DD'),
    );
  };

  const updateDate = (year: string, month: string, day: string) => {
    const yOptions = createYearOptions(minDate, maxDate);
    const mOptions = createMonthOptions(year, minDate, maxDate);
    const validMonth = mOptions.some((m) => m.value === month)
      ? month
      : mOptions[0]?.value || '';
    const dOptions = createDayOptions(year, validMonth, minDate, maxDate);
    const validDay = dOptions.some((d) => d.value === day)
      ? day
      : dOptions[dOptions.length - 1]?.value || '';

    setYearOptions(yOptions);
    setMonthOptions(mOptions);
    setDayOptions(dOptions);
    setSelectedYear(year);
    setSelectedMonth(validMonth);
    setSelectedDay(validDay);

    const newDate = dayjs(`${year}-${validMonth}-${validDay}`, 'YYYY-MM-DD');
    if (newDate.isValid()) {
      setValue(name, newDate.toDate(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      onChange?.(newDate);
    }
  };

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
              value={field.value ? dayjs(field.value).format('DD/MM/YYYY') : ''}
              status={fieldState.invalid ? 'error' : undefined}
              onClick={() => {
                if (disabled) return;
                setIsOpen((prev) => !prev);
                if (!isOpen) {
                  handlePosition();
                  initializePicker();
                }
              }}
              className={`h-10 w-full rounded border py-2 pl-3 pr-10 text-left ${fieldState.invalid ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : ''}`}
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

          {isOpen &&
            yearOptions.length &&
            monthOptions.length &&
            dayOptions.length && (
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
                    onValueChange={(value) =>
                      updateDate(selectedYear, value, selectedDay)
                    }
                    infinite={monthOptions.length >= 12}
                  />
                  <WheelPicker
                    options={dayOptions}
                    value={selectedDay}
                    onValueChange={(value) =>
                      updateDate(selectedYear, selectedMonth, value)
                    }
                    infinite={dayOptions.length >= 7}
                  />
                  <WheelPicker
                    options={yearOptions}
                    value={selectedYear}
                    onValueChange={(value) =>
                      updateDate(value, selectedMonth, selectedDay)
                    }
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
