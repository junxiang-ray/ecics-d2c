export interface LoginResponse {
  state: string;
  nonce: string;
  code_verifier: string;
  url: string;
}

export interface UserInfoPayload {
  nonce: string;
  code_verifier: string;
  state: string;
}

export interface SavePersonalInfoPayload {
  key: string;
  personal_info: {
    name: string;
    gender: string;
    marital_status: string;
    nric?: string;
    address: string[];
    date_of_birth: string;
    year_of_registration: string;
    driving_experience: number;
    phone_number: string;
    email: string;
  };
  vehicle_info_selected: {
    vehicle_make: string;
    vehicle_model: string;
    first_registered_year: string;
    chasis_number: string;
  };
  vehicles: Vehicle[];
}

export interface Vehicle {
  chasis_number: string;
  vehicle_make: string;
  vehicle_model: string;
  first_registered_year: string;
}
