import { Address, Gender, PaginationMetaData } from '@/libs/types/common';
import { UserInfo } from 'node:os';

export type UserProfileResponse = {
  data: UserProfile;
  meta: any;
};

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
