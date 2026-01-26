import { CheckCircle, User } from 'lucide-react';
import { memo } from 'react';

import {
  CustomizationData,
  InsurancePlan,
  MyInfoData,
  PersonalInfoForm,
  PromoCodeStatus,
  QuoteForm,
  SelectedAddOn,
} from '@/libs/types/homeContents';
import { cn } from '@/libs/utils/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/cardNew';
import { DateInput } from '@/components/ui/dateInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PremiumSummary } from '@/components/ui/premiumSummary';
import { Select } from '@/components/ui/select';

import { GENDER, MARITAL_STATUS } from '@/constants/home.content.constants';

interface Step2PersonalInfoProps {
  personalInfoData: PersonalInfoForm;
  updatePersonalInfoData: (
    field: keyof PersonalInfoForm,
    value: string,
  ) => void;
  personalInfoErrors: Partial<PersonalInfoForm>;
  myInfoData: MyInfoData;
  onRetrieveMyInfo: () => void;
  onNext: () => void;
  onBack: () => void;
  selectedPlan: InsurancePlan | null;
  selectedAddOns: SelectedAddOn[];
  totalPremium: number;
  promoStatus: PromoCodeStatus;
  currentStep: number;
  formData: QuoteForm;
  customizationData?: CustomizationData;
}

const Step2PersonalInfo = memo<Step2PersonalInfoProps>(
  ({
    personalInfoData,
    updatePersonalInfoData,
    personalInfoErrors,
    myInfoData,
    onRetrieveMyInfo,
    onNext,
    onBack,
    selectedPlan,
    selectedAddOns,
    totalPremium,
    promoStatus,
    currentStep,
    formData,
    customizationData,
  }) => {
    const isMyInfoRetrieved = myInfoData.isRetrieved;

    return (
      <div className='space-y-6 sm:space-y-8'>
        {/* Helper Information Section */}

        {/* Employer Information Section */}
        <Card
          className='overflow-hidden border-0 shadow-xl'
          data-section='policyholder'
        >
          <CardHeader className='from-[#02ADEF]/8 form-header-mobile border-b border-gray-100 bg-gradient-to-r via-blue-50/80 to-indigo-50/50'>
            <div className='flex items-center justify-between'>
              <div className='mb-3 flex items-center gap-4'>
                <div className='rounded-xl bg-[#02ADEF]/10 p-3'>
                  <User className='size-5 text-[#02ADEF]' />
                </div>
                <div>
                  <h2 className='form-header-title-mobile m-0 mb-1 font-bold leading-tight text-gray-800'>
                    Policyholder Information
                  </h2>
                  <p className='form-header-subtitle-mobile m-0 leading-tight text-gray-600'>
                    Your personal details as the policyholder
                  </p>
                </div>
              </div>

              {/* Desktop MyInfo Section - Positioned to the right */}
              {!isMyInfoRetrieved && (
                <div className='hidden sm:block'>
                  <Button
                    onClick={onRetrieveMyInfo}
                    disabled={myInfoData.isLoading}
                    className='font-semiboldshadow-lg flex items-center  bg-red-500 py-3 transition-all duration-300 hover:bg-red-500 hover:shadow-xl'
                  >
                    {myInfoData.isLoading ? (
                      <>
                        <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                        <span>Retrieving MyInfo...</span>
                      </>
                    ) : (
                      <>
                        {/* <Shield className='size-5 text-white' /> */}
                        {/* <span>Retrieve MyInfo with</span> */}
                        <img
                          src='/singpass-white-inline.svg'
                          alt='Singpass'
                          className='h-8 '
                        />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Desktop MyInfo Success */}
              {isMyInfoRetrieved && (
                <div className='hidden items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-2 sm:flex'>
                  <CheckCircle className='size-5 text-green-600' />
                  <div>
                    <h4 className='m-0 text-sm font-bold leading-tight text-green-800'>
                      MyInfo Retrieved Successfully
                    </h4>
                    <p className='m-0 text-xs leading-tight text-green-700'>
                      Your details have been auto-filled
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile MyInfo Section - Button only, no container */}
            {!isMyInfoRetrieved && (
              <div className='mb-4 mt-4 block sm:mt-6 sm:hidden'>
                <Button
                  onClick={onRetrieveMyInfo}
                  disabled={myInfoData.isLoading}
                  className='flex w-full items-center  bg-red-500 py-3 transition-all duration-300 hover:bg-red-500 hover:shadow-xl'
                >
                  {myInfoData.isLoading ? (
                    <>
                      <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                      <span>Retrieving MyInfo...</span>
                    </>
                  ) : (
                    <>
                      {/* <Shield className='size-5 text-white' /> */}
                      {/* <span>Retrieve MyInfo with</span> */}
                      <img
                        src='/singpass-white-inline.svg'
                        alt='Singpass'
                        className='h-8 '
                      />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Mobile MyInfo Success */}
            {isMyInfoRetrieved && (
              <div className='myinfo-card-mobile mt-4 block rounded-xl border border-green-200 bg-green-50 sm:mt-6 sm:hidden'>
                <div className='myinfo-content-mobile flex items-center'>
                  <div className='flex-shrink-0 rounded-lg bg-green-100 p-1.5 sm:p-2'>
                    <CheckCircle className='myinfo-icon-mobile text-green-600' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h4 className='myinfo-text-mobile m-0 font-bold leading-tight text-green-800'>
                      MyInfo Retrieved Successfully
                    </h4>
                    <p className='myinfo-subtext-mobile m-0 leading-tight text-green-700'>
                      Your details have been auto-filled below
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2'>
            {/* NRIC/FIN */}
            <div className='col-span-1 mb-4'>
              <Label className='w-full text-base font-semibold text-gray-700 sm:text-lg'>
                NRIC/FIN <span className='text-red-500'>*</span>
              </Label>
              <Input
                placeholder='Enter your NRIC/FIN'
                value={personalInfoData.policyHolderNricFin}
                onChange={(e) =>
                  updatePersonalInfoData('policyHolderNricFin', e.target.value)
                }
                className={cn(
                  'h-12 w-full rounded-xl border-2 bg-white px-4 text-base sm:h-14',
                  personalInfoErrors.policyHolderNricFin
                    ? 'border-red-500'
                    : 'border-gray-200 focus:border-[#02ADEF]',
                  isMyInfoRetrieved ? 'bg-green-50' : '',
                )}
                disabled={myInfoData.isLoading || isMyInfoRetrieved}
              />
              {personalInfoErrors.policyHolderNricFin && (
                <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                  <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    !
                  </span>
                  {personalInfoErrors.policyHolderNricFin}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Full Name (As per NRIC/FIN){' '}
                <span className='text-red-500'>*</span>
              </Label>
              <Input
                placeholder='Enter your full name as per NRIC/FIN'
                value={personalInfoData.policyHolderFullName}
                onChange={(e) =>
                  updatePersonalInfoData('policyHolderFullName', e.target.value)
                }
                className={cn(
                  'h-12 w-full rounded-xl border-2 bg-white px-4 text-base sm:h-14',
                  personalInfoErrors.policyHolderFullName
                    ? 'border-red-500'
                    : 'border-gray-200 focus:border-[#02ADEF]',
                  isMyInfoRetrieved ? 'bg-green-50' : '',
                )}
                disabled={myInfoData.isLoading || isMyInfoRetrieved}
              />
              {personalInfoErrors.policyHolderFullName && (
                <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                  <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    !
                  </span>
                  {personalInfoErrors.policyHolderFullName}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Date of Birth <span className='text-red-500'>*</span>
              </Label>
              <DateInput
                flowstep={2}
                value={personalInfoData.policyHolderDateOfBirth}
                onChange={(value) =>
                  updatePersonalInfoData('policyHolderDateOfBirth', value)
                }
                className={cn(
                  'h-12 w-full rounded-xl border-2 bg-white px-4 text-base sm:h-14',
                  personalInfoErrors.policyHolderDateOfBirth
                    ? 'border-red-500'
                    : 'border-gray-200 focus:border-[#02ADEF]',
                  isMyInfoRetrieved ? 'bg-green-50' : '',
                )}
                disabled={myInfoData.isLoading || isMyInfoRetrieved}
              />
              {personalInfoErrors.policyHolderDateOfBirth && (
                <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                  <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    !
                  </span>
                  {personalInfoErrors.policyHolderDateOfBirth}
                </p>
              )}
            </div>

            {/* Nationality - changed to Gender*/}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Gender <span className='text-red-500'>*</span>
              </Label>
              <Select
                options={GENDER}
                value={personalInfoData.policyHolderGender}
                onChange={(value) =>
                  updatePersonalInfoData('policyHolderGender', value)
                }
                disabled={myInfoData.isLoading || isMyInfoRetrieved}
                placeholder='Select your Gender'
                className='h-12 text-base sm:h-14'
              />
              {personalInfoErrors.policyHolderGender && (
                <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                  <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    !
                  </span>
                  {personalInfoErrors.policyHolderGender}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Marital Status <span className='text-red-500'>*</span>
              </Label>
              <Select
                options={MARITAL_STATUS}
                value={personalInfoData.policyHolderMaritalStatus}
                onChange={(value) =>
                  updatePersonalInfoData('policyHolderMaritalStatus', value)
                }
                disabled={myInfoData.isLoading || isMyInfoRetrieved}
                placeholder='Select your Marital Status'
                className='h-12 text-base sm:h-14'
              />
              {personalInfoErrors.policyHolderMaritalStatus && (
                <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                  <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    !
                  </span>
                  {personalInfoErrors.policyHolderMaritalStatus}
                </p>
              )}
            </div>
            {/* Phone Number */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Phone Number <span className='text-red-500'>*</span>
                {isMyInfoRetrieved && (
                  <span className='ml-2 text-xs font-normal text-blue-600'>
                    (You can update this)
                  </span>
                )}
              </Label>
              <Input
                type='tel'
                placeholder='Enter your phone number'
                value={personalInfoData.policyHolderMobileNumber}
                onChange={(e) =>
                  updatePersonalInfoData(
                    'policyHolderMobileNumber',
                    e.target.value,
                  )
                }
                className={cn(
                  'h-12 w-full rounded-xl border-2 bg-white px-4 text-base sm:h-14',
                  personalInfoErrors.policyHolderMobileNumber
                    ? 'border-red-500'
                    : 'border-gray-200 focus:border-[#02ADEF]',
                  isMyInfoRetrieved
                    ? 'border-blue-200 bg-blue-50 focus:border-blue-500'
                    : '',
                )}
                disabled={myInfoData.isLoading}
              />
              {personalInfoErrors.policyHolderMobileNumber && (
                <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                  <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    !
                  </span>
                  {personalInfoErrors.policyHolderMobileNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Email <span className='text-red-500'>*</span>
                {isMyInfoRetrieved && (
                  <span className='ml-2 text-xs font-normal text-blue-600'>
                    (You can update this)
                  </span>
                )}
              </Label>
              <Input
                type='email'
                placeholder='Enter your email address'
                value={personalInfoData.policyHolderEmail}
                onChange={(e) =>
                  updatePersonalInfoData('policyHolderEmail', e.target.value)
                }
                className={cn(
                  'h-12 w-full rounded-xl border-2 bg-white px-4 text-base sm:h-14',
                  personalInfoErrors.policyHolderEmail
                    ? 'border-red-500'
                    : 'border-gray-200 focus:border-[#02ADEF]',
                  isMyInfoRetrieved
                    ? 'border-blue-200 bg-blue-50 focus:border-blue-500'
                    : '',
                )}
                disabled={myInfoData.isLoading}
              />
              {personalInfoErrors.policyHolderEmail && (
                <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                  <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    !
                  </span>
                  {personalInfoErrors.policyHolderEmail}
                </p>
              )}
            </div>

            {/* Section Header: Insured Premises */}
            <div className='col-span-1 border-t border-gray-200 pt-6 sm:col-span-2'>
              <h3 className='mb-1 text-lg font-semibold text-gray-800 sm:text-xl'>
                Insured Premises
              </h3>
              <p className='text-sm text-gray-600 sm:text-base'>
                Please provide your property address details
              </p>
            </div>

            {/* Address Line 1 */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Address Line 1 <span className='text-red-500'>*</span>
              </Label>
              <Input
                placeholder='Enter address line 1'
                value={personalInfoData.addressLine1}
                onChange={(e) =>
                  updatePersonalInfoData('addressLine1', e.target.value)
                }
                className={cn(
                  'h-12 w-full rounded-xl border-2 bg-white px-4 text-base sm:h-14',
                  personalInfoErrors.addressLine1
                    ? 'border-red-500'
                    : 'border-gray-200 focus:border-[#02ADEF]',
                )}
              />
            </div>

            {/* Postal Code */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Postal Code <span className='text-red-500'>*</span>
              </Label>
              <Input
                placeholder='Enter postal code'
                value={personalInfoData.postalCode}
                onChange={(e) =>
                  updatePersonalInfoData('postalCode', e.target.value)
                }
                className={cn(
                  'h-12 w-full rounded-xl border-2 bg-white px-4 text-base sm:h-14',
                  personalInfoErrors.postalCode
                    ? 'border-red-500'
                    : 'border-gray-200 focus:border-[#02ADEF]',
                )}
              />
            </div>

            {/* Address Line 2 */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Address Line 2
              </Label>
              <Input
                placeholder='Enter address line 2 (optional)'
                value={personalInfoData.addressLine2}
                onChange={(e) =>
                  updatePersonalInfoData('addressLine2', e.target.value)
                }
                className='h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-base focus:border-[#02ADEF] sm:h-14'
              />
            </div>

            {/* Address Line 3 */}
            <div className='col-span-1 mb-4'>
              <Label className='text-base font-semibold text-gray-700 sm:text-lg'>
                Address Line 3
              </Label>
              <Input
                placeholder='Enter address line 3 (optional)'
                value={personalInfoData.addressLine3}
                onChange={(e) =>
                  updatePersonalInfoData('addressLine3', e.target.value)
                }
                className='h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-base focus:border-[#02ADEF] sm:h-14'
              />
            </div>

            {/* Checkbox: Mailing Address Different */}
            <div className='col-span-1 mt-6 sm:col-span-2'>
              <div className='flex items-center space-x-3 rounded-xl border-2 border-gray-200 bg-gray-50 p-4'>
                <input
                  type='checkbox'
                  id='mailingAddressDifferent'
                  checked={personalInfoData.mailingAddressDifferent === 'yes'}
                  onChange={(e) =>
                    updatePersonalInfoData(
                      'mailingAddressDifferent',
                      e.target.checked ? 'yes' : 'no',
                    )
                  }
                  className='h-5 w-5 rounded border-gray-300 bg-white text-[#02ADEF] focus:ring-2 focus:ring-[#02ADEF]'
                />
                <label
                  htmlFor='mailingAddressDifferent'
                  className='cursor-pointer select-none text-base font-semibold text-gray-700'
                >
                  My Insured Premises and Mailing Address is different
                </label>
              </div>
            </div>

            {/* Mailing Address Section */}
            {personalInfoData.mailingAddressDifferent === 'yes' && (
              <div className='col-span-1 sm:col-span-2'>
                <div className='rounded-xl border-2 border-blue-200 bg-blue-50/50 p-6'>
                  <h3 className='mb-4 text-lg font-semibold text-gray-800'>
                    Mailing Address
                  </h3>

                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Mailing Address Line 1 */}
                    <div className='col-span-1 mb-4'>
                      <Label className='text-base font-semibold text-gray-700'>
                        Mailing Address Line 1{' '}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        placeholder='Enter mailing address line 1'
                        value={personalInfoData.mailingAddressLine1}
                        onChange={(e) =>
                          updatePersonalInfoData(
                            'mailingAddressLine1',
                            e.target.value,
                          )
                        }
                        className={cn(
                          'mt-2 h-12 w-full rounded-xl border-2 bg-white px-4 text-base',
                          personalInfoErrors.mailingAddressLine1
                            ? 'border-red-500'
                            : 'border-gray-200 focus:border-[#02ADEF]',
                        )}
                      />
                      {personalInfoErrors.mailingAddressLine1 && (
                        <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                          <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                            !
                          </span>
                          {personalInfoErrors.mailingAddressLine1}
                        </p>
                      )}
                    </div>

                    {/* Mailing Address Line 2 */}
                    <div className='col-span-1 mb-4'>
                      <Label className='text-base font-semibold text-gray-700'>
                        Mailing Address Line 2
                      </Label>
                      <Input
                        placeholder='Enter mailing address line 2 (optional)'
                        value={personalInfoData.mailingAddressLine2}
                        onChange={(e) =>
                          updatePersonalInfoData(
                            'mailingAddressLine2',
                            e.target.value,
                          )
                        }
                        className='mt-2 h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-base focus:border-[#02ADEF]'
                      />
                    </div>

                    {/* Mailing Address Line 3 */}
                    <div className='col-span-1 mb-4'>
                      <Label className='text-base font-semibold text-gray-700'>
                        Mailing Address Line 3
                      </Label>
                      <Input
                        placeholder='Enter mailing address line 3 (optional)'
                        value={personalInfoData.mailingAddressLine3}
                        onChange={(e) =>
                          updatePersonalInfoData(
                            'mailingAddressLine3',
                            e.target.value,
                          )
                        }
                        className='mt-2 h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-base focus:border-[#02ADEF]'
                      />
                    </div>

                    {/* Mailing Postal Code */}
                    <div className='col-span-1 mb-4'>
                      <Label className='text-base font-semibold text-gray-700'>
                        Mailing Postal Code{' '}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        placeholder='Enter mailing postal code'
                        value={personalInfoData.mailingPostalCode}
                        onChange={(e) =>
                          updatePersonalInfoData(
                            'mailingPostalCode',
                            e.target.value,
                          )
                        }
                        className={cn(
                          'mt-2 h-12 w-full rounded-xl border-2 bg-white px-4 text-base',
                          personalInfoErrors.mailingPostalCode
                            ? 'border-red-500'
                            : 'border-gray-200 focus:border-[#02ADEF]',
                        )}
                      />
                      {personalInfoErrors.mailingPostalCode && (
                        <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                          <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                            !
                          </span>
                          {personalInfoErrors.mailingPostalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PayNow Section */}
            <div className='col-span-1 border-t border-gray-200 pt-6 sm:col-span-2'>
              <h3 className='mb-2 text-xl font-semibold text-gray-800'>
                PayNow Details for Claims Disbursement
              </h3>
              <p className='mb-3 text-base text-gray-600'>
                In the event of a claim, we will disburse the payout via PayNow…
              </p>
              <p className='mb-4 text-base text-gray-600'>
                If your PayNow account is registered under a different number…
              </p>

              <div className='mb-4'>
                <div className='flex items-center space-x-3 rounded-xl border-2 border-gray-200 bg-gray-50 p-4'>
                  <input
                    type='checkbox'
                    id='payNowAccountDifferent'
                    checked={personalInfoData.payNowAccountDifferent === 'yes'}
                    onChange={(e) =>
                      updatePersonalInfoData(
                        'payNowAccountDifferent',
                        e.target.checked ? 'yes' : 'no',
                      )
                    }
                    className='h-5 w-5 rounded border-gray-300 bg-white text-[#02ADEF] focus:ring-2 focus:ring-[#02ADEF]'
                    disabled={myInfoData.isLoading}
                  />
                  <label
                    htmlFor='payNowAccountDifferent'
                    className='cursor-pointer select-none text-base font-semibold text-gray-700'
                  >
                    My PayNow account is different…
                  </label>
                </div>
              </div>

              {personalInfoData.payNowAccountDifferent === 'yes' && (
                <div className='rounded-xl border-2 border-orange-200 bg-orange-50/50 p-6'>
                  <div className='max-w-md'>
                    <Label className='text-base font-semibold text-gray-700'>
                      PayNow Account (if different){' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      type='tel'
                      placeholder='Enter your PayNow mobile number'
                      value={personalInfoData.payNowAccount}
                      onChange={(e) =>
                        updatePersonalInfoData('payNowAccount', e.target.value)
                      }
                      className={cn(
                        'mt-2 h-12 w-full rounded-xl border-2 bg-white px-4 text-base',
                        personalInfoErrors.payNowAccount
                          ? 'border-red-500'
                          : 'border-gray-200 focus:border-[#02ADEF]',
                      )}
                    />
                    {personalInfoErrors.payNowAccount && (
                      <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                        <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                          !
                        </span>
                        {personalInfoErrors.payNowAccount}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* padding */}
        <div className='h-10' />

        {/* Premium Summary */}
        {selectedPlan && (
          <PremiumSummary
            disableBtn
            selectedPlan={selectedPlan}
            selectedAddOns={selectedAddOns}
            totalPremium={totalPremium}
            promoStatus={promoStatus}
            currentStep={currentStep}
            onNext={onNext}
            onBack={onBack}
            formData={formData}
            customizationData={customizationData}
          />
        )}
      </div>
    );
  },
);

Step2PersonalInfo.displayName = 'Step2PersonalInfo';

export default Step2PersonalInfo;
