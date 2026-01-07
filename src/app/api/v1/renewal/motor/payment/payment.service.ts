import { MOTOR_RENEWAL } from '@/app/api/constants/motor.renewal';
import { handleApiCallToISP } from '@/app/api/configs/api.config';
import logger from '@/app/api/libs/logger';
import { ErrFromISPRes } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import { paymentPolicyDTO } from './payment.dto';

export async function paymentPolicyFromISP(data: paymentPolicyDTO) {
  try {
    const payloadData = {
      email_address: data.email_address,
      contact_no: data.contact_no,
      proposal_id: data.proposal_id,
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      address_line3: data.address_line3,
      postal: data.postal,
      maritalstatuscode: data.marital_status_code,
    };

    const paymentPolicyRes = await handleApiCallToISP(
      `${MOTOR_RENEWAL.PREFIX_ENDPOINT}/payment_renewal`,
      payloadData,
    );

    logger.info(
      `Payment policy response from ISP: ${JSON.stringify(paymentPolicyRes)}`,
    );

    if (paymentPolicyRes.status === 0) {
      return successRes({
        message: 'Payment policy successfully',
        data: paymentPolicyRes?.data,
      });
    }

    return ErrFromISPRes(
      paymentPolicyRes?.txt || 'Failed to retrieve payment policy',
      paymentPolicyRes?.status,
    );
  } catch (error) {
    logger.error(`Failed to retrieve payment from ISP: ${error}`);
    throw new Error('Failed to retrieve payment from ISP');
  }
}
