import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

import { paymentDTO } from './payment-result.dto';

export async function handlePaymentResult(data: paymentDTO) {
  logger.info(`Handling payment renewal with data: ${JSON.stringify(data)}`);
  try {
    const { policy_id, policy_no } = data;
    logger.info(
      `Processing payment for policy_id: ${policy_id}, policy_no: ${policy_no}`,
    );

    const result = await prisma.paymentResult.create({
      data: { policy_id, policy_no },
    });
    logger.info(`Payment created record: ${JSON.stringify(result)}`);

    const renewalInfo = await prisma.renewalInfo.update({
      where: { policy_id: policy_id },
      data: {
        is_paid: true,
      },
    });
    logger.info(`Renewal info updated: ${JSON.stringify(renewalInfo)}`);

    return successRes({
      message: 'Payment renewal processed successfully ',
      data: '',
    });
  } catch (error) {
    logger.error(`Payment renewal result handling failed: ${error}`);
    throw new Error('Failed to handle payment renewal result');
  }
}
