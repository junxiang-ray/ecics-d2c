import { REGEX } from '@/constants/validation.constant';
import { FORM_ITEM } from '../ChangePassword';

import { useFormContext, useWatch } from 'react-hook-form';

import PasswordRequirementItem from './PasswordRequirementItem';

const PasswordRequirements = (): JSX.Element => {
  const { control } = useFormContext();

  const password = useWatch({ control, name: FORM_ITEM.PASSWORD_NEW });
  const passwordConfirm = useWatch({
    control,
    name: FORM_ITEM.PASSWORD_CONFIRM,
  });

  const passwordRequirements = {
    minLength: password == null ? password : password.length >= 8,
    upperCharacter:
      password == null ? password : password.match(REGEX.UPPERCASE),
    lowerCharacter:
      password == null ? password : password.match(REGEX.LOWERCASE),
    numberCharacter: password == null ? password : password.match(REGEX.DIGITS),
    specialCharacter:
      password == null ? password : password.match(REGEX.SPECIAL_CHARACTER),
    passwordMatch:
      password == null || passwordConfirm == null
        ? null
        : password === passwordConfirm,
  };

  return (
    <>
      <div className='space-y-2 rounded-lg bg-gray-50 p-4'>
        <p className='mb-3 font-body text-sm font-medium text-gray-700'>
          Password Requirements:
        </p>
        <div className='space-y-2'>
          <PasswordRequirementItem
            message='At least 8 characters'
            valid={passwordRequirements.minLength}
          />
          <PasswordRequirementItem
            message='One uppercase letter'
            valid={passwordRequirements.upperCharacter}
          />
          <PasswordRequirementItem
            message='One lowercase letter'
            valid={passwordRequirements.lowerCharacter}
          />
          <PasswordRequirementItem
            message='One number'
            valid={passwordRequirements.numberCharacter}
          />
          <PasswordRequirementItem
            message='One special character'
            valid={passwordRequirements.specialCharacter}
          />
          <PasswordRequirementItem
            message='Passwords match'
            valid={passwordRequirements.passwordMatch}
          />
        </div>
      </div>
    </>
  );
};
export default PasswordRequirements;
