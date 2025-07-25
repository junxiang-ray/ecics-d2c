import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  WheelPicker,
  WheelPickerOption,
  WheelPickerWrapper,
} from '@/components/wheel-picker';

interface DatePickerFieldWheelProps {
  name: string;
  label?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  isRequired?: boolean;
  defaultPickerValue?: Dayjs;
}

const monthOptions: WheelPickerOption[] = Array.from(
  { length: 12 },
  (_, i) => ({
    label: dayjs().month(i).format('MMMM'),
    value: (i + 1).toString().padStart(2, '0'),
  }),
);

const createDayOptions = (year: string, month: string): WheelPickerOption[] => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    label: (i + 1).toString().padStart(2, '0'),
    value: (i + 1).toString().padStart(2, '0'),
  }));
};

const currentYear = new Date().getFullYear();
const yearOptions: WheelPickerOption[] = Array.from({ length: 100 }, (_, i) => {
  const year = currentYear - 50 + i;
  return { label: year.toString(), value: year.toString() };
});

export const DatePickerFieldWheel = ({
  name,
  label,
  minDate,
  maxDate,
  isRequired,
  defaultPickerValue,
}: DatePickerFieldWheelProps) => {
  const { control, getValues, setValue } = useFormContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rawValue = getValues(name);
  const initial = rawValue ? dayjs(rawValue) : null;
  const initialYear = initial?.format('YYYY') ?? '';
  const initialMonth = initial?.format('MM') ?? '';
  const initialDay = initial?.format('DD') ?? '';

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [dayOptions, setDayOptions] = useState(
    createDayOptions(initialYear, initialMonth),
  );
  const [isOpen, setIsOpen] = useState(false);

  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>(
    'down',
  );

  const formValue = getValues(name);
  const hasValue = !!formValue;
  const formattedValue = hasValue
    ? `${selectedDay}/${selectedMonth}/${selectedYear}`
    : '';

  useEffect(() => {
    if (isOpen) {
      const current = dayjs(getValues(name) || defaultPickerValue);
      setSelectedYear(current.format('YYYY'));
      setSelectedMonth(current.format('MM'));
      setSelectedDay(current.format('DD'));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDayOptions(createDayOptions(selectedYear, selectedMonth));
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const newDate = dayjs(
      `${selectedYear}-${selectedMonth}-${selectedDay}`,
      'YYYY-MM-DD',
    );
    if (newDate.isValid()) {
      setValue(name, newDate.toDate(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedYear, selectedMonth, selectedDay]);

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

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState }) => (
        <div className='relative w-full' ref={wrapperRef}>
          {label && (
            <span className='text-base font-semibold'>
              {label}
              {isRequired && <span className='text-[#C80F1E]'> *</span>}
            </span>
          )}
          <input
            readOnly
            placeholder='Select date...'
            value={formattedValue}
            onClick={() => {
              setIsOpen(true);
              handlePosition();
            }}
            className={`h-10 w-full rounded border px-3 py-2 text-left ${
              fieldState.invalid ? 'border-red-500' : 'border-gray-300'
            }`}
          />
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
                  onValueChange={setSelectedMonth}
                  infinite
                />
                <WheelPicker
                  options={dayOptions}
                  value={selectedDay}
                  onValueChange={setSelectedDay}
                  infinite
                />
                <WheelPicker
                  options={yearOptions}
                  value={selectedYear}
                  onValueChange={setSelectedYear}
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
