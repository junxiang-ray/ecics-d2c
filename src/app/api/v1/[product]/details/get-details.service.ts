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
      property_type_input_id: nameMap.property_type,
      ownership_input_id: nameMap.ownership,
      unit_type_input_id: nameMap.unit_type,
      policy_start_date_input_id: nameMap.policy_start_date,
      policy_period_input_id: nameMap.policy_period,
      promo_code_input_id: nameMap.promo_code,
      renovations_si_input_id: nameMap.renovations_si,
      contents_si_input_id: nameMap.contents_si,
      building_si_input_id: nameMap.building_si,
      worldwide_fpa_input_id: nameMap.worldwide_fpa,
      selected_plan_input_id: nameMap.selected_plan,
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
