import { POST } from '../v1/payment/route';

export const REGEX_VALUES = {
  PHONE_NUMBER: /^[89]\d{7}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DATE_OF_BIRTH: /^\d{2}-\d{2}-\d{4}$/,
  POSTAL_CODE: /^\d{4,8}$/,
};

//used to get text and remove special characters
export const REGEX_TEXT = /[0-9~!@#$%^&*()_+[\]{},.<>/?\\|;':"=\-`]/g;
