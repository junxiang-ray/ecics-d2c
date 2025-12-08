import type { AxiosResponse } from 'axios';
import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import {
  API_LOGIN,
  API_RETRIVE_NRIC_SINGPASS_RENEWAL,
} from '@/constants/api.constant';

import axiosClient from './api.config';

const REQ_LOGIN_SINGPASS = {
  // api: 'https://ecics-v2-dev.tdt.asia/api/v1/singpass/login/car',
  // response: {
  //     "message": "Login URL generated successfully",
  //     "data": {
  //         "url": "https://stg-id.singpass.gov.sg/auth?client_id=XlC0mVynZGotrzeLK0Yk4ZXqeml2dJCg&scope=dob%20email%20marital%20mobileno%20name%20openid%20regadd%20sex%20uinfin%20vehicles.chassisno%20vehicles.engineno%20vehicles.firstregistrationdate%20vehicles.make%20vehicles.model%20vehicles.vehicleno%20vehicles.yearofmanufacture%20vehicles.status%20vehicles.enginecapacity%20vehicles.powerrate%20drivinglicence.qdl.expirydate%20drivinglicence.qdl.validity%20drivinglicence.qdl.classes&response_type=code&redirect_uri=https%3A%2F%2Fecics-v2-dev.tdt.asia%2Fmotor%2Freview-info-detail&code_challenge_method=S256&code_challenge=YFrZpTlZm5zcgHQfCo-6ow1Y8CGhvhxrTy8UN2-RhnA&nonce=03c87112-8079-4c0e-a267-658c12588f70&state=afcf1a62683fb03c8dfb7e464bdc9979",
  //         "code_verifier": "K0x6XS01qBUxiEsa0YrznFMtoYQ9RZkEMG5-KP31pvU",
  //         "nonce": "03c87112-8079-4c0e-a267-658c12588f70",
  //         "state": "afcf1a62683fb03c8dfb7e464bdc9979"
  //     }
  // }
};
const REQ_USER_INFO = {
  // api: 'https://ecics-v2-dev.tdt.asia/api/v1/singpass/user-info/car',
  // reponse: {
  //     "message": "User info retrieved successfully",
  //     "data": {
  //         "iss": "https://stg-id.singpass.gov.sg",
  //         "sub": "u=b5a1144b-5784-4207-9fad-96e8a914c488",
  //         "aud": "XlC0mVynZGotrzeLK0Yk4ZXqeml2dJCg",
  //         "iat": 1764665391,
  //         "dob": {
  //             "lastupdated": "2025-06-03",
  //             "source": "1",
  //             "classification": "C",
  //             "value": "1960-04-16"
  //         },
  //         "email": {
  //             "lastupdated": "2025-06-03",
  //             "source": "4",
  //             "classification": "C",
  //             "value": "myinfotesting@gmail.com"
  //         },
  //         "marital": {
  //             "lastupdated": "2025-06-03",
  //             "code": "2",
  //             "source": "1",
  //             "classification": "C",
  //             "desc": "MARRIED"
  //         },
  //         "mobileno": {
  //             "lastupdated": "2025-06-03",
  //             "source": "4",
  //             "classification": "C",
  //             "areacode": {
  //                 "value": "65"
  //             },
  //             "prefix": {
  //                 "value": "+"
  //             },
  //             "nbr": {
  //                 "value": "97399245"
  //             }
  //         },
  //         "name": {
  //             "lastupdated": "2025-06-03",
  //             "source": "1",
  //             "classification": "C",
  //             "value": "FREYA LIM GUO EN"
  //         },
  //         "regadd": {
  //             "country": {
  //                 "code": "SG",
  //                 "desc": "SINGAPORE"
  //             },
  //             "unit": {
  //                 "value": "367"
  //             },
  //             "street": {
  //                 "value": "JURONG EAST STREET 21"
  //             },
  //             "lastupdated": "2025-06-03",
  //             "block": {
  //                 "value": "288A"
  //             },
  //             "source": "1",
  //             "postal": {
  //                 "value": "601288"
  //             },
  //             "classification": "C",
  //             "floor": {
  //                 "value": "8"
  //             },
  //             "type": "SG",
  //             "building": {
  //                 "value": ""
  //             }
  //         },
  //         "sex": {
  //             "lastupdated": "2025-06-03",
  //             "code": "M",
  //             "source": "1",
  //             "classification": "C",
  //             "desc": "MALE"
  //         },
  //         "uinfin": {
  //             "lastupdated": "2025-06-03",
  //             "source": "1",
  //             "classification": "C",
  //             "value": "S7790708D"
  //         },
  //         "vehicles": [],
  //         "drivinglicence": {
  //             "qdl": {
  //                 "expirydate": {
  //                     "value": ""
  //                 },
  //                 "validity": {
  //                     "code": "V",
  //                     "desc": "VALID"
  //                 },
  //                 "classes": [
  //                     {
  //                         "class": {
  //                             "value": "3"
  //                         },
  //                         "issuedate": {
  //                             "value": "2018-06-06"
  //                         }
  //                     }
  //                 ]
  //             },
  //             "lastupdated": "2025-06-03",
  //             "source": "1",
  //             "classification": "C"
  //         }
  //     }
  // }
};

// step:
// 1 - call SINPASS API => navigate to the url from the response.
// 2 - Auth success => fallback to login
//          => call api user-info with code from url param and code_verifier, nonce, and state from REQ_LOGIN => success => save code to cookie & update userInfo => redirect to home screen

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestSignInSingpass(): Promise<AxiosResponse<LoginResponse>> {
    return axiosClient.get<LoginResponse>(
      `${API_LOGIN}/${PRODUCT_NAME.PORTAL}`,
    );
  },
  retriveNricSingpass({
    payload,
  }: {
    payload: UserInfoPayload;
  }): Promise<AxiosResponse<unknown>> {
    return axiosClient.post<any>(API_RETRIVE_NRIC_SINGPASS_RENEWAL, payload);
  },
};
