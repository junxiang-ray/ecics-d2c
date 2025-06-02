'use client';

import dayjs from 'dayjs';
import { memo, useState } from 'react';

import { AddNamedDriverInfo, Addon } from '@/libs/types/quote';

import { PersonIcon } from '@/components/icons/add-on-icons';
import { SecondaryButton } from '@/components/ui/buttons';

import AddOnRow from './AddOnRow';
import TruncateText from './TruncateText ';
import AdditionDriver from '../components/AdditionDriver';
import { formatCurrency } from '@/libs/utils/utils';
import IconEditDriver from '@/components/icons/EditDriver';
import DeleteIcon from '@/components/icons/DeleteIcon';

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
  isPending,
}: {
  addon: Addon;
  drivers: AddNamedDriverInfo[];
  setDrivers: (drivers: AddNamedDriverInfo[]) => void;
  policyStartDate: string;
  isPending: boolean;
}) {
  const [isShowAdditionDriver, setIsShowAdditionDriver] = useState(false);
  const [editingDriver, setEditingDriver] = useState<AddNamedDriverInfo | null>(
    null,
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
      icon={<PersonIcon className='text-brand-blue' />}
      status={status}
    >
      <TruncateText text={addon.description} />
      <div className='my-2 border-t border-dashed border-[#00ADEFB2]' />
      <div className='flex flex-col gap-2'>
        {/* <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
          <p className='text-[#525252]'>{formatCurrency(totalFee)}</p>
          {drivers.length > 0 ? (
            <SecondaryButton
              className='black h-8 w-28 rounded-md '
              onClick={() => setIsShowAdditionDriver(true)}
              disabled={isPending}
            >
              Edit Driver
            </SecondaryButton>
          ) : (
            <SecondaryButton
              className='black h-8 w-28 rounded-md bg-[#00ADEF] text-[#FFFFFF] hover:bg-[#00ADEF]'
              onClick={() => {
                setIsShowAdditionDriver(true);
              }}
              disabled={isPending}
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
        </div> */}
        <div
          className={`pb-4 ${drivers.length > 0 ? 'flex flex-row items-center justify-between' : 'flex flex-col gap-4 '}`}
        >
          <p className='text-sm font-bold'>Additional Drivers</p>
          <div className='flex  flex-col items-center justify-center gap-2'>
            {drivers.length === 0 && (
              <p className='text-sm font-normal text-[#535353]'>
                No drivers added yet
              </p>
            )}
            <SecondaryButton
              className={`h-7 w-28 rounded-lg border border-[#00ADEF] bg-[#00ADEF] text-xs font-semibold text-white ${drivers.length >= 3 && 'border border-[#D9D9D9] bg-[#F5F5F5] text-[#00000040]'}`}
              onClick={() => {
                setEditingDriver(null);
                setEditingIndex(null);
                setIsShowAdditionDriver(true);
              }}
              disabled={isPending || drivers.length >= 3}
            >
              Add Driver
            </SecondaryButton>
          </div>

          {isShowAdditionDriver && (
            <AdditionDriver
              isShowAdditionDriver={isShowAdditionDriver}
              setIsShowAdditionDriver={setIsShowAdditionDriver}
              setDataDrivers={(newDrivers) => {
                if (editingIndex !== null) {
                  const updated = [...drivers];
                  updated[editingIndex] = newDrivers[0];
                  setDrivers(updated);
                } else {
                  setDrivers([...drivers, newDrivers[0]]);
                }
                setEditingDriver(null);
                setEditingIndex(null);
              }}
              dataDrivers={editingIndex !== null ? [drivers[editingIndex]] : []}
              allDrivers={drivers}
              editingIndex={editingIndex}
              policyStartDate={dayjs(policyStartDate, 'DD/MM/YYYY').toDate()}
            />
          )}
        </div>

        {drivers.length > 0 && (
          <>
            {drivers.map((driver, index) => (
              <div
                className='flex w-full flex-row items-center justify-between border border-[#F0F0F0] p-2'
                key={index}
              >
                <div>
                  <p className='text-sm font-bold'>{driver.name}</p>
                  <p className='text-[11px] font-normal'>
                    {driver.nric_or_fin}
                  </p>
                </div>
                <div className='flex flex-row gap-4'>
                  <span className='text-sm font-bold text-[#000000]'>
                    {' '}
                    {index === 0 ? (
                      'FREE'
                    ) : (
                      <span>+ {formatCurrency(baseFee)}</span>
                    )}
                  </span>
                  <DeleteIcon
                    size={14}
                    onClick={() => handleRemoveAdditionalDriver(driver)}
                  />
                  <IconEditDriver
                    className='cursor-pointer text-brand-blue'
                    size={14}
                    onClick={() => {
                      setEditingDriver(driver);
                      setEditingIndex(index);
                      setIsShowAdditionDriver(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        )}
        <div className='flex flex-row items-center justify-between'>
          <p className='text-[#525252]'>{formatCurrency(totalFee)}</p>
          <SecondaryButton
            className='h-8 w-28 rounded-md border border-[#FD1212] py-0 leading-4 !text-[#FD1212]'
            disabled={isPending}
            onClick={() => setDrivers([])}
          >
            Remove
          </SecondaryButton>
        </div>
      </div>
    </AddOnRow>
  );
}

export default memo(AddonAdditionalDriver);
