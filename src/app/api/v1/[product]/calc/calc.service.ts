import { handleApiCallToISP } from '@/app/api/configs/api.config';
import { HOMECONTENT_INSURANCE } from '@/app/api/constants/homecontent.insurance';
import { ErrFromISPRes } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { InsurancePlan } from '@/libs/types/homeContents';
import { KEYS, response } from './payload';

export async function getCalcHomeContents(data: any) {
  try {
    const payloadData = {
      inputs: {
        [KEYS.homeType]: data.homeType,
        [KEYS.unitType]: data.unitType,
        [KEYS.homeOwnership]: data.homeOwnership,
        [KEYS.renovations]: data.renovations,
        [KEYS.homeContents]: data.homeContents,
        [KEYS.promoCode]: data.promoCode != '' ? data.promoCode : 'NA',
        [KEYS.selectedPlan]: '1 Year',
      },
    };

    logger.info(`payload data to send ISP ${JSON.stringify(payloadData)}`);
    ///Change to use .env file
    const getQuoteRes = await handleApiCallToISP(
      `/product/calc/M000000000052/premium_calc`,
      payloadData,
    );

    logger.info(
      `Response from calculate premium for Home Contents: ${JSON.stringify(getQuoteRes)}`,
    );
    ///add your mapping here to return to step1
    // const alldata = {
    //     plans:{

    //     },
    //     coverage:{

    //     }
    // }

    ///Set to plans
    const plans: InsurancePlan[] = [
      {
        id: '1-year',
        name: '1 Year',
        originalPrice: getQuoteRes.data.cells[response.year1Premb4GST],
        discountedPrice: getQuoteRes.data.cells[response.year1Premb4GST], // No discount for 1-year
        discount: 0,
        isPopular: false,
        coverage: {
          contents: 50000,
          personalAccident: 30000,
          personalLiability: 1000000,
          alternativeAccommodation: 5000,
          lossOfRent: 3000,
          tenantLiability: 20000,
        },
        features: [
          'Contents coverage up to $50,000',
          'Personal accident protection up to $30,000',
          'Personal liability coverage up to $1,000,000',
          'Alternative accommodation up to $5,000',
          'Loss of rent coverage up to $3,000',
          '24/7 customer support hotline',
          'Fast-track claims processing',
          'Worldwide coverage for personal belongings',
        ],
        highlights: ['Full coverage', 'Annual renewal', 'Flexible terms'],
      },
      {
        id: '3-year',
        name: '3 Year',
        originalPrice: getQuoteRes.data.cells[response.year3Premb4GST],
        discountedPrice: getQuoteRes.data.cells[response.year3Premb4GST], // No discount for 1-year
        discount: 0,
        isPopular: false,
        coverage: {
          contents: 50000,
          personalAccident: 30000,
          personalLiability: 1000000,
          alternativeAccommodation: 5000,
          lossOfRent: 3000,
          tenantLiability: 20000,
        },
        features: [
          'Contents coverage up to $50,000',
          'Personal accident protection up to $30,000',
          'Personal liability coverage up to $1,000,000',
          'Alternative accommodation up to $5,000',
          'Loss of rent coverage up to $3,000',
          '24/7 customer support hotline',
          'Fast-track claims processing',
          'Worldwide coverage for personal belongings',
        ],
        highlights: ['Full coverage', 'Annual renewal', 'Flexible terms'],
      },
    ];

    if (getQuoteRes.status === 0) {
      return successRes({
        data: plans,
        message: 'Premium get',
      });
    }

    return ErrFromISPRes(
      getQuoteRes?.txt || 'Error generate quote for home content',
    );
  } catch (error) {
    logger.error(`Error generate quote for home content: ${error}`);
    throw new Error('Error generate quote for home content');
  }
}
