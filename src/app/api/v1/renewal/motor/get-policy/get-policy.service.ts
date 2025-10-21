import { ErrNotFound } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

export async function fetchPolicyFromISP(key: string) {
  try {
    logger.info(`Fetching renewal policy with key: ${JSON.stringify(key)}`);
    const renewalData = await prisma.renewalInfo.findFirst({
      where: {
        key: key,
      },
      select: {
        id: true,
        proposal_id: true,
        renewal_data: true,
      },
    });

    logger.info(`Fetched renewal data: ${JSON.stringify(renewalData)}`);
    if (!renewalData) {
      return ErrNotFound('Renewal policy not found');
    }

    return successRes({
      message: 'Renewal data fetched successfully',
      data: renewalData,
    });
  } catch (error) {
    logger.error(`Error fetching renewal policy: ${error}`);
    throw new Error('Failed to fetch renewal policy data');
  }
}
