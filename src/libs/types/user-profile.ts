import { Address, Gender, PaginationMetaData } from '@/libs/types/common';

export type UserProfileResponse = {
  data: UserProfile;
};

export type UserProfile = {
  name: string;
  nric: string;
  email: string;
  gender: Gender;
  address: Address;
  phone: string;
  date_of_birth: string;
  marital_status: string;
  nationality?: string;
};
