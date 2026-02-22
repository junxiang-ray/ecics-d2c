import { REGEX } from '@/constants/validation.constant';
import { FORM_ITEM } from '../ChangePassword';

import { useFormContext, useWatch } from 'react-hook-form';
import PasswordRequirementItem from './PasswordRequirementItem';

// ⭐ Export validation function for use in parent component
export const validatePasswordRequirements = (
  password: string | undefined,
  confirmPassword: string | undefined,
): {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    match: boolean;
  };
} => {
  const requirements = {
    minLength: password ? password.length >= 8 : false,
    uppercase: password ? /[A-Z]/.test(password) : false,
    lowercase: password ? /[a-z]/.test(password) : false,
    number: password ? /[0-9]/.test(password) : false,
    special: password ? /[!-/:-@[-`{-~]/.test(password) : false,
    match:
      password && confirmPassword
        ? password === confirmPassword && password !== ''
        : false,
  };

  return {
    isValid: Object.values(requirements).every(Boolean),
    requirements,
  };
};

const PasswordRequirements = (): JSX.Element => {
  const { control } = useFormContext();

  const password = useWatch({ control, name: FORM_ITEM.PASSWORD_NEW });
  const confirmPassword = useWatch({
    control,
    name: FORM_ITEM.PASSWORD_CONFIRM,
  });

  const { requirements } = validatePasswordRequirements(
    password,
    confirmPassword,
  );

  return (
    <div className='space-y-2 rounded-lg bg-gray-50 p-4'>
      <p className='font-body mb-3 text-sm font-medium text-gray-700'>
        Password Requirements:
      </p>
      <div className='space-y-2'>
        <PasswordRequirementItem
          message='At least 8 characters'
          valid={requirements.minLength}
        />
        <PasswordRequirementItem
          message='One uppercase letter'
          valid={requirements.uppercase}
        />
        <PasswordRequirementItem
          message='One lowercase letter'
          valid={requirements.lowercase}
        />
        <PasswordRequirementItem
          message='One number'
          valid={requirements.number}
        />
        <PasswordRequirementItem
          message='One special character'
          valid={requirements.special}
        />
        <PasswordRequirementItem
          message='Passwords match'
          valid={requirements.match}
        />
      </div>
    </div>
  );
};

export default PasswordRequirements;
