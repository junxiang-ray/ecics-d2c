import { MOTOR_RENEWAL } from '@/app/api/constants/motor.renewal';
import { updatePolicyDTO } from './update-policy.dto';
import { handleApiCallToISP } from '@/app/api/configs/api.config';
import logger from '@/app/api/libs/logger';
import { ErrFromISPRes } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';

export async function updatePoliciesFromISP(data: updatePolicyDTO) {
  try {
    const payloadData = {
      policy_id: data.policy_id,
      proposal_id: data.proposal_id,
      veh_reg_no: data.veh_reg_no,
      passphrase: data.passphrase,
      email_address: data.email_address,
      contact_no: data.contact_no,
      renewal_end_date: data.renewal_end_date,
      selected_add_on_optional_benefits:
        data?.selected_add_on_optional_benefits || [],
      finalize_renewal: data?.finalize_renewal || false,
      redirect_url: process.env.RENEWAL_REDIRECT_PAYMENT_WEBSITE || '',
      return_baseurl: process.env.RENEWAL_CALLBACK_PAYMENT_URL || '',
    };

    const updatePolicyRes = await handleApiCallToISP(
      `${MOTOR_RENEWAL.PREFIX_ENDPOINT}/edit_renewal`,
      payloadData,
    );

    logger.info(
      `Received response from ISP for update renewal: ${JSON.stringify(updatePolicyRes)}`,
    );

    if (updatePolicyRes.status === 0) {
      return successRes({
        message: 'Policy renewal updated successfully',
        data: updatePolicyRes?.data,
      });
    }

    return ErrFromISPRes(
      updatePolicyRes?.text || 'Failed to update policy renewal',
    );
  } catch (error) {
    logger.error(`Failed to update policy renewal from ISP: ${error}`);
    throw new Error('Failed to update policy renewal from ISP');
  }
}
