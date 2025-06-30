import { Drawer, Modal, Spin } from 'antd';
import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

import { SavePersonalInfoPayload } from '@/libs/types/auth';
import {
  calculateDrivingExperienceFromLicences,
  convertDateToDDMMYYYY,
  extractYear,
} from '@/libs/utils/date-utils';
import { saveToSessionStorage } from '@/libs/utils/utils';

import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { PrimaryButton } from '@/components/ui/buttons';
import {
  DropdownField,
  DropdownOption,
} from '@/components/ui/form/dropdownfield';

import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { usePostPersonalInfo } from '@/hook/auth/login';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface UnMatchVehicleModalProps {
  onClose: () => void;
  visible: boolean;
}

const UnMatchVehicleModal = ({
  onClose,
  visible,
}: UnMatchVehicleModalProps) => {
  const methods = useForm();
  const partnerCode = localStorage.getItem(PARTNER_CODE);
  const promoCode = localStorage.getItem(PROMO_CODE);

  const { isMobile } = useDeviceDetection();
  const { setValue, watch } = methods;
  const selectedMakeId = watch('vehicle_make');
  const selectedModelId = watch('vehicle_model');
  const isSubmitDisabled = !selectedMakeId || !selectedModelId;

  const { mutate: savePersonalInfo } = usePostPersonalInfo();

  const sessionData = JSON.parse(
    sessionStorage.getItem(ECICS_USER_INFO) || '{}',
  );

  const createPayload = (parsedData: any): SavePersonalInfoPayload => {
    const v = parsedData?.vehicle_selected || [];
    const qdlClasses = parsedData?.drivinglicence?.qdl?.classes || [];
    const drivingYears = calculateDrivingExperienceFromLicences(qdlClasses);

    const singpassDataRaw = sessionStorage.getItem(DATA_FROM_SINGPASS);
    const parsedSingpass = singpassDataRaw ? JSON.parse(singpassDataRaw) : {};

    return {
      key: `${uuid()}`,
      is_sending_email: false,
      promo_code: promoCode ?? '',
      partner_code: partnerCode ?? '',
      personal_info: {
        name: parsedData.name?.value || '',
        gender: parsedData.sex?.desc || '',
        marital_status: parsedData.marital?.desc || '',
        nric: parsedData.uinfin?.value || '',
        address: [
          `${parsedData.regadd?.block?.value || ''} ${parsedData.regadd?.street?.value || ''} #${parsedData.regadd?.floor?.value || ''}-${parsedData.regadd?.unit?.value || ''}, ${parsedData.regadd?.postal?.value || ''}, ${parsedData.regadd?.country?.desc || ''}`,
        ].filter(Boolean),
        post_code: parsedData.regadd?.postal?.value || '',
        date_of_birth: parsedData.dob?.value
          ? convertDateToDDMMYYYY(parsedData.dob.value)
          : '',
        year_of_registration: parsedData.year_of_registration || '',
        driving_experience:
          qdlClasses.length > 0
            ? drivingYears >= 6
              ? '6 years and above'
              : `${drivingYears} years`
            : '1 year',
        phone: `${parsedData.mobileno?.nbr?.value || ''}`,
        email: parsedData.email?.value?.toLowerCase() || '',
      },
      vehicle_info_selected: {
        vehicle_number: v[0]?.vehicleno?.value || '',
        first_registered_year:
          extractYear(v[0]?.firstregistrationdate?.value) || '',
        vehicle_make: v[0]?.make?.value || '',
        vehicle_model: v[0]?.model?.value || '',
        engine_number: v[0]?.engineno?.value || '',
        chasis_number: v[0]?.chassisno?.value || '',
        engine_capacity: v[0]?.enginecapacity?.value || '',
        power_rate: v[0]?.powerrate?.value || '',
        year_of_manufacture: v[0]?.yearofmanufacture?.value || '',
      },
      vehicles:
        parsedData.vehicles?.map((v: any) => ({
          chasis_number: v.vehicleno?.value || '',
          vehicle_make: v.make?.value || '',
          vehicle_model: v.model?.value || '',
          first_registered_year:
            extractYear(v.firstregistrationdate?.value) || '',
        })) || [],
      data_from_singpass: parsedSingpass,
    };
  };

  const handleSubmit = methods.handleSubmit((data) => {
    const { vehicle_make, vehicle_model } = data;

    const selectedMake = makeOptions.find(
      (make) => make.value === vehicle_make,
    );
    const selectedModel = modelOptions.find(
      (model) => model.value === vehicle_model,
    );

    if (selectedMake && selectedModel) {
      if (sessionData.vehicles.length > 1) {
        const updatedVehicle = {
          ...sessionData.vehicle_selected,
          make: { value: selectedMake.text },
          model: { value: selectedModel.text },
        };

        const updatedParsed = {
          ...sessionData,
          vehicle_selected: [updatedVehicle],
        };
        saveToSessionStorage({
          [ECICS_USER_INFO]: JSON.stringify(updatedParsed),
        });
        onClose();
        savePersonalInfo(createPayload(updatedParsed));
      } else if (sessionData.vehicles.length === 1) {
        const updatedVehicles = sessionData.vehicles.map(
          (vehicle: any, index: number) => {
            if (index === 0) {
              return {
                ...vehicle,
                make: { value: selectedMake.text },
                model: { value: selectedModel.text },
              };
            }
            return vehicle;
          },
        );

        const updatedParsed = {
          ...sessionData,
          vehicle_selected: [updatedVehicles[0]],
        };

        saveToSessionStorage({
          [ECICS_USER_INFO]: JSON.stringify(updatedParsed),
        });
        onClose();
        savePersonalInfo(createPayload(updatedParsed));
      }
    }
  });

  const { data } = useGetVehicleMakes();
  const makeOptions: DropdownOption[] = useMemo(() => {
    if (!data) return [];
    return data?.map((item: any) => ({
      value: item.id,
      text: item.name,
    }));
  }, [data]);

  const { data: modelOptionsData, isLoading: isLoadingModelOptions } =
    useGetVehicleModels(selectedMakeId || '');
  const modelOptions: DropdownOption[] = useMemo(() => {
    if (!modelOptionsData) return [];
    return modelOptionsData?.map((item: any) => ({
      value: item.id,
      text: item.name,
    }));
  }, [modelOptionsData]);

  const content = (
    <>
      <div className='flex flex-col gap-2'>
        <WarningTriangleIcon size={70} />
        <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
          We're Sorry
        </p>
        <div className='flex flex-col items-center gap-6 text-center'>
          <p className='text-sm font-normal text-[#00000073]'>
            We are unable to match your vehicle model with our system.
          </p>
          <p className='text-2xl font-semibold'>SBA123A</p>
        </div>
        <FormProvider {...methods}>
          <div>
            <div className='text-base font-light'>Vehicle Make</div>
            <DropdownField
              className='h-[40px]'
              name='vehicle_make'
              placeholder='Enter vehicle make'
              options={makeOptions}
              onChange={() => {
                // Reset model when make changes
                setValue('vehicle_model', null);
              }}
            />
          </div>
          <div className='mt-[8px]'>
            <div className='text-base font-light'>Vehicle Model</div>
            <DropdownField
              className='h-[40px]'
              name='vehicle_model'
              placeholder='Enter vehicle model'
              disabled={!selectedMakeId}
              options={modelOptions}
              notFoundContent={
                isLoadingModelOptions ? (
                  <Spin size='small' />
                ) : (
                  'No results found'
                )
              }
            />
          </div>
          <div className='flex justify-center gap-4 bg-white pt-4'>
            <PrimaryButton
              onClick={handleSubmit}
              className='w-full'
              disabled={isSubmitDisabled}
            >
              Submit
            </PrimaryButton>
          </div>
        </FormProvider>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={onClose}
        closable={false}
        height='auto'
        className='rounded-t-xl'
      >
        <div>{content}</div>
      </Drawer>
    );
  }

  return (
    <Modal
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      closable={true}
      maskClosable={true}
      keyboard={true}
      footer={null}
      centered
      width={400}
    >
      <div>{content}</div>
    </Modal>
  );
};

export default UnMatchVehicleModal;
