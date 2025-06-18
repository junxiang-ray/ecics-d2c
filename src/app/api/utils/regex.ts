export const REGEX_VALUES = {
  PHONE_NUMBER: /^[89]\d{7}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DATE_OF_BIRTH: /^\d{2}-\d{2}-\d{4}$/,
};

export const REMOVE_NUMBER_AND_SPECIAL_CHAR_REGEX =
  /[0-9~!@#$%^&*()_+[\]{},.<>/?\\|;':"=\-`]/g;
