import { PrismaClient } from '@prisma/client';
import logger from '@/app/api/libs/logger';

const prisma = new PrismaClient();

export async function getQuoteByKey(key: string) {
  try {
    const quote = await prisma.quote.findFirst({
      where: {
        key,
      },
      include: {
        promo_code: {
          select: {
            code: true,
            discount: true,
            startTime: true,
            endTime: true,
            description: true,
            products: true,
            isPublic: true,
            isShowCountdown: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        personal_info: {
          select: {
            id: true,
            phone: true,
            email: true,
            name: true,
            gender: true,
            nric: true,
            maritalStatus: true,
            dateOfBirth: true,
            address: true,
            vehicleMake: true,
            vehicleModel: true,
            yearOfRegistration: true,
            vehicles: true,
          },
        },
        country_nationality: {
          select: {
            id: true,
            name: true,
          },
        },
        product_type: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        quote_res_from_ISP: true,
      },
    });

    if (!quote) {
      logger.info(`Quote with key ${key} not found`);
      return {
        message: 'Quote not found',
        data: null,
      };
    }

    logger.info(`Quote with key ${key} found: ${JSON.stringify(quote)}`);

    // Remove quoteResFromISP in response before returning to the client
    if (
      quote?.data &&
      typeof quote.data === 'object' &&
      'quoteResFromISP' in quote.data
    ) {
      delete quote.data.quoteResFromISP;
    }

    return {
      message: 'Quote found',
      data: quote,
    };
  } catch (error) {
    logger.error(`Error occurred while getting quote by key: ${error}`);
    return {
      message: 'Internal server error',
      data: null,
    };
  }
}
