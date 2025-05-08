import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { saveToSessionStorage } from '@/libs/utils/utils';

import {
  DropdownField,
  DropdownOption,
} from '@/components/ui/form/dropdownfield';

import { VehicleResponse } from '@/api/base-service/verify';
import {
  ECICS_USER_INFO,
  IS_THREE_INPUT_COMPLETE,
} from '@/constants/general.constant';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

type InfoSectionProps = {
  title: string;
  data: { label: string; value: string | any[] }[];
  boxClass?: string;
  setIsDisabled?: (val: boolean) => void;
};
const isReadOnly = true;

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  data,
  boxClass = '',
  setIsDisabled,
}) => {
  const { isMobile } = useDeviceDetection();
  const methods = useForm();
  const { setValue, watch } = methods;
  const selectedMakeId = watch('vehicle_make');

  const sessionData = JSON.parse(
    sessionStorage.getItem(ECICS_USER_INFO) || '{}',
  );
  const [vehicles, setVehicles] = useState(sessionData?.vehicles || []);

  const updateSessionStorage = (updatedVehicles: any[]) => {
    sessionStorage.setItem(
      ECICS_USER_INFO,
      JSON.stringify({ ...sessionData, vehicles: updatedVehicles }),
    );
    setVehicles(updatedVehicles);
  };

  const checkInputsCompleted = (updatedVehicles: any[]) => {
    const requiredFields = [
      'make',
      'model',
      'firstregistrationdate',
      'vehicleno',
    ];
    return updatedVehicles.every((vehicle) =>
      requiredFields.every(
        (field) => vehicle[field]?.value && vehicle[field]?.value !== null,
      ),
    );
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedVehicles = [...vehicles];
    const prevVehicle = updatedVehicles[index] || {};

    let make = prevVehicle.make?.value || '';
    let model = prevVehicle.model?.value || '';
    let year = prevVehicle.firstregistrationdate?.value
      ? new Date(prevVehicle.firstregistrationdate.value)
          .getFullYear()
          .toString()
      : '';
    let vehicleno = prevVehicle.vehicleno?.value || '';

    if (field === 'vehicle_make') {
      make = value;
    } else if (field === 'vehicle_model') {
      model = value;
    } else if (field === 'year_of_registration') {
      year = value;
    } else if (field === 'chassis_number') {
      vehicleno = value;
    }

    updatedVehicles[index] = {
      ...prevVehicle,
      make: { value: make },
      model: { value: model },
      firstregistrationdate: { value: `${year}-01-01` },
      yearofmanufacture: { value: year },
      vehicleno: { value: vehicleno },
    };

    const isInputsCompleted = checkInputsCompleted(updatedVehicles);
    saveToSessionStorage({
      [IS_THREE_INPUT_COMPLETE]: String(isInputsCompleted),
    });
    setIsDisabled?.(!isInputsCompleted);

    updateSessionStorage(updatedVehicles);
  };

  //Call API
  const { data: makeOptionsData } = useGetVehicleMakes();
  const makeOptions: DropdownOption[] =
    makeOptionsData?.map((item: VehicleResponse) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const { data: modelOptionsData } = useGetVehicleModels(selectedMakeId || '');
  const modelOptions: DropdownOption[] =
    modelOptionsData?.map((item: VehicleResponse) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const renderGrid = () => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 2) {
      const chunk = data.slice(i, i + 2); // Take two items at a time
      chunks.push(
        <div key={i} className='mt-2 grid grid-cols-2 gap-4'>
          {chunk.map((item, idx) => {
            const nameKey = item.label.toLowerCase().replace(/\s+/g, '_');
            const isVehicleMake = nameKey === 'vehicle_make';
            const isVehicleModel = nameKey === 'vehicle_model';

            if (item.value == null && (isVehicleMake || isVehicleModel)) {
              return (
                <FormProvider key={idx} {...methods}>
                  <div>
                    {isVehicleMake && (
                      <>
                        <div className='font-bold'>Vehicle Make</div>
                        <DropdownField
                          className='h-[40px]'
                          name='vehicle_make'
                          placeholder='Enter vehicle make'
                          options={makeOptions}
                          onChange={(value) => {
                            const selectedMake = makeOptions.find(
                              (option) => option.value === value,
                            );
                            const makeText = selectedMake
                              ? selectedMake.text
                              : '';
                            setValue('vehicle_model', undefined);
                            handleInputChange(0, 'vehicle_make', makeText);
                          }}
                        />
                      </>
                    )}
                    {isVehicleModel && (
                      <>
                        <div className='font-bold'>Vehicle Model</div>
                        <DropdownField
                          className='h-[40px]'
                          name='vehicle_model'
                          placeholder='Enter vehicle model'
                          disabled={!selectedMakeId}
                          options={modelOptions}
                          onChange={(value) => {
                            const selectedModel = modelOptions.find(
                              (option) => option.value === value,
                            );
                            const modelText = selectedModel
                              ? selectedModel.text
                              : '';
                            handleInputChange(0, 'vehicle_model', modelText);
                          }}
                        />
                      </>
                    )}
                  </div>
                </FormProvider>
              );
            }

            return (
              <div key={idx}>
                <div className='text-sm font-bold'>{item.label}</div>
                <div className='text-sm'>
                  {item.value == null ? (
                    <input
                      name={nameKey}
                      type='text'
                      className={`h-[30px] w-full rounded-[6px] border border-gray-300 bg-gray-200 p-2 ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                      placeholder={`Enter ${item.label} info`}
                      onChange={(e) =>
                        handleInputChange(0, nameKey, e.target.value)
                      }
                    />
                  ) : isMobile ? (
                    item.value
                  ) : (
                    <input
                      name={nameKey}
                      defaultValue={item.value}
                      type='text'
                      className={`h-[30px] w-full rounded-[6px] border border-gray-300 bg-gray-200 p-2 ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                      disabled={isReadOnly}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>,
      );
    }
    return chunks;
  };

  return (
    <div
      className={`${isMobile ? '' : 'rounded-md border border-gray-300 bg-gray-100 p-4'} mt-4 ${boxClass}`}
    >
      <div className='text-base font-bold underline underline-offset-4'>
        {title}
      </div>
      {renderGrid()}
    </div>
  );
};

export default InfoSection;
