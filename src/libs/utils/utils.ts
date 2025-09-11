import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuid } from 'uuid';

import { DropdownOption } from '@/components/ui/form/dropdownfield';

import { PlanGroupType, PRODUCT_NAME } from '@/app/api/constants/product';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ECICS_USER_INFO } from '@/constants/general.constant';

export const removeFromLocalStorage = (keys: string[]) => {
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const removeFromSessionStorage = (keys: string[]) => {
  keys.forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

export const removeAuthenticationInfoFromCache = (
  storageType: 'local' | 'session',
) => {
  if (storageType === 'session') {
    removeFromSessionStorage([ECICS_USER_INFO]);
  } else if (storageType === 'local') {
    removeFromLocalStorage([]);
  }
};

export const saveToLocalStorage = (items: Record<string, string>) => {
  Object.entries(items).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
};

export const saveToSessionStorage = (items: Record<string, string>) => {
  Object.entries(items).forEach(([key, value]) => {
    sessionStorage.setItem(key, value);
  });
};

export const generateYearOptions = (): DropdownOption[] => {
  const currentYear = new Date().getFullYear();
  const years: DropdownOption[] = [];

  for (let year = currentYear; year >= currentYear - 20; year--) {
    years.push({
      value: year.toString(),
      text: year.toString(),
    });
  }

  return years;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string | undefined | null): string => {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const generateKeyAndAttachToUrl = (key: string) => {
  const generatedKey = key || uuid();
  const url = new URL(window.location.href);
  if (!key) {
    url.searchParams.set('key', generatedKey);
    window.history.replaceState({}, '', url.toString());
  }
  return generatedKey;
};

export const calculateAge = (dob: string, today: Date = new Date()) => {
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const parsePhoneNumber = (raw: string) => {
  const cleaned = raw.replace(/\s+/g, '').trim(); // remove all spaces

  // Remove '+' if present
  let remaining = cleaned;
  let prefix = '';
  if (remaining.startsWith('+')) {
    prefix = '+';
    remaining = remaining.slice(1);
  }

  // Separate the region code (first 2 digits), the rest is nbr
  const areaCode = remaining.slice(0, 2);
  const nbr = remaining.slice(2);

  return { prefix, areaCode, nbr };
};

export const formatPromoCode = (code: string | null): string => {
  return code ? code.trim().toUpperCase() : '';
};

const formatNumberWithPrefix = (prefix: string, number: number): string => {
  const formatted = number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${prefix} ${formatted}`;
};

export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return '';
  return formatNumberWithPrefix('SGD', value);
};

export const formatCurrencyString = (input: string): string => {
  const match = input.match(/^([+-]?SGD)\s?([\d,]+)$/);
  if (!match) return input;

  const prefix = match[1];
  const numberStr = match[2].replace(/,/g, '');
  const number = parseFloat(numberStr);

  if (isNaN(number)) return input;

  return formatNumberWithPrefix(prefix, number);
};

/**
 * Returns 'Yes' if the value is true or the string 'true' (case-insensitive), otherwise returns 'No'.
 */
export const formatBooleanToYesNo = (
  value: boolean | string | undefined | null,
): string => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' ? 'Yes' : 'No';
  }
  return value ? 'Yes' : 'No';
};

export const getPaymentType = (
  productType?: string,
  isElectric?: boolean,
): ProductType | undefined => {
  if (productType === ProductType.MAID) {
    return ProductType.MAID;
  }
  if (productType === ProductType.CAR) {
    return isElectric ? ProductType.EVCAR : ProductType.CAR;
  }
  return undefined;
};

export const getPlanGroupPrefix = (
  planName: string,
  planType: PlanGroupType,
): string => {
  const mapping = {
    [PRODUCT_NAME.CAR]: [
      { keyword: 'Family NCD Builder', prefix: 'FNCD' },
      { keyword: 'Comprehensive', prefix: 'COM' },
      { keyword: 'Third Party, Fire & Theft', prefix: 'TPFT' },
      { keyword: 'Third Party Only', prefix: 'TPO' },
    ],
    [PRODUCT_NAME.MAID]: [
      { keyword: 'Classic', prefix: 'CLASS' },
      { keyword: 'Exclusive', prefix: 'EXCLU' },
      { keyword: 'Deluxe', prefix: 'DELU' },
    ],
    [PRODUCT_NAME.MOTORCYCLE]: [
      { keyword: 'Comprehensive', prefix: 'COMP' },
      { keyword: 'Third Party, Fire & Theft', prefix: 'TPFT' },
      { keyword: 'Third Party Only', prefix: 'TPO' },
    ],
  };

  const matched = mapping[planType]?.find((item) =>
    planName.includes(item.keyword),
  );
  return matched ? matched.prefix : '';
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const createPassphrase = (dob: string, nric: string): string => {
  const last5 = nric.slice(-5);
  return `${dob}${last5}`;
};

const ALLOWED_EXTERNAL_ORIGINS =
  process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_HOSTS?.split(',').map((h) =>
    h.trim(),
  ) ?? [];

export function isSafePaymentUrl(savedUrl: string | null): boolean {
  if (!savedUrl) return false;

  try {
    const url = new URL(savedUrl);
    // Check origin (protocol + hostname + optional port)
    return ALLOWED_EXTERNAL_ORIGINS.includes(url.origin);
  } catch (err) {
    console.warn('Invalid redirect URL:', savedUrl, err);
    return false;
  }
}
