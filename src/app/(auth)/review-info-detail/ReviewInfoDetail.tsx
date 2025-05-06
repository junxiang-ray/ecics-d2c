'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { SavePersonalInfoPayload } from '@/libs/types/auth';
import { convertDateToDDMMYYYY } from '@/libs/utils/date-utils';
import { capitalizeWords, saveToSessionStorage } from '@/libs/utils/utils';

import WarningIcon from '@/components/icons/WarningIcon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';
import { VehicleSelectionModal } from '@/components/VehicleSelection';

import ConfirmInfoModalWrapper from '@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper';
import { ECICS_USER_INFO } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { usePostPersonalInfo } from '@/hook/auth/login';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { VehicleSelection } from '@/interfaces/vehicle.interface';

import InfoSection from './InfoSection';

const reviewInfoSchema = z.object({
  email: z.string().regex(emailRegex, 'Please enter a valid email address.'),
  phone: z
    .string()
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  personal: z.object({
    nameAsPerNric: z.string().min(1, 'Required'),
    nric: z.string().min(1, 'Required'),
    gender: z.string().min(1, 'Required'),
    maritalStatus: z.string().min(1, 'Required'),
    dateOfBirth: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
  }),
  vehicle: z.object({
    vehicleMake: z.string().min(1, 'Required'),
    yearOfRegistration: z.string().min(4, 'Enter a valid year'),
    chassisNumber: z.string().min(1, 'Required'),
  }),
});
const isReadOnly = true;
type ReviewInfoForm = z.infer<typeof reviewInfoSchema>;

interface CommonInfo {
  email: string;
  phone: string;
  personal: Array<{ label: string; value: string }>;
  vehicle: Array<{ label: string; value: string }>;
}

const ReviewInfoDetail = () => {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isMobile } = useDeviceDetection();
  const [commonInfo, setCommonInfo] = useState<CommonInfo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showChooseVehicleModal, setShowChooseVehicleModal] = useState(false);
  const [refreshSession, setRefreshSession] = useState(false);

  const { mutate: savePersonalInfo } = usePostPersonalInfo();
  const methods = useForm<ReviewInfoForm>({
    resolver: zodResolver(reviewInfoSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  });

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

      // Check if any vehicle field has "N/A"
      const hasInvalidVehicle = transformed.vehicle.some(
        (item: any) => item.value === 'N/A',
      );
      if (hasInvalidVehicle) {
        setIsDisabled(true);
      }

      methods.reset({
        email: transformed.email,
        phone: transformed.phone,
      });
      if ((parsed.vehicles?.length || 0) > 1) {
        setShowChooseVehicleModal(true);
      }
    }
  }, [methods, refreshSession]);

  const stored = sessionStorage.getItem(ECICS_USER_INFO);
  const parsed = stored ? JSON.parse(stored) : null;

  const vehicles: VehicleSelection[] = (parsed?.vehicles ?? []).map(
    (vehicle: any) => ({
      regNo: vehicle.vehicleno?.value,
      make: vehicle.make?.value,
      model: vehicle.model?.value,
      first_registered_year: vehicle.firstregistrationdate?.value,
    }),
  );

  const handleSelection = (selected: VehicleSelection | null) => {
    if (selected) {
      // Retrieve user info from sessionStorage
      const stored = sessionStorage.getItem(ECICS_USER_INFO);
      const parsed = stored ? JSON.parse(stored) : null;

      if (parsed && parsed.vehicles) {
        // Filter vehicles to only include the one matching the selected vehicle
        const filteredVehicles = parsed.vehicles.filter(
          (vehicle: any) => vehicle.vehicleno.value === selected.regNo,
        );

        // Update the sessionStorage with the filtered vehicles
        parsed.vehicles = filteredVehicles;

        sessionStorage.removeItem(ECICS_USER_INFO);
        // Save the updated user info back to sessionStorage
        saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(parsed) });
        setRefreshSession((prev) => !prev);
      }
    }
    setShowChooseVehicleModal(false);
  };

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
                <InputField name='email' disabled={isReadOnly} />
              </div>
              <div className='mt-4'>
                <div className='text-sm font-bold'>Phone Number</div>
                <InputField name='phone' disabled={isReadOnly} />
              </div>
              {commonInfo?.personal && (
                <InfoSection title='Personal Info' data={commonInfo.personal} />
              )}
              {!showChooseVehicleModal && commonInfo?.vehicle && (
                <InfoSection
                  title='Vehicle Details'
                  data={commonInfo.vehicle}
                  setIsDisabled={setIsDisabled}
                />
              )}
            </div>
          ) : (
            <div className='w-full justify-self-center'>
              <div className='mt-6 items-center justify-between rounded-md border border-gray-300 bg-gray-100 p-4'>
                <div className='flex items-center justify-between'>
                  <div className='text-base font-bold'>
                    Enter a valid Email and Contact Number
                  </div>
                  <Tooltip title='We use this information to verify your identity and pre-fill your application with accurate government-verified data. This helps ensure a faster, more secure, and seamless submission process.'>
                    <span className='flex cursor-pointer items-center font-bold'>
                      <WarningIcon size={14} />
                      <span className='ml-1 text-[10px]'>
                        Why do we need this?
                      </span>
                    </span>
                  </Tooltip>
                </div>
                <div className='mt-4 flex gap-4'>
                  <div className='w-[calc(50%-10px)]'>
                    <div className='text-sm font-bold'>Email Address</div>
                    <InputField name='email' disabled={isReadOnly} />
                  </div>
                  <div className='w-[calc(50%-10px)]'>
                    <div className='text-sm font-bold'>Phone Number</div>
                    <InputField name='phone' disabled={isReadOnly} />
                  </div>
                </div>
              </div>
              {commonInfo?.personal && (
                <InfoSection
                  title='Personal Info'
                  data={commonInfo.personal}
                  boxClass='mt-4'
                />
              )}
              {!showChooseVehicleModal && commonInfo?.vehicle && (
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
        <div className='sticky bottom-0 left-0 right-0 z-20 flex justify-center gap-4 border-t bg-white p-4'>
          <SecondaryButton
            className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
            onClick={handleCloseModal}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={handleContinue}
            className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
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
        {showChooseVehicleModal && (
          <VehicleSelectionModal
            isReviewScreen={true}
            visible={showChooseVehicleModal}
            vehicles={vehicles}
            onSubmit={handleSelection}
          />
        )}
      </div>
    </FormProvider>
  );
};

export default ReviewInfoDetail;
