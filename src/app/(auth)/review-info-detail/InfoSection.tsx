import React, { useState } from 'react';

import { saveToSessionStorage } from '@/libs/utils/utils';

import {
  ECICS_USER_INFO,
  IS_THREE_INPUT_COMPLETE,
} from '@/constants/general.constant';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

type InfoSectionProps = {
  title: string;
  data: { label: string; value: string | any[] }[];
  boxClass?: string;
  setIsDisabled?: (val: boolean) => void;
};

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  data,
  boxClass = '',
  setIsDisabled,
}) => {
  const { isMobile } = useDeviceDetection();
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
    const requiredFields = ['make', 'firstregistrationdate', 'vehicleno'];
    return updatedVehicles.every((vehicle) =>
      requiredFields.every(
        (field) => vehicle[field]?.value && vehicle[field]?.value !== 'N/A',
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
      const [newMake, ...newModel] = value.split(' ');
      make = newMake;
      model = newModel.join(' ');
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

  const renderGrid = () => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 2) {
      const chunk = data.slice(i, i + 2); // Take two items at a time
      chunks.push(
        <div key={i} className='mt-2 grid grid-cols-2 gap-4'>
          {chunk.map((item, idx) => (
            <div key={idx}>
              <div className='text-sm font-bold'>{item.label}</div>
              <div className='text-sm'>
                {item.value === 'N/A' ? (
                  <input
                    name={item.label.toLowerCase().replace(/\s+/g, '_')}
                    type='text'
                    className='w-full border border-gray-300 p-2'
                    placeholder={`Enter ${item.label} info`}
                    onChange={(e) =>
                      handleInputChange(
                        0,
                        item.label.toLowerCase().replace(/\s+/g, '_'),
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  item.value
                )}
              </div>
            </div>
          ))}
        </div>,
      );
    }
    return chunks;
  };

  return (
    <div
      className={`${isMobile ? '' : 'rounded-md border border-gray-300 bg-white p-4'} mt-4 ${boxClass}`}
    >
      <div className='text-base font-bold underline underline-offset-4'>
        {title}
      </div>
      {renderGrid()}
    </div>
  );
};

export default InfoSection;
