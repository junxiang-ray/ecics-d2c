import React from 'react';

import { ECICS_USER_INFO } from '@/constants/general.constant';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

type InfoSectionProps = {
  title: string;
  data: { label: string; value: string | any[] }[];
  boxClass?: string;
};

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  data,
  boxClass = '',
}) => {
  const { isMobile } = useDeviceDetection();
  const sessionData = JSON.parse(
    sessionStorage.getItem(ECICS_USER_INFO) || '{}',
  );
  const vehicles = sessionData?.vehicles || [];

  const updateSessionStorage = (vehicles: any[]) => {
    sessionStorage.setItem(
      ECICS_USER_INFO,
      JSON.stringify({
        ...sessionData,
        vehicles,
      }),
    );
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const newVehicles = [...vehicles];
    const prevVehicle = newVehicles[index] || {};

    // Split make and model if it is vehicle_make
    let make = prevVehicle.make?.value || '';
    let model = prevVehicle.model?.value || '';
    if (field === 'vehicle_make') {
      const parts = value.split(' ');
      make = parts[0] || '';
      model = parts.slice(1).join(' ') || '';
    }

    // Get year if it is year_of_registration
    let year = prevVehicle.firstregistrationdate?.value
      ? new Date(prevVehicle.firstregistrationdate.value)
          .getFullYear()
          .toString()
      : '';
    if (field === 'year_of_registration') {
      year = value;
    }

    // Get vehicleno if it is chassis_number
    let vehicleno = prevVehicle.vehicleno?.value || '';
    if (field === 'chassis_number') {
      vehicleno = value;
    }

    newVehicles[index] = {
      ...prevVehicle,
      make: { value: make },
      model: { value: model },
      firstregistrationdate: { value: `${year}-01-01` },
      yearofmanufacture: { value: year },
      vehicleno: { value: vehicleno },
    };

    updateSessionStorage(newVehicles);
  };

  const renderGrid = () => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 2) {
      const chunk = data.slice(i, i + 2);
      chunks.push(
        <div key={i} className='mt-2 grid grid-cols-2 gap-4'>
          {chunk.map((item, idx) => {
            return (
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
                          idx,
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
            );
          })}
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
