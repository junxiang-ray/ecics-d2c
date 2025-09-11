import dayjs, { Dayjs } from 'dayjs';

export const getAgeFromDOB = (dob: string) => {
  const today = new Date();
  const birthDate = new Date(dob); // Convert the DOB string to a Date object
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if the current date is before the birthday this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// yyyy-mm-dd
export const getTodayYYYYMMDD = () => {
  return new Date().toISOString().substring(0, 10);
};

// yyyy-mm-dd
export const getOneYearLater = (date: Date) => {
  date.setFullYear(date.getFullYear() + 1);
  date.setDate(date.getDate() - 1);

  return date.toISOString().substring(0, 10);
};

// take dayjs or YYYY-MM-DD as input
// chg format to specified
export const convertDateFormat = (
  dateString: string,
  toFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY',
) => {
  const dateObj = new Date(dateString);
  let formattedDate = null;

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date format');
  }

  switch (toFormat) {
    case 'YYYY-MM-DD':
      formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
      break;
    case 'DD/MM/YYYY':
      formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${dateObj.getFullYear()}`;
      break;
    default:
      alert('unhandled date format');
      break;
  }

  return formattedDate;
};

/**
 * @param startDate instance of dayjs
 * @param years +ve to add ; -ve to minus
 * @param months +ve to add ; -ve to minus
 * @param days +ve to add ; -ve to minus
 * @returns duration from startDate in dayJS
 * @description example :
 * adjustDateInDayjs(dayjs("2025-01-15"), 0, -2, 0)
 * Output: "2024-11-15"
 * @
 */
export const adjustDateInDayjs = (
  startDate: dayjs.Dayjs | undefined,
  years?: number,
  months?: number,
  days?: number,
): dayjs.Dayjs | undefined => {
  if (startDate instanceof dayjs) {
    let adjustedDate = startDate;

    // Add or subtract years
    if (years) {
      if (years > 0) {
        adjustedDate = adjustedDate.add(years, 'year');
      } else {
        adjustedDate = adjustedDate.subtract(-years, 'year');
      }
    }

    // Add or subtract months
    if (months) {
      if (months > 0) {
        adjustedDate = adjustedDate.add(months, 'month');
      } else {
        adjustedDate = adjustedDate.subtract(-months, 'month');
      }
    }

    // Add or subtract days
    if (days) {
      if (days > 0) {
        adjustedDate = adjustedDate.add(days, 'day');
      } else {
        adjustedDate = adjustedDate.subtract(-days, 'day');
      }
    }

    return adjustedDate;
  }

  return startDate;
};

export const adjustDateInDate = (
  startDate: Date | undefined,
  years?: number,
  months?: number,
  days?: number,
): Date | undefined => {
  if (startDate instanceof Date) {
    const adjustedDate = new Date(startDate);

    // Add or subtract years
    if (years) {
      adjustedDate.setFullYear(adjustedDate.getFullYear() + years);
    }

    // Add or subtract months
    if (months) {
      adjustedDate.setMonth(adjustedDate.getMonth() + months);
    }

    // Add or subtract days
    if (days) {
      adjustedDate.setDate(adjustedDate.getDate() + days);
    }

    return adjustedDate;
  }

  return startDate;
};

// Date -> DayJS
export const dateToDayjs = (date: string | Date | undefined) =>
  date ? dayjs(date) : undefined;

// DayJS -> Date
export const dayjsToDate = (dayjsObj: dayjs.Dayjs | null | undefined) =>
  dayjsObj?.toDate() || undefined;

export const convertDateToDDMMYYYY = (date: string) => {
  if (!date) return '';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

//get only year
export const extractYear = (dateString?: string): string | null => {
  if (!dateString) return null;

  let date: Date;

  // Check format DD/MM/YYYY or DD/MM/YY
  const ddMmYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
  if (ddMmYyyyRegex.test(dateString)) {
    const [dayStr, monthStr, yearStr] = dateString.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);

    if (yearStr.length === 2) {
      year += 2000;
    }

    date = new Date(year, month, day);
  } else {
    date = new Date(dateString);
  }
  return isNaN(date.getTime()) ? null : date.getFullYear().toString();
};

export const parseCustomDate = (dateStr: string): Date | null => {
  const ddMmYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
  if (ddMmYyyyRegex.test(dateStr)) {
    const [dayStr, monthStr, yearStr] = dateStr.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);

    // Year digit 2: is defined as 19xx or 20xx
    if (yearStr.length === 2) {
      year += year < 50 ? 2000 : 1900;
    }

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  const isoDate = new Date(dateStr);
  return isNaN(isoDate.getTime()) ? null : isoDate;
};

export const formatDateToEnGb = (dateStr: string): string => {
  const date = parseCustomDate(dateStr);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const calculateDrivingExperienceFromLicences = (
  classes: Array<{
    class?: { value?: string };
    issuedate?: { value?: string };
  }>,
): number => {
  if (!Array.isArray(classes) || classes.length === 0) return 1;

  const targetClasses = ['3', '3A'];
  const validDates: Date[] = [];

  for (const cls of classes) {
    const classValue = cls.class?.value;
    const issuedateStr = cls.issuedate?.value;

    if (classValue && targetClasses.includes(classValue) && issuedateStr) {
      const parsedDate = new Date(issuedateStr);
      if (!isNaN(parsedDate.getTime())) {
        validDates.push(parsedDate);
      }
    }
  }

  if (validDates.length === 0) return 1;

  const earliestDate = validDates.reduce((min, date) =>
    date < min ? date : min,
  );

  const today = new Date();
  let years = today.getFullYear() - earliestDate.getFullYear();

  // Adjust if the "anniversary" hasn't occurred yet this year
  const hasHadAnniversaryThisYear =
    today.getMonth() > earliestDate.getMonth() ||
    (today.getMonth() === earliestDate.getMonth() &&
      today.getDate() >= earliestDate.getDate());

  if (!hasHadAnniversaryThisYear) years--;

  return years > 0 ? years : 1;
};

/**
 * Parse a custom date string that may be in formats:
 * - DD-MM-YYYY
 * - DD/MM/YYYY
 * - YYYY-MM-DD
 * Returns Date | null if invalid
 */
export const parseFlexibleDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  // DD-MM-YYYY
  const ddMmYyyyDash = /^\d{1,2}-\d{1,2}-\d{4}$/;
  if (ddMmYyyyDash.test(dateStr)) {
    const [dayStr, monthStr, yearStr] = dateStr.split('-');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const year = parseInt(yearStr, 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // DD/MM/YYYY or DD/MM/YY
  const ddMmYyyySlash = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
  if (ddMmYyyySlash.test(dateStr)) {
    const [dayStr, monthStr, yearStr] = dateStr.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);

    if (yearStr.length === 2) {
      year += year < 50 ? 2000 : 1900;
    }

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // YYYY-MM-DD (ISO-ish)
  const isoDate = new Date(dateStr);
  return isNaN(isoDate.getTime()) ? null : isoDate;
};

export const formatToDDMMYYYY = (dateStr: string): string => {
  // Format date from "DD-MM-YYYY" to "DD/MM/YYYY"
  const date = parseFlexibleDate(dateStr);
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const parseCompactDate = (dateStr: string): string => {
  //Format date from "ddMMYYYYY" to "DD/MM/YYYY"
  const compactRegex = /^\d{8}$/;
  if (!compactRegex.test(dateStr)) return '';

  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  const year = dateStr.substring(4, 8);

  return `${day}/${month}/${year}`;
};

/**
 * Calculates the coverage duration between two dates and returns a human-readable string.
 * Example outputs: "1 year, 2 months and 5 days", "3 months and 10 days", "0 day".
 *
 * @param startDate - The start date of the coverage (Dayjs object)
 * @param expiryDate - The end date of the coverage (Dayjs object)
 * @returns A string describing the duration in years, months, and days
 */
export const getCoverageDuration = (
  startDate: Dayjs,
  expiryDate: Dayjs,
): string => {
  const totalDays = expiryDate.diff(startDate, 'day');

  // Insurance logic: 364 days or more is considered as ≥ 1 year.
  if (totalDays >= 364) {
    const years = expiryDate.diff(startDate, 'year');
    const months = expiryDate.diff(startDate.add(years, 'year'), 'month');
    const days = expiryDate.diff(
      startDate.add(years, 'year').add(months, 'month'),
      'day',
    );

    // If the duration is less than 1 year (Dayjs returns 0 years), it is treated as 1 year.
    const adjYears = years === 0 ? 1 : years;

    const parts: string[] = [];
    if (adjYears) parts.push(`${adjYears} year${adjYears > 1 ? 's' : ''}`);
    if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);

    return parts.length === 1
      ? parts[0]
      : parts.length === 2
        ? parts.join(' and ')
        : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
  }

  // < 364 days, calculate normally.
  const years = expiryDate.diff(startDate, 'year');
  const months = expiryDate.diff(startDate.add(years, 'year'), 'month');
  const days = expiryDate.diff(
    startDate.add(years, 'year').add(months, 'month'),
    'day',
  );

  const parts: string[] = [];
  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);

  if (parts.length === 0) return '0 day';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(' and ');
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
};

/**
 * Parse a date string in `DD-MM-YYYY` or `D-M-YYYY` format into a JavaScript `Date` object.
 * @param {string | null | undefined} date - The date string to parse (e.g., "18-10-2026" or "1-1-2025").
 *                                           If `null` or `undefined`, the function returns `null`.
 * @returns {Date | null} - A `Date` object if the input is a valid date string, otherwise `null`.
 * @example
 * parseDMYToDate("18-10-2026"); // returns Date object for 18 Oct 2026
 * parseDMYToDate("1-1-2025");   // returns Date object for 01 Jan 2025
 * parseDMYToDate("2025-10-18"); // returns null (invalid format)
 * parseDMYToDate(null);         // returns null
 */
export const parseDMYToDate = (date?: string | null): Date | null => {
  if (!date) return null;
  const parsed = dayjs(date, ['D-M-YYYY', 'DD-MM-YYYY'], true);
  return parsed.isValid() ? parsed.toDate() : null;
};
