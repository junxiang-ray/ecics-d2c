'use client';

import { memo, useState } from 'react';

import { AddNamedDriverInfo, Addon } from '@/libs/types/quote';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import dayjs from 'dayjs';
import AdditionDriver from '../components/AdditionDriver';
import AddOnRow from './AddOnRow';
import RoadSideIcon from '@/components/icons/RoadSideIcon';
import TruncateText from './TruncateText ';

export const ADDON_CARS = [
  'CAR_COM_AND',
  'CAR_TPFT_AND',
  'CAR_TPO_AND',
  'CAR_FNCD_AND',
];

function AddonAdditionalDriver({
  addon,
  drivers,
  setDrivers,
  policyStartDate,
}: {
  addon: Addon;
  drivers: AddNamedDriverInfo[];
  setDrivers: (drivers: AddNamedDriverInfo[]) => void;
  policyStartDate: string;
}) {
  const [isShowAdditionDriver, setIsShowAdditionDriver] = useState(false);

  const handleRemoveAdditionalDriver = (driver: AddNamedDriverInfo) => {
    const updatedDrivers = drivers.filter(
      (d) => d.nric_or_fin !== driver.nric_or_fin,
    );
    setDrivers(updatedDrivers);
  };

  const status =
    drivers.every((driver) => !!driver.nric_or_fin) && !!drivers.length
      ? 'completed'
      : 'new';

  if (addon.is_display === false) {
    return null;
  }
  const baseFee = addon.options?.[0].premium_with_gst ?? 0;
  const totalFee = drivers.length ? baseFee * (drivers.length - 1) : 0;
  // addon with code: CAR_FNCD_AJE is required additional driver
  const isRequired = addon.code === 'CAR_FNCD_AND';

  return (
    <AddOnRow
      isRequired={isRequired}
      title={addon.title}
      icon={<RoadSideIcon className='text-brand-blue' />}
      status={status}
    >
      <TruncateText text={addon.description} />
      <div className='my-2 border-t border-dashed border-[#00ADEFB2]' />
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
          <p className='text-[#525252]'>SGD {totalFee ?? 0}</p>
          {drivers.length > 0 ? (
            <SecondaryButton
              className='black h-8 w-28 rounded-md '
              onClick={() => setIsShowAdditionDriver(true)}
            >
              Edit Driver
            </SecondaryButton>
          ) : (
            <SecondaryButton
              className='black h-8 w-28 rounded-md'
              onClick={() => {
                setIsShowAdditionDriver(true);
              }}
            >
              Add
            </SecondaryButton>
          )}
          {isShowAdditionDriver && (
            <AdditionDriver
              isShowAdditionDriver={isShowAdditionDriver}
              setIsShowAdditionDriver={setIsShowAdditionDriver}
              setDataDrivers={setDrivers}
              dataDrivers={drivers}
              policyStartDate={dayjs(policyStartDate, 'DD/MM/YYYY').toDate()}
            />
          )}
        </div>
        {drivers.length > 0 && (
          <>
            {drivers.map((driver, index) => (
              <div
                className='flex items-center justify-between text-[14px]'
                key={index}
              >
                <p className='font-semibold leading-[20px] text-[#525252]'>
                  Additional Driver: {driver.name}
                </p>
                <PrimaryButton
                  className='black h-8 w-28 rounded-md bg-red-400'
                  onClick={() => handleRemoveAdditionalDriver(driver)}
                >
                  Remove
                </PrimaryButton>
              </div>
            ))}
          </>
        )}
      </div>
    </AddOnRow>
  );
}

export default memo(AddonAdditionalDriver);
