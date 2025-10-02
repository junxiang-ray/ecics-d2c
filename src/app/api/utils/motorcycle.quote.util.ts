import { convertDateDash } from './date.helper';

///Helpers to translate
export function getPlanIdfromTitle(quoteInfo: any, planTitle: string): string {
  return (
    quoteInfo?.data?.plans?.find((plan: any) => plan.title === planTitle)
      .code ?? ''
  );
}

const codes: Record<string, string> = {
  MOTORCYCLE_COMP_ME: 'me',
  MOTORCYCLE_COMP_PA: 'pa',
  MOTORCYCLE_COMP_KRC: 'krc',
  MOTORCYCLE_COMP_LOU: 'lou',
  MOTORCYCLE_COMP_RSA: 'rsa',
  MOTORCYCLE_COMP_NFOR: 'nfor',
  MOTORCYCLE_COMP_BUN: 'bun',
  MOTORCYCLE_TPFT_BUN: 'bun',
  MOTORCYCLE_TPO_BUN: 'bun',
};

export function getOptionalBenefitCodes(
  selected_addons: Record<string, string>,
): any {
  return Object.entries(selected_addons)
    .filter(([_, value]) => value === 'YES') // keep only YES
    .map(([key]) => codes[key]);
}

export function formatGender(gender: string): string {
  switch (gender) {
    case 'MALE':
      return 'M';
    case 'FEMALE':
      return 'F';
    default:
      return 'M';
  }
}
export function formatMaritalStatus(status: string): string {
  switch (status) {
    case 'SINGLE':
      return 'S';
    case 'MARRIED':
      return 'M';
    case 'DIVORCED':
      return 'D';
    case 'WIDOWED':
      return 'W';
    default:
      return 'S';
  }
}

export function getPersonalInfo(quoteInfo: any): any {
  const personalInfo = quoteInfo?.data?.personal_info;

  if (personalInfo) {
    return {
      fullName: personalInfo.name || '',
      dateOfBirth: convertDateDash(personalInfo.date_of_birth) || '',
      NRIC: personalInfo.nric || '',
      gender: formatGender(personalInfo.gender) || '',
      maritalStatus: formatMaritalStatus(personalInfo.marital_status) || '',
      addressLine1: personalInfo.address[0] || '',
      addressLine2: personalInfo.address[1] || '',
      addressLine3: personalInfo.address[2] || '',
      postalCode: personalInfo.post_code || '',
      mobile: personalInfo.phone || '',
      email: personalInfo.email || '',
    };
  } else {
    return undefined;
  }
}

export function getVehicleInfo(quoteInfo: any): any {
  const vehicleInfo = quoteInfo?.data?.vehicle_info_selected;

  if (vehicleInfo) {
    return {
      vehRegNumber: vehicleInfo.vehicle_number || '',
      engineNumber: vehicleInfo.engine_number || '',
      chassisNumber: vehicleInfo.chasis_number || '',
    };
  } else {
    return undefined;
  }
}

export function getAdditionalDriverInfo(quoteInfo: any): any {
  const addDriverInfo = quoteInfo?.data?.add_named_driver_info;

  if (addDriverInfo) {
    return {
      hasAdditionalDriver: addDriverInfo.length == 0 ? false : true || false,
      driverDetails:
        addDriverInfo.length == 0
          ? {}
          : {
              driverFullName: addDriverInfo[0].name || '',
              driverNRIC: addDriverInfo[0].nric_or_fin || '',
              driverDob: convertDateDash(addDriverInfo[0].date_of_birth) || '',
              driverGender: formatGender(addDriverInfo[0].gender) || '',
              driverMaritalStatus:
                formatMaritalStatus(addDriverInfo[0].marital_status) || '',
              driverDrivingExp: addDriverInfo[0].driving_experience || '',
            },
    };
  } else {
    return undefined;
  }
}

///
