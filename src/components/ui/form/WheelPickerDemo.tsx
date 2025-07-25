// import { useState, useEffect } from "react";
// import type { WheelPickerOption } from "@/components/wheel-picker";
// import { WheelPicker, WheelPickerWrapper } from "@/components/wheel-picker";
// import dayjs from "dayjs";
// import "@ncdai/react-wheel-picker/style.css";
// import useFormInstance from "antd/es/form/hooks/useFormInstance";

// const monthOptions: WheelPickerOption[] = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ].map((m, index) => ({
//   label: m,
//   value: (index + 1).toString().padStart(2, "0"),
// }));

// const dayOptions: WheelPickerOption[] = Array.from({ length: 31 }, (_, i) => ({
//   label: (i + 1).toString().padStart(2, "0"),
//   value: (i + 1).toString().padStart(2, "0"),
// }));

// const currentYear = new Date().getFullYear();
// const yearOptions: WheelPickerOption[] = Array.from({ length: 100 }, (_, i) => {
//   const year = currentYear - 50 + i;
//   return {
//     label: year.toString(),
//     value: year.toString(),
//   };
// });

// interface Props {
//   name: string;
// }

// export function WheelPickerDateDemo({ name }: Props) {
//   const form = useFormInstance();

//   const fieldValue = form.getFieldValue(name); // date string
//   const parsed = dayjs(fieldValue, "YYYY-MM-DD");

//   const [selectedMonth, setSelectedMonth] = useState(parsed.isValid() ? parsed.format("MM") : "07");
//   const [selectedDay, setSelectedDay] = useState(parsed.isValid() ? parsed.format("DD") : "01");
//   const [selectedYear, setSelectedYear] = useState(parsed.isValid() ? parsed.format("YYYY") : "2017");

//   // Cập nhật giá trị lên form khi 1 phần thay đổi
//   useEffect(() => {
//     const newDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
//     form.setFieldValue(name, newDate);
//   }, [selectedDay, selectedMonth, selectedYear]);

//   return (
//     <div className="w-full flex justify-center">
//       <WheelPickerWrapper className="w-full flex gap-2">
//         <WheelPicker
//           options={monthOptions}
//           value={selectedMonth}
//           // onChange={setSelectedMonth}
//           infinite
//         />
//         <WheelPicker
//           options={dayOptions}
//           value={selectedDay}
//           // onChange={setSelectedDay}
//           infinite
//         />
//         <WheelPicker
//           options={yearOptions}
//           value={selectedYear}
//           // onChange={setSelectedYear}
//           infinite={false}
//         />
//       </WheelPickerWrapper>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  WheelPicker,
  WheelPickerWrapper,
  WheelPickerOption,
} from '@/components/wheel-picker';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

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

interface WheelPickerDateDemoProps {
  name: string;
}

export function WheelPickerDateDemo({ name }: WheelPickerDateDemoProps) {
  const form = useFormInstance();
  const initRef = useRef(false);

  const [selectedYear, setSelectedYear] = useState('2017');
  const [selectedMonth, setSelectedMonth] = useState('07');
  const [selectedDay, setSelectedDay] = useState('01');

  const [dayOptions, setDayOptions] = useState<WheelPickerOption[]>(
    createDayOptions('2017', '07'),
  );

  // Lấy fieldValue khi component mount
  useEffect(() => {
    const fieldValue = form.getFieldValue(name);
    console.log('fieldValue', fieldValue);
    const parsed = dayjs(fieldValue);
    if (parsed.isValid()) {
      const year = parsed.format('YYYY');
      const month = parsed.format('MM');
      const day = parsed.format('DD');

      setSelectedYear(year);
      setSelectedMonth(month);
      setSelectedDay(day);
      setDayOptions(createDayOptions(year, month));
    }
  }, []);

  // Cập nhật giá trị vào form khi user chọn
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      return;
    }

    const newDate = dayjs(
      `${selectedYear}-${selectedMonth}-${selectedDay}`,
      'YYYY-MM-DD',
    ).toDate();
    const oldDate = form.getFieldValue(name);

    if (!dayjs(oldDate).isSame(newDate, 'day')) {
      form.setFieldValue(name, newDate);
    }

    // Cập nhật lại số ngày khi đổi tháng hoặc năm
    setDayOptions(createDayOptions(selectedYear, selectedMonth));
  }, [selectedYear, selectedMonth, selectedDay]);

  return (
    <div className='flex w-full justify-center'>
      <WheelPickerWrapper className='flex w-full gap-2'>
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
  );
}
