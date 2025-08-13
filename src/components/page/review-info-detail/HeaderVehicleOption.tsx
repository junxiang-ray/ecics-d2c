import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { VehicleSingPassResponse } from '@/libs/types/auth';
import { capitalizeWords } from '@/libs/utils/utils';

import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { NoInfoModal } from '@/components/page/review-info-detail/modal/NoInfoModal';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { PARTNER_CODE, PROMO_CODE } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { useRequestLog } from '@/hook/insurance/quote';
import { setUserInfoCar } from '@/redux/slices/userInfoCar.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

interface MissingFields {
  engine_number?: boolean;
  chassis_number?: boolean;
  reg_yyyy?: boolean;
  make?: boolean;
  model?: boolean;
}

interface Props {
  vehicles: VehicleSingPassResponse[];
  listAfterSelectedVehicle: VehicleSingPassResponse[];
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
    vehicleNumber: string,
    make: string,
    model: string,
  ) => void;
}

const HeaderVehicleOption: React.FC<Props> = ({
  listAfterSelectedVehicle,
  vehicles,
  isMobile,
  getVehicleTopRow,
  getVehicleBottomRow,
  onVehicleSelect: onVehicleSelect,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const partner_code = localStorage.getItem(PARTNER_CODE);
  const promo_code = localStorage.getItem(PROMO_CODE);

  const carUserInfo = useAppSelector((state) => state.userInfoCar?.userInfoCar);

  const sourceVehicles =
    listAfterSelectedVehicle?.length > 0 ? listAfterSelectedVehicle : vehicles;
  const liveVehicles =
    sourceVehicles?.filter((v) => v.status?.desc === 'LIVE') || [];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    liveVehicles.length === 1 ? 0 : null,
  );
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isVehicleNumberInvalidModal, setIsVehicleNumberInvalidModal] =
    useState(false);

  const { mutate: requestLog } = useRequestLog(PRODUCT_NAME.CAR);

  useEffect(() => {
    if (selectedIndex !== null) return;

    if (liveVehicles.length === 1) {
      setSelectedIndex(0);
      chooseVehicle(liveVehicles[0]);
    } else if (listAfterSelectedVehicle?.length > 0) {
      const selectedNo = carUserInfo?.vehicle_selected?.vehicleno?.value;
      const index = liveVehicles.findIndex(
        (v) => v.vehicleno?.value === selectedNo,
      );
      if (index !== -1) {
        setSelectedIndex(index);
        chooseVehicle(liveVehicles[index]);
      }
    }
  }, [liveVehicles, listAfterSelectedVehicle]);

  const chooseVehicle = (vehicle: VehicleSingPassResponse) => {
    const missing = {
      engine_number: !vehicle.engineno?.value?.trim(),
      chassis_number: !vehicle.chassisno?.value?.trim(),
      reg_yyyy: !vehicle.firstregistrationdate?.value?.toString().trim(),
      make: !vehicle.make?.value?.trim(),
      model: !vehicle.model?.value?.trim(),
    };

    const regDateStr = vehicle.firstregistrationdate?.value;
    const vehicleAge = regDateStr
      ? dayjs().diff(dayjs(regDateStr), 'year')
      : null;

    const vehicleNumber = vehicle.vehicleno?.value;
    const make = vehicle.make?.value;
    const model = vehicle.model?.value;

    const updatedUserInfoCar = {
      ...carUserInfo,
      vehicle_selected: vehicle,
    };
    dispatch(setUserInfoCar(updatedUserInfoCar));

    onVehicleSelect?.(missing, vehicleAge, vehicleNumber, make, model);
  };

  const handleExit = () => {
    setIsVehicleNumberInvalidModal(false);
    router.push(ROUTES.MOTOR.LOGIN);
  };

  const handleContinue = () => {
    requestLog();

    const currentParams = new URLSearchParams(searchParams.toString());
    // Override or add parameters
    currentParams.set('manual', 'true');
    if (promo_code) currentParams.set('promo_code', promo_code);
    if (partner_code) currentParams.set('partner_code', partner_code);

    const queryString = currentParams.toString();

    const basePath = '/motor/insurance/basic-detail';
    router.push(`${basePath}?${queryString}`);
  };

  const getVehicleAge = (vehicle: VehicleSingPassResponse): number | null => {
    const regDateStr = vehicle.firstregistrationdate?.value;
    return regDateStr ? dayjs().diff(dayjs(regDateStr), 'year') : null;
  };

  const isVehicleOver15YearsOld = (vehicle: VehicleSingPassResponse) => {
    const age = getVehicleAge(vehicle);
    return age !== null && age > 15;
  };

  const hasVehicleOver15YearsOld = liveVehicles.some(isVehicleOver15YearsOld);

  return (
    <div className='mt-[32px] w-full'>
      <div className='my-3 text-lg font-bold underline'>
        Choose a Vehicle to insure
      </div>
      {hasVehicleOver15YearsOld && (
        <div className='flex items-center'>
          <WarningTriangleIcon size={25} />
          <div className='ml-[10px] text-justify text-sm font-bold text-[#FF3B30]'>
            We regret to inform you that we are currently unable to provide an
            online motor insurance quote for vehicles that were first registered
            more than 15 years ago.
          </div>
        </div>
      )}
      <div
        className={`mt-[10px] grid gap-y-4 sm:gap-x-6 sm:gap-y-4 ${
          isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'
        }`}
      >
        {liveVehicles.map((vehicle, index) => {
          const isSelected = selectedIndex === index;
          const isExpanded = expandedIndex === index;
          const isOver15y = isVehicleOver15YearsOld(vehicle);

          const topRow = getVehicleTopRow(vehicle);
          const bottomRow = getVehicleBottomRow(vehicle);

          const showTopOnly = isMobile && !isExpanded;

          const topToShow = showTopOnly ? topRow.slice(0, 2) : topRow;
          const bottomToShow = showTopOnly ? [] : bottomRow;

          return (
            <div
              key={index}
              className={`rounded-md border shadow-sm ${
                isOver15y
                  ? 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-60'
                  : isSelected
                    ? 'border-[#00ADEF] bg-white'
                    : 'border-gray-300 bg-white'
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
                  type='button'
                  disabled={isOver15y}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-[2px] ${
                    isOver15y
                      ? 'border-gray-400 bg-gray-200'
                      : 'border-[#00ADEF] bg-white'
                  }`}
                  onClick={() => {
                    if (isOver15y) return;
                    setSelectedIndex(index);
                    chooseVehicle(vehicle);
                  }}
                >
                  {isSelected && !isOver15y && (
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
      <NoInfoModal
        visible={isVehicleNumberInvalidModal}
        title='Vehicle Information Not Found'
        onExit={handleExit}
        onContinue={handleContinue}
        description='unable to detect a registered vehicle under your name.'
      />
    </div>
  );
};

export default HeaderVehicleOption;
