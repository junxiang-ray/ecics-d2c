import { RESTRICTED_VEHICLE_MAKES } from '@/constants/general.constant';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export const useBlockedByMakeYear = (
  vehicle_make: string,
  regYear: string | undefined,
  setShowCSModal: (value: { visible: boolean; description: string }) => void,
) => {
  return useMemo(() => {
    if (!vehicle_make || !regYear) return false;

    const currentYear = String(dayjs().year());
    const normalizedMake = vehicle_make.toLowerCase();

    const blocked =
      RESTRICTED_VEHICLE_MAKES.includes(normalizedMake) &&
      regYear === currentYear;

    if (blocked) {
      setShowCSModal({
        visible: true,
        description:
          'We are unable to provide a quotation for this brand new car.',
      });
    }

    return blocked;
  }, [vehicle_make, regYear, setShowCSModal]);
};
