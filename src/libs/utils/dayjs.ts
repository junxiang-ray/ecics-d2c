import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default dayjs;

/**
 * Converts a date string from a given input format to a desired output format
 * @param dateStr Date string, e.g., "14-10-2025"
 * @param inputFormat Format of the input date string, e.g., "DD-MM-YYYY"
 * @param outputFormat Format to convert the date to, e.g., "DD/MM/YYYY"
 * @returns Formatted date string, or undefined if input is invalid
 */
export const formatDateString = (
  dateStr?: string,
  inputFormat = 'DD-MM-YYYY',
  outputFormat = 'DD/MM/YYYY',
): string | undefined => {
  if (!dateStr) return undefined;
  const parsed = dayjs(dateStr, inputFormat);
  return parsed.isValid() ? parsed.format(outputFormat) : undefined;
};
