'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { capitalizeWords } from '@/libs/utils/utils';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

import DesktopReviewInfoDetail from '@/app/(auth)/review-info-detail/DesktopReviewInfoDetail';
import ConfirmInfoModalWrapper from '@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper';
import {
  ECICS_USER_INFO,
  IS_THREE_INPUT_COMPLETE,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import InfoSection from './InfoSection';
import { toast } from 'react-toastify';
import { SavePersonalInfoPayload } from '@/libs/types/auth';
import { convertDateToDDMMYYYY } from '@/libs/utils/date-utils';
import { usePostPersonalInfo } from '@/hook/auth/login';

const reviewInfoSchema = z.object({
  email: z.string().regex(emailRegex, 'Please enter a valid email address.'),
  phone: z
    .string()
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
});

type ReviewInfoForm = z.infer<typeof reviewInfoSchema>;

const ReviewInfoDetail = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isMobile } = useDeviceDetection();
  const [commonInfo, setCommonInfo] = useState<any>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const router = useRouter();
  const { mutate: savePersonalInfo } = usePostPersonalInfo();
  const methods = useForm<ReviewInfoForm>({
    resolver: zodResolver(reviewInfoSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  });

  const handleContinue = () => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    if (!stored) {
      toast.error('Missing user info in session.');
      return;
    }

    const parsed = JSON.parse(stored);

    const payload: SavePersonalInfoPayload = {
      email: parsed.email?.value || '',
      phone: `${parsed.mobileno?.nbr?.value || ''}`,
      name: parsed.name?.value || '',
      nric: parsed.uinfin?.value || '',
      gender: parsed.sex?.desc || '',
      marital_status: parsed.marital?.desc || '',
      date_of_birth: parsed.dob?.value
        ? convertDateToDDMMYYYY(parsed.dob.value)
        : '',
      address: [
        `${parsed.regadd?.block?.value || ''} ${parsed.regadd?.street?.value || ''} #${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}, ${parsed.regadd?.postal?.value || ''}, ${parsed.regadd?.country?.desc || ''}`,
      ].filter(Boolean),
      vehicle_make: parsed.vehicle_make || '',
      vehicle_model: parsed.vehicle_model || '',
      year_of_registration: parsed.year_of_registration || '',
      vehicles:
        parsed.vehicles?.map((v: any) => ({
          vehicleno: {
            value: v.vehicleno?.value || '',
          },
          chassisno: {
            value: v.chassisno?.value || '',
          },
          make: {
            value: v.make?.value || '',
          },
          model: {
            value: v.model?.value || '',
          },
          engineno: {
            value: v.engineno?.value || '',
          },
        })) || [],
      key: `key-${Date.now()}`,
    };
    savePersonalInfo(payload);
    router.push(ROUTES.INSURANCE.BASIC_DETAIL_SINGPASS);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(true);
  };

  useEffect(() => {
    const isComplete = sessionStorage.getItem(IS_THREE_INPUT_COMPLETE);
    if (!isComplete) {
      setIsDisabled(true);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    if (stored) {
      const parsed = JSON.parse(stored);

      const transformed = {
        email: parsed.email?.value || '',
        phone: `${parsed.mobileno?.prefix?.value || ''}${parsed.mobileno?.areacode?.value || ''} ${parsed.mobileno?.nbr?.value || ''}`,
        personal: [
          {
            label: 'Name as per NRIC',
            value: capitalizeWords(parsed.name?.value) || '',
          },
          {
            label: 'NRIC',
            value: parsed.uinfin?.value || '',
          },
          {
            label: 'Gender',
            value: capitalizeWords(parsed.sex?.desc) || '',
          },
          {
            label: 'Marital Status',
            value: capitalizeWords(parsed.marital?.desc) || '',
          },
          {
            label: 'Date of Birth',
            value: parsed.dob?.value
              ? new Date(parsed.dob.value).toLocaleDateString('en-GB')
              : '',
          },
          {
            label: 'Address',
            value: [
              capitalizeWords(parsed.regadd?.block?.value || ''),
              capitalizeWords(parsed.regadd?.street?.value || ''),
              parsed.regadd?.floor?.value || parsed.regadd?.unit?.value
                ? `#${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}`
                : '',
              capitalizeWords(parsed.regadd?.building?.value || ''),
              capitalizeWords(parsed.regadd?.country?.desc || 'Singapore'),
              parsed.regadd?.postal?.value,
            ]
              .filter(Boolean)
              .join(' ')
              .trim(),
          },
        ],
        vehicle:
          parsed.vehicles?.length > 0
            ? parsed.vehicles
                .map((v: any) => [
                  {
                    label: 'Vehicle Make',
                    value:
                      capitalizeWords(
                        `${v.make?.value || ''} ${v.model?.value || ''}`,
                      ).trim() || 'N/A',
                  },
                  {
                    label: 'Year of Registration',
                    value: v.firstregistrationdate?.value
                      ? new Date(v.firstregistrationdate.value)
                          .getFullYear()
                          .toString()
                      : 'N/A',
                  },
                  {
                    label: 'Chassis Number',
                    value: v.vehicleno?.value || 'N/A',
                  },
                ])
                .flat() || []
            : [
                { label: 'Vehicle Make', value: 'N/A' },
                { label: 'Year of Registration', value: 'N/A' },
                { label: 'Chassis Number', value: 'N/A' },
              ],
      };
      setCommonInfo(transformed);
      methods.reset({
        email: transformed.email,
        phone: transformed.phone,
      });
    }
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <div className='flex min-h-screen flex-col'>
        <div className='relative z-10 flex-grow p-6'>
          <div className='flex items-center justify-between'>
            {isMobile ? (
              <>
                <Image
                  src='/singpass.svg'
                  alt='Singpass Logo'
                  width={170}
                  height={170}
                />
                <Image
                  src='/ecics.svg'
                  alt='ECICS Logo'
                  width={100}
                  height={100}
                />
              </>
            ) : (
              <>
                <Image src='/ecics.svg' alt='Logo' width={100} height={100} />
                <Image
                  src='/singpass.svg'
                  alt='Logo'
                  width={170}
                  height={170}
                />
              </>
            )}
          </div>

          <div className='mt-6 text-lg font-bold'>
            Review your Myinfo details
          </div>

          {isMobile ? (
            <div>
              <div className='mt-4'>
                <div className='text-sm font-bold'>Email Address</div>
                <InputField name='email' />
              </div>
              <div className='mt-4'>
                <div className='text-sm font-bold'>Phone Number</div>
                <InputField name='phone' />
              </div>
              {commonInfo?.personal && (
                <InfoSection title='Personal Info' data={commonInfo.personal} />
              )}
              {commonInfo?.vehicle && (
                <InfoSection
                  title='Vehicle Details'
                  data={commonInfo.vehicle}
                  setIsDisabled={setIsDisabled}
                />
              )}
            </div>
          ) : (
            // <DesktopReviewInfoDetail commonInfo={commonInfo} />
            <div className='w-2/3 justify-self-center'>
              <div className='mt-6 flex items-center justify-between rounded-md border border-gray-300 bg-white p-4'>
                <div className='w-[calc(50%-10px)]'>
                  <div className='text-sm font-bold'>Email Address</div>
                  <InputField name='email' />
                </div>
                <div className='w-[calc(50%-10px)]'>
                  <div className='text-sm font-bold'>Phone Number</div>
                  <InputField name='phone' />
                </div>
              </div>
              {commonInfo?.personal && (
                <InfoSection
                  title='Personal Details'
                  data={commonInfo.personal}
                  boxClass='mt-4'
                />
              )}
              {commonInfo?.vehicle && (
                <InfoSection
                  title='Vehicle Details'
                  data={commonInfo.vehicle}
                  boxClass='mt-4'
                  setIsDisabled={setIsDisabled}
                />
              )}
            </div>
          )}
        </div>
        <div className='fixed bottom-0 left-0 right-0 z-20 flex justify-center gap-4 border-t bg-white p-4'>
          <SecondaryButton
            className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
            onClick={handleCloseModal}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={handleContinue}
            className='rounded-isDisble-white w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
            disabled={isDisabled}
          >
            Continue
          </PrimaryButton>
        </div>
        {showConfirmModal && (
          <ConfirmInfoModalWrapper
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
          />
        )}
      </div>
    </FormProvider>
  );
};

export default ReviewInfoDetail;
