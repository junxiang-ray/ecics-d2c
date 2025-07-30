import { Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CalendarIcon from '@/components/icons/CalendarIcon';
import {
  WheelPicker,
  WheelPickerOption,
  WheelPickerWrapper,
} from '@/components/wheel-picker';
import { useHandleClickOutside } from '@/hook/useHandleClickOutside';

interface DatePickerFieldWheelProps {
  name: string;
  label?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  isRequired?: boolean;
  defaultPickerValue?: Dayjs;
  disabled?: boolean;
  onChange?: (value: any) => void;
  disabledDate?: (current: Dayjs) => boolean;
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

const createMonthOptions = (
  selectedYear: string,
  minDate?: Dayjs,
  maxDate?: Dayjs,
): WheelPickerOption[] => {
  const options: (WheelPickerOption | null)[] = Array.from(
    { length: 12 },
    (_, i) => {
      const month = i + 1;
      const date = dayjs(
        `${selectedYear}-${month.toString().padStart(2, '0')}-01`,
      );
      if (
        (minDate && date.endOf('month').isBefore(minDate, 'day')) ||
        (maxDate && date.startOf('month').isAfter(maxDate, 'day'))
      ) {
        return null;
      }

      return {
        label: date.format('MMMM'),
        value: month.toString().padStart(2, '0'),
      };
    },
  );

  return options.filter((o): o is WheelPickerOption => o !== null);
};

const createDayOptions = (
  year: string,
  month: string,
  minDate?: Dayjs,
  maxDate?: Dayjs,
  disabledDate?: (current: Dayjs) => boolean,
): WheelPickerOption[] => {
  const options: (WheelPickerOption | null)[] = Array.from(
    { length: dayjs(`${year}-${month}-01`).daysInMonth() },
    (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      const date = dayjs(`${year}-${month}-${day}`);

      if (
        (minDate && date.isBefore(minDate, 'day')) ||
        (maxDate && date.isAfter(maxDate, 'day')) ||
        (disabledDate && disabledDate(date))
      ) {
        return null;
      }

      return {
        label: day,
        value: day,
      };
    },
  );

  return options.filter(
    (option): option is WheelPickerOption => option !== null,
  );
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
  disabledDate,
  placeholder,
}: DatePickerFieldWheelProps) => {
  const { control, getValues, setValue } = useFormContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rawValue = getValues(name);

  const initial = useMemo(() => {
    if (rawValue) return dayjs(rawValue);
    return null;
  }, [rawValue]);

  const initialYear = initial?.format('YYYY') ?? '';
  const initialMonth = initial?.format('MM') ?? '';
  const initialDay = initial?.format('DD') ?? '';

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);

  const [dayOptions, setDayOptions] = useState<WheelPickerOption[]>([]);
  const [monthOptions, setMonthOptions] = useState<WheelPickerOption[]>([]);
  const [yearOptions, setYearOptions] = useState<WheelPickerOption[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>(
    'down',
  );

  const formValue = getValues(name);
  const formattedValue = formValue ? dayjs(formValue).format('DD/MM/YYYY') : '';

  useEffect(() => {
    if (isOpen) {
      const current = dayjs(
        getValues(name) || defaultPickerValue || minDate || new Date(),
      );

      const validDate = (() => {
        if (minDate && current.isBefore(minDate, 'day')) return minDate;
        if (maxDate && current.isAfter(maxDate, 'day')) return maxDate;
        return current;
      })();

      setSelectedYear(validDate.format('YYYY'));
      setSelectedMonth(validDate.format('MM'));
      setSelectedDay(validDate.format('DD'));
    }
  }, [isOpen]);

  useHandleClickOutside(wrapperRef, () => setIsOpen(false));

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      setDayOptions(
        createDayOptions(
          selectedYear,
          selectedMonth,
          minDate,
          maxDate,
          disabledDate,
        ),
      );
    } else {
      setDayOptions([]);
    }
  }, [selectedMonth, selectedYear, minDate, maxDate, disabledDate]);

  useEffect(() => {
    if (selectedYear) {
      setMonthOptions(createMonthOptions(selectedYear, minDate, maxDate));
    } else {
      setMonthOptions([]);
    }
  }, [selectedYear, minDate, maxDate]);

  useEffect(() => {
    setYearOptions(createYearOptions(minDate, maxDate));
  }, [minDate, maxDate]);

  const handleDateChange = (year: string, month: string, day: string) => {
    const newDate = dayjs(`${year}-${month}-${day}`, 'YYYY-MM-DD');
    if (newDate.isValid()) {
      setValue(name, newDate.toDate(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      onChange?.(newDate);
    }
  };

  const handlePosition = useCallback(() => {
    if (!isOpen || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const newDirection =
      spaceBelow < 200 && spaceAbove > spaceBelow ? 'up' : 'down';
    setDropdownDirection(newDirection);
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('scroll', handlePosition, true);
    window.addEventListener('resize', handlePosition);
    return () => {
      window.removeEventListener('scroll', handlePosition, true);
      window.removeEventListener('resize', handlePosition);
    };
  }, [handlePosition]);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

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
              status={fieldState.invalid ? 'error' : undefined}
              readOnly
              disabled={disabled}
              placeholder={placeholder || 'Select date'}
              value={formattedValue}
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
          {isOpen &&
            yearOptions.length > 0 &&
            monthOptions.length > 0 &&
            dayOptions.length > 0 && (
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
                    infinite
                  />
                  <WheelPicker
                    options={dayOptions}
                    value={selectedDay}
                    onValueChange={(value) => {
                      setSelectedDay(value);
                      handleDateChange(selectedYear, selectedMonth, value);
                    }}
                    infinite
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
