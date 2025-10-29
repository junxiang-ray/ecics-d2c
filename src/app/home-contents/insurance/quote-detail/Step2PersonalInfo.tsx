import { memo } from 'react';
import { User, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/cardNew';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { DateInput } from '@/components/ui/dateInput';
import { cn } from '@/libs/utils/utils';
import {
  PersonalInfoForm,
  InsurancePlan,
  SelectedAddOn,
  PromoCodeStatus,
  MyInfoData,
  QuoteForm,
  CustomizationData,
} from '@/libs/types/homeContents';
import { NATIONALITIES } from '@/constants/home.content.constants';
import { PremiumSummary } from '@/components/ui/premiumSummary';

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
              <div className='form-header-content-mobile flex items-center'>
                <div className='form-header-icon-mobile rounded-xl bg-[#02ADEF]/10'>
                  <User className='form-header-icon-size-mobile text-[#02ADEF]' />
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
                    className='flex items-center gap-3 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-red-700 hover:shadow-xl'
                  >
                    {myInfoData.isLoading ? (
                      <>
                        <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                        <span>Retrieving MyInfo...</span>
                      </>
                    ) : (
                      <>
                        <Shield className='size-5 text-white' />
                        <span>Retrieve MyInfo with</span>
                        <img
                          src='/singpass.svg'
                          alt='Singpass'
                          className='h-4 w-auto'
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
              <div className='mt-4 block sm:mt-6 sm:hidden'>
                <Button
                  onClick={onRetrieveMyInfo}
                  disabled={myInfoData.isLoading}
                  className='myinfo-button-mobile w-full rounded-xl bg-red-600 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-red-700 hover:shadow-xl sm:w-auto'
                >
                  {myInfoData.isLoading ? (
                    <span className='flex w-full items-center justify-center gap-1.5 px-1 sm:gap-2'>
                      <div className='h-3 w-3 flex-shrink-0 animate-spin rounded-full border-b-2 border-white sm:h-4 sm:w-4'></div>
                      <span
                        className='truncate text-sm font-medium sm:text-base'
                        style={{ fontSize: '14px' }}
                      >
                        Retrieving MyInfo...
                      </span>
                    </span>
                  ) : (
                    <span className='flex w-full items-center justify-center gap-1 px-1 sm:gap-1.5'>
                      <span
                        className='whitespace-nowrap text-sm font-medium sm:text-base'
                        style={{ fontSize: '14px' }}
                      >
                        Retrieve MyInfo with
                      </span>
                      <img
                        src='/singpass.svg'
                        alt='Singpass'
                        className='ml-0.5 w-auto flex-shrink-0'
                        style={{ height: '12px' }}
                      />
                    </span>
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
          <CardContent className='form-header-mobile form-field-spacing-mobile'>
            {/* Mobile Layout - Single Column */}
            <div className='block space-y-6 sm:hidden'>
              {/* NRIC/FIN */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
                  NRIC/FIN <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Enter your NRIC/FIN'
                  value={personalInfoData.policyHolderNricFin}
                  onChange={(e) =>
                    updatePersonalInfoData(
                      'policyHolderNricFin',
                      e.target.value,
                    )
                  }
                  className={cn(
                    'form-input-mobile rounded-xl border-2 bg-white',
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

              {/* Full Name (As per NRIC/FIN) */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
                  Full Name (As per NRIC/FIN){' '}
                  <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Enter your full name as per NRIC/FIN'
                  value={personalInfoData.policyHolderFullName}
                  onChange={(e) =>
                    updatePersonalInfoData(
                      'policyHolderFullName',
                      e.target.value,
                    )
                  }
                  className={cn(
                    'form-input-mobile rounded-xl border-2 bg-white',
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
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
                  Date of Birth <span className='text-red-500'>*</span>
                </Label>
                <DateInput
                  value={personalInfoData.policyHolderDateOfBirth}
                  onChange={(value) =>
                    updatePersonalInfoData('policyHolderDateOfBirth', value)
                  }
                  className={cn(
                    'form-input-mobile rounded-xl border-2 bg-white',
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

              {/* Nationality */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
                  Nationality <span className='text-red-500'>*</span>
                </Label>
                <Select
                  options={NATIONALITIES} // readonly string[] array
                  defaultValue={personalInfoData.policyHolderNationality}
                  onChange={(value) =>
                    updatePersonalInfoData('policyHolderNationality', value)
                  }
                  disabled={myInfoData.isLoading || isMyInfoRetrieved}
                  placeholder='Select your nationality'
                  className={cn(
                    'form-input-mobile rounded-xl border-2 bg-white text-base',
                    personalInfoErrors.policyHolderNationality
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-[#02ADEF]',
                    isMyInfoRetrieved ? 'bg-green-50' : '',
                  )}
                />

                {personalInfoErrors.policyHolderNationality && (
                  <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                    <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                      !
                    </span>
                    {personalInfoErrors.policyHolderNationality}
                  </p>
                )}
              </div>

              {/* Phone Number - REMAINS EDITABLE */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
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
                    'form-input-mobile rounded-xl border-2 bg-white',
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

              {/* Email - REMAINS EDITABLE */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
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
                    'form-input-mobile rounded-xl border-2 bg-white',
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

              {/* Insured Premises Section Header - Mobile */}
              <div className='border-t border-gray-200 pt-4'>
                <h3 className='mb-1 text-lg font-semibold text-gray-800'>
                  Insured Premises
                </h3>
                <p className='text-sm text-gray-600'>
                  Please provide your property address details
                </p>
              </div>

              {/* Address Line 1 */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
                  Address Line 1 <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Enter address line 1'
                  value={personalInfoData.addressLine1}
                  onChange={(e) =>
                    updatePersonalInfoData('addressLine1', e.target.value)
                  }
                  className={cn(
                    'form-input-mobile rounded-xl border-2 bg-white',
                    personalInfoErrors.addressLine1
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-[#02ADEF]',
                    isMyInfoRetrieved ? 'bg-green-50' : '',
                  )}
                  disabled={myInfoData.isLoading || isMyInfoRetrieved}
                />
                {personalInfoErrors.addressLine1 && (
                  <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                    <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                      !
                    </span>
                    {personalInfoErrors.addressLine1}
                  </p>
                )}
              </div>

              {/* Address Line 2 */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
                  Address Line 2
                </Label>
                <Input
                  placeholder='Enter address line 2 (optional)'
                  value={personalInfoData.addressLine2}
                  onChange={(e) =>
                    updatePersonalInfoData('addressLine2', e.target.value)
                  }
                  className={cn(
                    'form-input-mobile rounded-xl border-2 bg-white',
                    'border-gray-200 focus:border-[#02ADEF]',
                    isMyInfoRetrieved ? 'bg-green-50' : '',
                  )}
                  disabled={myInfoData.isLoading || isMyInfoRetrieved}
                />
              </div>

              {/* Address Line 3 */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
                  Address Line 3
                </Label>
                <Input
                  placeholder='Enter address line 3 (optional)'
                  value={personalInfoData.addressLine3}
                  onChange={(e) =>
                    updatePersonalInfoData('addressLine3', e.target.value)
                  }
                  className={cn(
                    'form-input-mobile rounded-xl border-2 bg-white',
                    'border-gray-200 focus:border-[#02ADEF]',
                    isMyInfoRetrieved ? 'bg-green-50' : '',
                  )}
                  disabled={myInfoData.isLoading || isMyInfoRetrieved}
                />
              </div>

              {/* Postal Code */}
              <div>
                <Label className='form-label-mobile font-semibold text-gray-700'>
                  Postal Code <span className='text-red-500'>*</span>
                </Label>
                <Input
                  placeholder='Enter postal code'
                  value={personalInfoData.postalCode}
                  onChange={(e) =>
                    updatePersonalInfoData('postalCode', e.target.value)
                  }
                  className={cn(
                    'form-input-mobile rounded-xl border-2 bg-white',
                    personalInfoErrors.postalCode
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-[#02ADEF]',
                    isMyInfoRetrieved ? 'bg-green-50' : '',
                  )}
                  disabled={myInfoData.isLoading || isMyInfoRetrieved}
                />
                {personalInfoErrors.postalCode && (
                  <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                    <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                      !
                    </span>
                    {personalInfoErrors.postalCode}
                  </p>
                )}
              </div>

              {/* Mailing Address Checkbox - Mobile */}
              <div className='mt-2'>
                <div className='flex items-center space-x-2 rounded-xl border-2 border-gray-200 bg-gray-50 p-3'>
                  <input
                    type='checkbox'
                    id='mailingAddressDifferentMobile'
                    checked={personalInfoData.mailingAddressDifferent === 'yes'}
                    onChange={(e) =>
                      updatePersonalInfoData(
                        'mailingAddressDifferent',
                        e.target.checked ? 'yes' : 'no',
                      )
                    }
                    className='h-5 w-5 flex-shrink-0 rounded border-gray-300 bg-white text-[#02ADEF] focus:ring-2 focus:ring-[#02ADEF]'
                    disabled={myInfoData.isLoading}
                  />
                  <label
                    htmlFor='mailingAddressDifferentMobile'
                    className='cursor-pointer select-none text-sm font-semibold text-gray-700'
                  >
                    My Insured Premises and Mailing Address is different
                  </label>
                </div>
              </div>

              {/* Mailing Address Section - Mobile Conditional */}
              {personalInfoData.mailingAddressDifferent === 'yes' && (
                <div className='space-y-6'>
                  <div className='rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4'>
                    <h3 className='mb-4 text-base font-semibold text-gray-800'>
                      Mailing Address
                    </h3>

                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      {/* Mailing Address Line 1 */}
                      <div>
                        <Label className='form-label-mobile font-semibold text-gray-700'>
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
                            'form-input-mobile rounded-xl border-2 bg-white',
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
                      <div>
                        <Label className='form-label-mobile font-semibold text-gray-700'>
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
                          className='form-input-mobile rounded-xl border-2 border-gray-200 bg-white focus:border-[#02ADEF]'
                        />
                      </div>

                      {/* Mailing Address Line 3 */}
                      <div>
                        <Label className='form-label-mobile font-semibold text-gray-700'>
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
                          className='form-input-mobile rounded-xl border-2 border-gray-200 bg-white focus:border-[#02ADEF]'
                        />
                      </div>

                      {/* Mailing Postal Code */}
                      <div>
                        <Label className='form-label-mobile font-semibold text-gray-700'>
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
                            'form-input-mobile rounded-xl border-2 bg-white',
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
            </div>

            {/* Desktop Layout - Two Columns */}
            <div className='hidden grid-cols-2 gap-6 sm:grid'>
              {/* Left Column */}
              <div className='space-y-6'>
                {/* NRIC/FIN */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
                    NRIC/FIN <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    placeholder='Enter your NRIC/FIN'
                    value={personalInfoData.policyHolderNricFin}
                    onChange={(e) =>
                      updatePersonalInfoData(
                        'policyHolderNricFin',
                        e.target.value,
                      )
                    }
                    className={cn(
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
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

                {/* Full Name (As per NRIC/FIN) */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
                    Full Name (As per NRIC/FIN){' '}
                    <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    placeholder='Enter your full name as per NRIC/FIN'
                    value={personalInfoData.policyHolderFullName}
                    onChange={(e) =>
                      updatePersonalInfoData(
                        'policyHolderFullName',
                        e.target.value,
                      )
                    }
                    className={cn(
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
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

                {/* Phone Number - REMAINS EDITABLE */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
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
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
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
              </div>

              {/* Right Column */}
              <div className='space-y-6'>
                {/* Date of Birth */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
                    Date of Birth <span className='text-red-500'>*</span>
                  </Label>
                  <DateInput
                    value={personalInfoData.policyHolderDateOfBirth}
                    onChange={(value) =>
                      updatePersonalInfoData('policyHolderDateOfBirth', value)
                    }
                    className={cn(
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
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

                {/* Nationality */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
                    Nationality <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    options={NATIONALITIES}
                    defaultValue={personalInfoData.policyHolderNationality}
                    onChange={(value) =>
                      updatePersonalInfoData('policyHolderNationality', value)
                    }
                    disabled={myInfoData.isLoading || isMyInfoRetrieved}
                    placeholder='Select your nationality'
                    // className={cn(
                    //   'h-14 text-base',
                    //   personalInfoErrors.policyHolderNationality
                    //     ? 'border-red-500'
                    //     : 'border-gray-200 focus:border-[#02ADEF]',
                    //   isMyInfoRetrieved ? 'bg-green-50' : '',
                    // )}
                    className=' h-14'
                  />
                  {personalInfoErrors.policyHolderNationality && (
                    <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                      <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                        !
                      </span>
                      {personalInfoErrors.policyHolderNationality}
                    </p>
                  )}
                </div>

                {/* Email - REMAINS EDITABLE */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
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
                      updatePersonalInfoData(
                        'policyHolderEmail',
                        e.target.value,
                      )
                    }
                    className={cn(
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
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
              </div>

              {/* Insured Premises Section Header - Desktop - Full Width */}
              <div className='col-span-2 border-t border-gray-200 pt-6'>
                <h3 className='mb-1 text-xl font-semibold text-gray-800'>
                  Insured Premises
                </h3>
                <p className='text-base text-gray-600'>
                  Please provide your property address details
                </p>
              </div>

              {/* Left Column Continued */}
              <div className='space-y-6'>
                {/* Address Line 1 is now in this new left column section */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
                    Address Line 1 <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    placeholder='Enter address line 1'
                    value={personalInfoData.addressLine1}
                    onChange={(e) =>
                      updatePersonalInfoData('addressLine1', e.target.value)
                    }
                    className={cn(
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
                      personalInfoErrors.addressLine1
                        ? 'border-red-500'
                        : 'border-gray-200 focus:border-[#02ADEF]',
                      isMyInfoRetrieved ? 'bg-green-50' : '',
                    )}
                    disabled={myInfoData.isLoading || isMyInfoRetrieved}
                  />
                  {personalInfoErrors.addressLine1 && (
                    <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                      <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                        !
                      </span>
                      {personalInfoErrors.addressLine1}
                    </p>
                  )}
                </div>

                {/* Address Line 3 */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
                    Address Line 3
                  </Label>
                  <Input
                    placeholder='Enter address line 3 (optional)'
                    value={personalInfoData.addressLine3}
                    onChange={(e) =>
                      updatePersonalInfoData('addressLine3', e.target.value)
                    }
                    className={cn(
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
                      'border-gray-200 focus:border-[#02ADEF]',
                      isMyInfoRetrieved ? 'bg-green-50' : '',
                    )}
                    disabled={myInfoData.isLoading || isMyInfoRetrieved}
                  />
                </div>
              </div>

              {/* Right Column Continued */}
              <div className='space-y-6'>
                {/* Address Line 2 */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
                    Address Line 2
                  </Label>
                  <Input
                    placeholder='Enter address line 2 (optional)'
                    value={personalInfoData.addressLine2}
                    onChange={(e) =>
                      updatePersonalInfoData('addressLine2', e.target.value)
                    }
                    className={cn(
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
                      'border-gray-200 focus:border-[#02ADEF]',
                      isMyInfoRetrieved ? 'bg-green-50' : '',
                    )}
                    disabled={myInfoData.isLoading || isMyInfoRetrieved}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <Label className='text-lg font-semibold text-gray-700'>
                    Postal Code <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    placeholder='Enter postal code'
                    value={personalInfoData.postalCode}
                    onChange={(e) =>
                      updatePersonalInfoData('postalCode', e.target.value)
                    }
                    className={cn(
                      'h-14 rounded-xl border-2 bg-white px-4 text-base',
                      personalInfoErrors.postalCode
                        ? 'border-red-500'
                        : 'border-gray-200 focus:border-[#02ADEF]',
                      isMyInfoRetrieved ? 'bg-green-50' : '',
                    )}
                    disabled={myInfoData.isLoading || isMyInfoRetrieved}
                  />
                  {personalInfoErrors.postalCode && (
                    <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                      <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                        !
                      </span>
                      {personalInfoErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Mailing Address Checkbox - Full Width */}
              <div className='col-span-2 mt-6'>
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
                    disabled={myInfoData.isLoading}
                  />
                  <label
                    htmlFor='mailingAddressDifferent'
                    className='cursor-pointer select-none text-base font-semibold text-gray-700'
                  >
                    My Insured Premises and Mailing Address is different
                  </label>
                </div>
              </div>

              {/* Mailing Address Section - Conditional Full Width */}
              {personalInfoData.mailingAddressDifferent === 'yes' && (
                <div className='col-span-2'>
                  <div className='rounded-xl border-2 border-blue-200 bg-blue-50/50 p-6'>
                    <h3 className='mb-4 text-lg font-semibold text-gray-800'>
                      Mailing Address
                    </h3>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      {/* Mailing Address Line 1 */}
                      <div>
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
                            'mt-2 h-12 rounded-xl border-2 bg-white px-4 text-base',
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
                      <div>
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
                          className='mt-2 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-base focus:border-[#02ADEF]'
                        />
                      </div>

                      {/* Mailing Address Line 3 */}
                      <div>
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
                          className='mt-2 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 text-base focus:border-[#02ADEF]'
                        />
                      </div>

                      {/* Mailing Postal Code */}
                      <div>
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
                            'mt-2 h-12 rounded-xl border-2 bg-white px-4 text-base',
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
            </div>
          </CardContent>
        </Card>
        {/* padding */}
        <div className='h-10' />

        {/* Premium Summary */}
        {selectedPlan && (
          <PremiumSummary
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
