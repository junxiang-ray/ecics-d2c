import React from 'react';

import { VehicleSingPassResponse } from '@/libs/types/auth';
import { capitalizeWords } from '@/libs/utils/utils';

interface Props {
  vehicles: VehicleSingPassResponse[];
  isMobile: boolean;
  getVehicleTopRow: (
    vehicle: VehicleSingPassResponse,
  ) => { title: string; value: string }[];
  getVehicleBottomRow: (
    vehicle: VehicleSingPassResponse,
  ) => { title: string; value: string }[];
}

const HeaderVehicleOption: React.FC<Props> = ({
  vehicles,
  isMobile,
  getVehicleTopRow,
  getVehicleBottomRow,
}) => {
  const liveVehicles = vehicles?.filter((v) => v.status?.desc === 'LIVE');
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
        {liveVehicles?.map((vehicle, index) => (
          <div
            key={index}
            className='rounded-md border border-gray-300 bg-white shadow-sm'
          >
            <div className='flex items-center justify-between px-4 py-2'>
              <div className='text-base font-bold'>
                {vehicle.vehicleno?.value ?? 'N/A'}
              </div>
              <div className='rounded-[10px] bg-[#34C759] px-[14px] py-[2px] text-base font-semibold text-white'>
                {capitalizeWords(vehicle.status?.desc) ?? 'N/A'}
              </div>
            </div>

            <div className='h-[1px] w-full bg-gray-200'></div>

            <div className='mb-2 mt-[10px] grid grid-cols-2 gap-4 px-4 text-sm md:grid-cols-4'>
              {getVehicleTopRow(vehicle).map((item: any, idx: number) => (
                <div key={idx}>
                  <div className='text-sm font-light'>{item.title}</div>
                  <div className='whitespace-normal break-words text-base font-semibold'>
                    {item.value || 'N/A'}
                  </div>
                </div>
              ))}
            </div>

            <div className='mb-[12px] mt-4 grid grid-cols-2 gap-4 px-4 text-sm md:grid-cols-4'>
              {getVehicleBottomRow(vehicle).map((item, idx) => (
                <div key={idx}>
                  <div className='text-sm font-light'>{item.title}</div>
                  <div className='whitespace-normal break-words text-base font-semibold'>
                    {item.value || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderVehicleOption;
