import {
  handleApiCallToISP,
  handleGetApiCallToISP,
} from '@/app/api/configs/api.config';
import { HOMECONTENT_INSURANCE } from '@/app/api/constants/homecontent.insurance';
import { ErrFromISPRes } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import { InsurancePlan } from '@/libs/types/homeContents';

export async function getDetailsHomeContents() {
  try {
    const getQuoteRes = await handleGetApiCallToISP(`/product/M000000000052`);
    logger.info(
      `get: ${JSON.stringify(getQuoteRes.data[0].premium_calc.namemap)}`,
    );

    ///Map values and store locally
    const nameMap = getQuoteRes.data[0].premium_calc.namemap;
    const idMap = getQuoteRes.data[0].premium_calc.idmap;

    const resultMap = {
      promo_code_input_id: nameMap.promo_code,
      property_type_input_id: nameMap.property_type,
    };

    ///can store resultMap locally and return blank

    if (getQuoteRes.status === 0) {
      return successRes({
        data: resultMap,
        message: 'Product Details',
      });
    }

    return ErrFromISPRes(getQuoteRes?.txt || 'Error fetch product details');
  } catch (error) {
    logger.error(`Error fetch product details: ${error}`);
    throw new Error('Error fetch product details');
  }
}
