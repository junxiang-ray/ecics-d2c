export function validateNRIC(params: any[]): boolean {
  if (!params || !params[0] || typeof params[0] !== 'string') return false;
  const nricInput = params[0].toUpperCase();
  if (!nricInput || nricInput.length !== 9) return false;
  if (nricInput.includes(' ')) return false;

  const chars = nricInput.split('');
  const first = chars.shift();
  const last = chars.pop();

  // Ensure first and last are defined
  if (!first || !last) return false;

  // Multiply each digit in the remaining characters
  const multipliedDigits = [
    Number(chars[0]) * 2,
    Number(chars[1]) * 7,
    Number(chars[2]) * 6,
    Number(chars[3]) * 5,
    Number(chars[4]) * 4,
    Number(chars[5]) * 3,
    Number(chars[6]) * 2,
  ];

  // Sum up the multiplied digits
  const sum = multipliedDigits.reduce((a, v) => a + v, 0);

  // Calculate offset and checksum index
  const offset = first === 'T' || first === 'G' ? 4 : first === 'M' ? 3 : 0;
  let index = (offset + sum) % 11;
  if (first === 'M') index = 10 - index;

  let checksum;
  const st = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  const fg = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
  const m = ['K', 'L', 'J', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X'];

  switch (first) {
    case 'S':
    case 'T':
      checksum = st[index];
      break;
    case 'F':
    case 'G':
      checksum = fg[index];
      break;
    case 'M':
      checksum = m[index];
      break;
    default:
      // This should never happen, log variables
      console.error('Invalid checksum');
  }
  return last === checksum;
}

/**
 * Validate Singapore Vehicle Registration Number (v1 and v2)
 *
 * @param carRegNoInput - The vehicle registration number as a string.
 *                        Examples: "E3553A", "SBS9889U", "SG2017C".
 *                        Can be null; in that case, the function returns true.
 * @returns boolean - true if the registration number is valid according to LTA checksum rules, false otherwise.
 */
export function sgCarRegNoValidator(carRegNoInput: string | null): boolean {
  // Return true if input is null or empty (optional: treat as valid)
  if (!carRegNoInput) return true;

  // Registration number should not contain spaces
  if (carRegNoInput.includes(' ')) return false;

  // Weight array used for checksum calculation (2 letters + 4 digits)
  const weightArr = [9, 4, 5, 4, 3, 2];

  // Checksum reference table (19 letters) according to LTA Singapore rules
  const cpLetter = [
    'A',
    'Z',
    'Y',
    'X',
    'U',
    'T',
    'S',
    'R',
    'P',
    'M',
    'L',
    'K',
    'J',
    'H',
    'G',
    'E',
    'D',
    'C',
    'B',
  ];

  // Regex to extract:
  // - 1 to 3 prefix letters
  // - 1 to 4 digits
  // - 1 checksum letter at the end
  const carPlateRegex = /^([A-Z]{1,3})(\d{1,4})([A-Z])$/;

  // Convert to uppercase for consistency
  const carRegNo = carRegNoInput.toUpperCase();

  // Valid length range: at least 2 characters, at most 9 characters
  if (carRegNo.length < 2 || carRegNo.length > 9) return false;

  // Extract prefix letters, number digits, and checksum letter using regex
  const cpArr = carRegNo.match(carPlateRegex);
  if (!cpArr) return false;

  let cpAlphabet: string = cpArr[1]; // Prefix letters
  const cpNumber: string = cpArr[2].padStart(4, '0'); // Pad digits to 4 characters (e.g., '12' -> '0012')
  const cpChkSum: string = cpArr[3]; // Last checksum letter

  // Handle prefix letters for checksum calculation:
  if (cpAlphabet.length === 3) {
    // For 3-letter prefix, use the last 2 letters
    cpAlphabet = cpAlphabet.substring(1);
  } else if (cpAlphabet.length === 1) {
    // For 1-letter prefix, prepend a "0" placeholder ('@' => charCode 64)
    cpAlphabet = '@' + cpAlphabet;
  }

  // Calculate weighted sum
  let sumApbWeight =
    (cpAlphabet.charCodeAt(0) - 64) * weightArr[0] +
    (cpAlphabet.charCodeAt(1) - 64) * weightArr[1];

  // Add weighted digits
  for (let i = 0; i < cpNumber.length; i++) {
    sumApbWeight += parseInt(cpNumber[i], 10) * weightArr[i + 2];
  }

  // Calculate checksum index by modulo 19
  const letterIndex = sumApbWeight % 19;

  // Compare calculated checksum letter with the actual one
  return cpLetter[letterIndex] === cpChkSum;
}

export const finValidator = (finInput: string | null | undefined): boolean => {
  if (!finInput) return true;
  if (finInput.includes(' ')) return false;
  const fin = finInput.toUpperCase();
  if (fin.length !== 9) return false;

  const chars = fin.split('');
  const first = chars.shift();
  const last = chars.pop();

  if (!first || !last) return false;

  const weights = [2, 7, 6, 5, 4, 3, 2];
  const digits = chars.map((c, i) => Number(c) * weights[i]);
  const sum = digits.reduce((a, v) => a + v, 0);

  const offset = first === 'G' ? 4 : first === 'M' ? 3 : 0;
  let index = (offset + sum) % 11;
  if (first === 'M') index = 10 - index;

  const fg = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
  const m = ['K', 'L', 'J', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X'];

  let checksum = '';
  if (first === 'F' || first === 'G') checksum = fg[index];
  else if (first === 'M') checksum = m[index];
  else return false;

  return last === checksum;
};
