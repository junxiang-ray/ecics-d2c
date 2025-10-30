import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

import { WheelPickerOption } from '@/components/wheel-picker';

export const createYearOptions = (
  minDate?: Dayjs,
  maxDate?: Dayjs,
): WheelPickerOption[] => {
  const currentYear = new Date().getFullYear();
  const startYear = minDate ? minDate.year() : currentYear - 50;
  const endYear = maxDate ? maxDate.year() : currentYear + 50;

  return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return {
      label: year.toString(),
      value: year.toString(),
    } as WheelPickerOption;
  });
};

export const createMonthOptions = (
  selectedYear: string,
  minDate?: Dayjs,
  maxDate?: Dayjs,
): WheelPickerOption[] => {
  const options = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const date = dayjs(
      `${selectedYear}-${month.toString().padStart(2, '0')}-01`,
    );
    if (
      (minDate && date.endOf('month').isBefore(minDate, 'day')) ||
      (maxDate && date.startOf('month').isAfter(maxDate, 'day'))
    )
      return null;

    return {
      label: date.format('MMMM'),
      value: month.toString().padStart(2, '0'),
    } as WheelPickerOption;
  });

  return options.filter(Boolean) as WheelPickerOption[];
};

export const createDayOptions = (
  year: string,
  month: string,
  minDate?: Dayjs,
  maxDate?: Dayjs,
): WheelPickerOption[] => {
  const options = Array.from(
    { length: dayjs(`${year}-${month}-01`).daysInMonth() },
    (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      const date = dayjs(`${year}-${month}-${day}`);

      if (
        (minDate && date.isBefore(minDate, 'day')) ||
        (maxDate && date.isAfter(maxDate, 'day'))
      )
        return null;

      return { label: day, value: day } as WheelPickerOption;
    },
  );

  return options.filter(Boolean) as WheelPickerOption[];
};

export const useDatePickerLogic = (params: {
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  defaultValue?: dayjs.Dayjs;
  onChange?: (date: dayjs.Dayjs) => void;
}) => {
  const { minDate, maxDate, defaultValue, onChange } = params;

  const [selectedYear, setSelectedYear] = useState(
    defaultValue?.format('YYYY') ?? '',
  );
  const [selectedMonth, setSelectedMonth] = useState(
    defaultValue?.format('MM') ?? '',
  );
  const [selectedDay, setSelectedDay] = useState(
    defaultValue?.format('DD') ?? '',
  );

  // Create options based on current values
  const yearOptions = useMemo(
    () => createYearOptions(minDate, maxDate),
    [minDate, maxDate],
  );

  const monthOptions = useMemo(
    () =>
      selectedYear ? createMonthOptions(selectedYear, minDate, maxDate) : [],
    [selectedYear, minDate, maxDate],
  );

  const dayOptions = useMemo(
    () =>
      selectedYear && selectedMonth
        ? createDayOptions(selectedYear, selectedMonth, minDate, maxDate)
        : [],
    [selectedYear, selectedMonth, minDate, maxDate],
  );

  const handleDateChange = (y: string, m: string, d: string) => {
    const newDate = dayjs(`${y}-${m}-${d}`, 'YYYY-MM-DD');
    if (newDate.isValid()) {
      onChange?.(newDate);
    }
  };

  return {
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
  };
};
