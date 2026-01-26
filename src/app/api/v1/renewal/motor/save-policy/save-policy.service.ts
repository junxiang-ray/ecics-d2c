import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

import { savePolicyDTO } from './save-policy.dto';

export async function savePolicyFromISP(bodyData: savePolicyDTO) {
  try {
    logger.info(`Saving renewal policy with data: ${JSON.stringify(bodyData)}`);
    const renewalData = await prisma.renewalInfo.upsert({
      where: {
        proposal_id: bodyData.proposal_id,
      },
      update: {
        ...bodyData,
      },
      create: {
        ...bodyData,
      },
    });

    if (renewalData) {
      return successRes({
        message: 'Policy saved successfully',
        data: renewalData,
      });
    }
  } catch (error) {
    logger.error(`Error saving policy: ${error}`);
    throw new Error('Failed to save policy');
  }
}
