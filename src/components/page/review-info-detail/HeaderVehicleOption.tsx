import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { VehicleSingPassResponse } from '@/libs/types/auth';
import { capitalizeWords } from '@/libs/utils/utils';

interface MissingFields {
  engine_number?: boolean;
  chassis_number?: boolean;
  reg_yyyy?: boolean;
  make?: boolean;
  model?: boolean;
}

interface Props {
  vehicles: VehicleSingPassResponse[];
  isMobile: boolean;
  getVehicleTopRow: (
    vehicle: VehicleSingPassResponse,
  ) => { title: string; value: string }[];
  getVehicleBottomRow: (
    vehicle: VehicleSingPassResponse,
  ) => { title: string; value: string }[];
  onVehicleSelect?: (
    missingFields: MissingFields,
    vehicleAge: number | null,
  ) => void;
}

const HeaderVehicleOption: React.FC<Props> = ({
  vehicles,
  isMobile,
  getVehicleTopRow,
  getVehicleBottomRow,
  onVehicleSelect: onVehicleSelect,
}) => {
  const liveVehicles = vehicles?.filter((v) => v.status?.desc === 'LIVE') || [];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    liveVehicles.length === 1 ? 0 : null,
  );
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (liveVehicles.length === 1) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(null);
    }
  }, [liveVehicles.length]);

  const chooseVehicle = (vehicle: VehicleSingPassResponse) => {
    const missing = {
      engine_number: !vehicle.engineno?.value?.trim(),
      chassis_number: !vehicle.chassisno?.value?.trim(),
      reg_yyyy: !vehicle.yearofmanufacture?.value?.toString().trim(),
      make: !vehicle.make?.value?.trim(),
      model: !vehicle.model?.value?.trim(),
    };
    const regDateStr = vehicle.firstregistrationdate?.value;
    const vehicleAge = regDateStr
      ? dayjs().diff(dayjs(regDateStr), 'year')
      : null;

    onVehicleSelect?.(missing, vehicleAge);
  };

  return (
    <div className='mt-[32px] w-full'>
      <div className='my-3 text-lg font-bold underline'>
        Choose a Vehicle to insure
      </div>
      <div
        className={`grid gap-y-4 sm:gap-x-6 sm:gap-y-4 ${
          isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'
        }`}
      >
        {liveVehicles.map((vehicle, index) => {
          const isSelected = selectedIndex === index;
          const isExpanded = expandedIndex === index;

          const topRow = getVehicleTopRow(vehicle);
          const bottomRow = getVehicleBottomRow(vehicle);

          const showTopOnly = isMobile && !isExpanded;

          const topToShow = showTopOnly ? topRow.slice(0, 2) : topRow;
          const bottomToShow = showTopOnly ? [] : bottomRow;

          return (
            <div
              key={index}
              className={`rounded-md border bg-white shadow-sm ${
                isSelected ? 'border-[#00ADEF]' : 'border-gray-300'
              }`}
            >
              <div className='flex items-center justify-between px-4 py-2'>
                <div className='flex items-center'>
                  <div className='mr-[6px] text-base font-bold'>
                    {vehicle.vehicleno?.value ?? 'N/A'}
                  </div>
                  <div className='rounded-[10px] bg-[#34C759] px-[14px] py-[2px] text-base font-semibold text-white'>
                    {capitalizeWords(vehicle.status?.desc) ?? 'N/A'}
                  </div>
                </div>

                <button
                  className='flex h-8 w-8 items-center justify-center rounded-full border-[2px] border-[#00ADEF] bg-white'
                  onClick={() => {
                    setSelectedIndex(index);
                    chooseVehicle(vehicle);
                  }}
                >
                  {isSelected && (
                    <div className='h-6 w-6 rounded-full bg-[#00ADEF]' />
                  )}
                </button>
              </div>

              <div className='h-[1px] w-full bg-gray-200'></div>

              {/* Top Row */}
              <div className='mb-2 mt-[10px] grid grid-cols-2 gap-4 px-4 text-sm md:grid-cols-4'>
                {topToShow.map((item, idx) => (
                  <div key={idx}>
                    <div className='text-sm font-light'>{item.title}</div>
                    <div className='whitespace-normal break-words text-base font-semibold'>
                      {item.value || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Row */}
              {bottomToShow.length > 0 && (
                <div className='mb-[12px] mt-4 grid grid-cols-2 gap-4 px-4 text-sm md:grid-cols-4'>
                  {bottomToShow.map((item, idx) => (
                    <div key={idx}>
                      <div className='text-sm font-light'>{item.title}</div>
                      <div className='whitespace-normal break-words text-base font-semibold'>
                        {item.value || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isMobile && (topRow.length > 2 || bottomRow.length > 0) && (
                <div className='justify-self-center px-4 pb-3'>
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className='text-base font-bold text-[#00ADEF] underline'
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderVehicleOption;
