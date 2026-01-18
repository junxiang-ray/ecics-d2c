import axios from 'axios';

import logger from '../libs/logger';

const TOKEN_EXPIRED_STATUS = -114;
const TOKEN_NOT_FOUND_STATUS = -106;
let token = '';

// Create axios instance with base URL and headers
const apiServer = axios.create({
  baseURL: process.env.ISP_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Refresh token function
async function refreshToken() {
  try {
    const email = process.env.ISP_EMAIL;
    const mpwd = process.env.ISP_MPWD;
    const response = await axios.post(`${process.env.ISP_API_URL}/auth`, {
      email,
      mpwd,
    });
    token = response.data.data.token;
    logger.info(`Token refreshed successfully: ${token}`);
    return token;
  } catch (error) {
    logger.error(`Error refreshing token: ${error}`);
    throw error;
  }
}

// Add request interceptor
apiServer.interceptors.request.use(
  async (config) => {
    if (token) {
      config.headers['In-Auth-Token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor
apiServer.interceptors.response.use(
  (response) => {
    if (
      response.data.status === TOKEN_EXPIRED_STATUS ||
      response.data.status === TOKEN_NOT_FOUND_STATUS
    ) {
      logger.warn('Token expired or not found. Refreshing...');
      return refreshToken().then((newToken) => {
        response.config.headers.Authorization = `Bearer ${newToken}`;
        return apiServer(response.config);
      });
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

function flattenBody(body: any) {
  const { proposerDetails, planDetails } = body;

  return {
    //the product id is included in the isp
    ownership: planDetails.homeOwnership,
    property_type: planDetails.homeType,
    unit_type: planDetails.unitType,
    contents_si: planDetails.homeContentCoverage,
    renovations_si: planDetails.renovationsCoverage,
    building_si: planDetails.buildingCoverage,
    family_pa_si: planDetails.wpaCoverage,
    selected_plan: planDetails.selectedPlan,
    policy_period: planDetails.policyPeriod,
    policy_start_date: planDetails.startDate,
    promo_code: planDetails.promoCode,

    insured_address_line1: proposerDetails.addressLine1,
    insured_address_line2: proposerDetails.addressLine2,
    insured_address_line3: proposerDetails.addressLine3,
    insured_post_code: proposerDetails.postCode,

    proposer_name: proposerDetails.name,
    proposer_nric: proposerDetails.nric,
    proposer_date_of_birth: proposerDetails.dob,
    proposer_gender: proposerDetails.gender,
    proposer_marital_status: proposerDetails.maritalStatus,
    proposer_mobile: proposerDetails.mobile,
    email: proposerDetails.email,

    different_mailing_address: proposerDetails.differentMailingAddress,
    mailing_address_line1: proposerDetails.mailingAddress1,
    mailing_address_line2: proposerDetails.mailingAddress2,
    mailing_address_line3: proposerDetails.mailingAddress3,
    mailing_post_code: proposerDetails.mailingPostCode,
    __finalize: body.__finalize,
  };
}

export async function handleApiCallToISP(endpoint: string, body: any) {
  const url = `${process.env.ISP_API_URL}${endpoint}`;
  logger.info(`[DEBUG] url debug ${url}`);
  logger.info(`[DEBUG] endpoint debug ${endpoint}`);

  // logger.info(`[DEEEBUG] type of dob ${body.proposerDetails.do}`)
  const headers = { 'In-Auth-Token': token };
  try {
    logger.info(`[DEBUG] TOKEN PRINT OUT ${token}`);

    // const ispBody = flattenBody(body);
    // logger.info(`[OUTPUT] flattend body ${ispBody}`);
    //don't need to flatten cuz the isp side has already done
    // logger.info(`payload date data ${body.proposerDetails.dob}`);
    // logger.info(`type of dob and start date ${typeof(body.proposerDetails.dob)}`)
    logger.info(
      `Calling ISP service ${url} with body: ${JSON.stringify(body, null, 2)}`,
    );
    //BODY IS NOT UNDEFINED UNTIL HERE (BODY HAS DATA)
    let response = await axios.post(url, body, { headers }); //authentication check to the ISP
    //it failed here
    logger.info(
      `InsillionService.handleApiCall: [FAILING POINT] Response from ${url}: ${JSON.stringify(response.data, null, 2)}`,
    );

    // Check if token is expired
    if (
      response.data.status === TOKEN_EXPIRED_STATUS ||
      response.data.status === TOKEN_NOT_FOUND_STATUS
    ) {
      logger.info(
        `InsillionService.handleApiCall: Token ${token} is expired or not found. Refreshing token...`,
      );

      await refreshToken();
      logger.info(
        `InsillionService.handleApiCall: Retrying ${url} with new token: ${token}`,
      );

      logger.info(
        `[DEBUG ANOTHER FAILING POINT]  BEFORE GETTING RESP FROM INSILLION ${body}`,
      );
      response = await axios.post(url, body, {
        headers: { 'In-Auth-Token': token },
      });
      logger.info(
        `InsillionService.handleApiCall: Response from ${url}: ${JSON.stringify(response.data)}`,
      );
    }

    return response.data;
  } catch (error) {
    logger.error(
      `InsillionService.handleApiCall: Error calling ${url}: `,
      error,
    );
    throw error;
  }
}

export async function handleGetApiCallToISP(endpoint: string) {
  const url = `${process.env.ISP_API_URL}${endpoint}`;
  const headers = { 'In-Auth-Token': token };
  try {
    logger.info(`Calling ISP service ${url}}`);
    let response = await axios.get(url, {
      headers: { 'In-Auth-Token': token },
    });
    // logger.info(
    //   `InsillionService.handleApiCall: Response from ${url}: ${JSON.stringify(response.data)}`,
    // );

    // Check if token is expired
    if (
      response.data.status === TOKEN_EXPIRED_STATUS ||
      response.data.status === TOKEN_NOT_FOUND_STATUS
    ) {
      logger.info(` << TOKEN REFRESHING UPON EXPIRATION >>`);
      logger.info(
        `InsillionService.handleApiCall: Token ${token} is expired or not found. Refreshing token...`,
      );

      await refreshToken();
      logger.info(
        `InsillionService.handleApiCall: Retrying ${url} with new token: ${token}`,
      );

      response = await axios.get(url, {
        headers: { 'In-Auth-Token': token },
      });
      logger.info(
        `InsillionService.handleApiCall: Response from ${url}: ${JSON.stringify(response.data, null, 2)}`,
      );
    }

    return response.data;
  } catch (error) {
    logger.error(
      `InsillionService.handleApiCall: Error calling ${url}: `,
      error,
    );
    throw error;
  }
}
export default apiServer;
