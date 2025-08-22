import { MOTOR_INSURANCE } from '@/app/api/constants/motor.renewal';
import { retrievePolicyDTO } from './retrieve-policy.dto';
import { handleApiCallToISP } from '@/app/api/configs/api.config';
import logger from '@/app/api/libs/logger';
import { ErrFromISPRes } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';

export async function retrievePoliciesFromISP(data: retrievePolicyDTO) {
  try {
    const payloadData = {
      nric: data.nric,
    };

    const retrievePoliciesRes = await handleApiCallToISP(
      `${MOTOR_INSURANCE.PREFIX_ENDPOINT}/retrieve_renewal`,
      payloadData,
    );

    logger.info(
      `Received response from ISP for retrieve renewal: ${JSON.stringify(retrievePoliciesRes)}`,
    );

    if (retrievePoliciesRes.status === 0) {
      return successRes({
        message: 'Policies retrieved successfully',
        data: retrievePoliciesRes?.data || [],
      });
    }

    return ErrFromISPRes(
      retrievePoliciesRes?.txt || 'Failed to retrieve policies from ISP',
    );
  } catch (error) {
    logger.error(`Failed to retrieve policies from ISP: ${error}`);
    throw new Error('Failed to retrieve policies from ISP');
  }
}
