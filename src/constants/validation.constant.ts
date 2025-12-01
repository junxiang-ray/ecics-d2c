// Regex
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const phoneRegex = /^[89]\d{7}$/;

export const passportRegex = /^[a-zA-Z0-9]+$/;

export const REGEX = {
  UPPERCASE: /[A-Z]/g,
  LOWERCASE: /[a-z]/g,
  DIGITS: /[0-9]/g,
  SPECIAL_CHARACTER: /[!-/:-@[-`{-~]/g,
  NON_LATIN_CHARACTER: /\P{ASCII}/gu,
};
