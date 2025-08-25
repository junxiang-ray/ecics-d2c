import { MOTOR_RENEWAL } from '@/app/api/constants/motor.renewal';
import { handleApiCallToISP } from '@/app/api/configs/api.config';
import logger from '@/app/api/libs/logger';
import { ErrFromISPRes } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import { checkPolicyDTO } from './check-policy.dto';

export async function checkPolicyFromISP(data: checkPolicyDTO) {
  try {
    const payloadData = {
      veh_reg_no: data.veh_reg_no,
      passphrase: data.passphrase,
      redirect_url: process.env.RENEWAL_REDIRECT_PAYMENT_WEBSITE || '',
      return_baseurl: process.env.RENEWAL_CALLBACK_PAYMENT_URL || '',
    };

    logger.info(`Checking policy with payload: ${JSON.stringify(payloadData)}`);

    const renewalPolicyRes = await handleApiCallToISP(
      `${MOTOR_RENEWAL.PREFIX_ENDPOINT}/check_renewal`,
      payloadData,
    );

    logger.info(
      `Received response from ISP for check renewal: ${JSON.stringify(renewalPolicyRes)}`,
    );

    if (renewalPolicyRes.status === 0) {
      return successRes({
        message: 'Policy checked successfully',
        data: renewalPolicyRes?.data,
      });
    }

    return ErrFromISPRes(
      renewalPolicyRes?.txt || 'Failed to check policy from ISP',
    );
  } catch (error) {
    logger.error(`Failed to check policy from ISP: ${error}`);
    throw new Error('Failed to check policy from ISP');
  }
}
