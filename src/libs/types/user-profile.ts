import { Address, Gender, PaginationMetaData } from '@/libs/types/common';

export type UserProfileUpdatePayload = {
  address: Address;
  email: string;
  phone: string;
  marital_status: string;
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
