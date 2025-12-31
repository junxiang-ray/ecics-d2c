import { handleApiCallToISP } from '@/app/api/configs/api.config';
import { HOMECONTENT_INSURANCE } from '@/app/api/constants/homecontent.insurance';
import { ErrFromISPRes } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import {
  HomeContentQuoteCreationPayload,
  InsurancePlan,
} from '@/libs/types/homeContents';
import { KEYS, response } from './payload';
import { get } from 'http';

export async function getCalcHomeContents(
  data: HomeContentQuoteCreationPayload,
) {
  try {
    const map = data.resultMap;

    // use to map IDs in result map. if it doesnt exist, fallback to KEYS
    const getId = (mapKey: string, fallbackKey: string) => {
      return map?.[mapKey as keyof typeof map] || fallbackKey;
    };

    const payloadData = {
      inputs: {
        [getId('property_type_input_id', KEYS.homeType)]: data.homeType,
        [getId('unit_type_input_id', KEYS.unitType)]: data.unitType,
        [getId('ownership_input_id', KEYS.homeOwnership)]: data.homeOwnership,
        [getId('renovations_si_input_id', KEYS.renovations)]: data.renovations,
        [getId('contents_si_input_id', KEYS.homeContents)]: data.homeContents,

        // Use provided add-on values when present, otherwise defaults
        [getId('promo_code_input_id', KEYS.promoCode)]:
          data.promoCode != '' ? data.promoCode : 'NA',
        [getId('selected_plan_input_id', KEYS.selectedPlan)]: '1 Year',
        [getId('worldwide_fpa_input_id', KEYS.worldwideFpa)]:
          data.worldwideFpa ?? 'NA',

        [getId('building_input_id', KEYS.building)]: data.building ?? 'SGD 0',
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

    const plans: InsurancePlan[] = [
      {
        id: '1 Year',
        name: '1 Year',
        originalPrice:
          getQuoteRes.data.cells[response.year1Premb4GSTNoAddOnDiscounted],
        discountedPrice:
          getQuoteRes.data.cells[response.year1Premb4GSTNoAddOnDiscounted], // No discount for 1-year
        discount: 0,
        isPopular: false,
        coverage: {
          renovations: getQuoteRes.data.cells[response.renovationsCoverage],

          renovationsFixturesDebris:
            getQuoteRes.data.cells[response.renovationsFixturesDebrisCoverage],

          renovationsProfessionalFees:
            getQuoteRes.data.cells[
              response.renovationsProfessionalFeesCoverage
            ],

          contents: getQuoteRes.data.cells[response.contentsTotalCoverage],

          // valuables may be descriptive; keep raw
          contentsValuables:
            getQuoteRes.data.cells[response.contentsValuablesCoverage],

          contentsCash: getQuoteRes.data.cells[response.contentsCashCoverage],

          alternativeAccommodation:
            getQuoteRes.data.cells[response.alternativeAccommodationCoverage],

          incidentalExpensesOrEmergencyCashAllowance:
            getQuoteRes.data.cells[
              response.incidentalExpensesOrEmergencyCashAllowanceCoverage
            ],

          accidentalBreakageOfMirrorOrFixedGlass:
            getQuoteRes.data.cells[
              response.accidentalBreakageOfMirrorOrFixedGlassCoverage
            ],

          petDogOrCatCover:
            getQuoteRes.data.cells[response.petDogOrCatCoverage],

          accidentalDamageOfEVCharger:
            getQuoteRes.data.cells[
              response.accidentalDamageOfEVChargerCoverage
            ],

          accidentalDamageOfSolarPanels:
            getQuoteRes.data.cells[
              response.accidentalDamageOfSolarPanelsCoverage
            ],

          emergencyHomeAssistance:
            getQuoteRes.data.cells[response.emergencyHomeAssistanceCoverage],

          tenantsLiability:
            getQuoteRes.data.cells[response.tenantsLiabilityCoverage],

          lossOfRentalAfterInsuredEvent:
            getQuoteRes.data.cells[
              response.lossOfRentalAfterInsuredEventCoverage
            ],

          buildingCoverage: getQuoteRes.data.cells[response.buildingCoverage],

          personalWorldwideFPA:
            getQuoteRes.data.cells[response.personalWorldwideFPACoverage],
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
        buildingCoverageNoDiscount:
          getQuoteRes.data.cells[response.buildingAddOnPrice1YearNoDiscount],
        buildingCoverageWithDiscount:
          getQuoteRes.data.cells[response.buildingAddOnPrice1YearWithDiscount],

        worldwideFpaNoDiscount:
          getQuoteRes.data.cells[
            response.worldwideFpaAddOnPrice1YearNoDiscount
          ],
        worldwideFpaWithDiscount:
          getQuoteRes.data.cells[
            response.worldwideFpaAddOnPrice1YearWithDiscount
          ],

        totalPricePlanB4GST: getQuoteRes.data.cells[response.year1Premb4GST],
        totalPricePlan: getQuoteRes.data.cells[response.year1Prem],
      },
      {
        id: '3 Years',
        name: '3 Years',
        originalPrice:
          getQuoteRes.data.cells[response.year3Premb4GSTNoAddOnDiscounted],
        discountedPrice:
          getQuoteRes.data.cells[response.year3Premb4GSTNoAddOnDiscounted], // No discount for 1-year
        discount: 0,
        isPopular: false,
        coverage: {
          renovations: getQuoteRes.data.cells[response.renovationsCoverage],

          renovationsFixturesDebris:
            getQuoteRes.data.cells[response.renovationsFixturesDebrisCoverage],

          renovationsProfessionalFees:
            getQuoteRes.data.cells[
              response.renovationsProfessionalFeesCoverage
            ],

          contents: getQuoteRes.data.cells[response.contentsTotalCoverage],

          // valuables may be descriptive; keep raw
          contentsValuables:
            getQuoteRes.data.cells[response.contentsValuablesCoverage],

          contentsCash: getQuoteRes.data.cells[response.contentsCashCoverage],

          alternativeAccommodation:
            getQuoteRes.data.cells[response.alternativeAccommodationCoverage],

          incidentalExpensesOrEmergencyCashAllowance:
            getQuoteRes.data.cells[
              response.incidentalExpensesOrEmergencyCashAllowanceCoverage
            ],

          accidentalBreakageOfMirrorOrFixedGlass:
            getQuoteRes.data.cells[
              response.accidentalBreakageOfMirrorOrFixedGlassCoverage
            ],

          petDogOrCatCover:
            getQuoteRes.data.cells[response.petDogOrCatCoverage],

          accidentalDamageOfEVCharger:
            getQuoteRes.data.cells[
              response.accidentalDamageOfEVChargerCoverage
            ],

          accidentalDamageOfSolarPanels:
            getQuoteRes.data.cells[
              response.accidentalDamageOfSolarPanelsCoverage
            ],

          emergencyHomeAssistance:
            getQuoteRes.data.cells[response.emergencyHomeAssistanceCoverage],

          tenantsLiability:
            getQuoteRes.data.cells[response.tenantsLiabilityCoverage],

          lossOfRentalAfterInsuredEvent:
            getQuoteRes.data.cells[
              response.lossOfRentalAfterInsuredEventCoverage
            ],

          buildingCoverage: getQuoteRes.data.cells[response.buildingCoverage],

          personalWorldwideFPA:
            getQuoteRes.data.cells[response.personalWorldwideFPACoverage],
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
        totalPricePlanB4GST: getQuoteRes.data.cells[response.year3Premb4GST],
        totalPricePlan: getQuoteRes.data.cells[response.year3Prem],
        buildingCoverageNoDiscount:
          getQuoteRes.data.cells[response.buildingAddOnPrice3YearNoDiscount],
        buildingCoverageWithDiscount:
          getQuoteRes.data.cells[response.buildingAddOnPrice3YearWithDiscount],
        worldwideFpaNoDiscount:
          getQuoteRes.data.cells[
            response.worldwideFpaAddOnPrice3YearNoDiscount
          ],
        worldwideFpaWithDiscount:
          getQuoteRes.data.cells[
            response.worldwideFpaAddOnPrice3YearWithDiscount
          ],
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
