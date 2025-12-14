import { Building } from 'lucide-react';
import build from 'next/dist/build';

// use as fallback
export const KEYS = {
  homeOwnership: '0_3_2',
  homeType: '0_1_2',
  unitType: '0_2_2',
  homeContents: '0_5_2',
  renovations: '0_4_2',
  promoCode: '0_8_2',
  selectedPlan: '0_30_2',
  worldwideFpa: '0_20_2',
  building: '0_16_2',
} as const;

export const response = {
  // values BEFORE addons - without discounts
  year1Premb4GSTNoAddOn: 'far_gross_prem_1year',
  year3Premb4GSTNoAddOn: 'far_gross_prem_3years',

  // values BEFORE addons - with discounts
  year1Premb4GSTNoAddOnDiscounted: 'far_prem_with_disount_1year',
  year3Premb4GSTNoAddOnDiscounted: 'far_prem_with_disount_3years',

  // price of worlwide FPA add-on (1 year)
  worldwideFpaAddOnPrice1YearNoDiscount: 'pa_gross_prem_1year',
  worldwideFpaAddOnPrice1YearWithDiscount: 'pa_prem_with_disount_1year',

  // price of worlwide FPA add-on (3 years)
  worldwideFpaAddOnPrice3YearNoDiscount: 'pa_gross_prem_3years',
  worldwideFpaAddOnPrice3YearWithDiscount: 'pa_prem_with_disount_3years',

  // price of building add-on (1 year)
  buildingAddOnPrice1YearNoDiscount: 'fire_gross_prem_1year',
  buildingAddOnPrice1YearWithDiscount: 'fire_prem_with_disount_1year',

  // price of building add-on (3 years)
  buildingAddOnPrice3YearNoDiscount: 'fire_gross_prem_3years',
  buildingAddOnPrice3YearWithDiscount: 'fire_prem_with_disount_3years',

  // final totals WITH addons (1 year)
  year1Premb4GST: 'total_prem_with_discount_bef_gst_1year',
  year1Prem: 'total_prem_with_discount_with_gst_1year',
  // to display GST amount for 1 year
  year1GST: 'total_gst_with_discount_1year',

  // final totals WITH addons (3 years)
  year3Premb4GST: 'total_prem_with_discount_bef_gst_3years',
  year3Prem: 'total_prem_with_discount_with_gst_3years',
  // to display GST amount for 3 years
  year3GST: 'f_total_gst_with_discount_3years',

  // others - use for breakdown display
  renovationsCoverage: 'section1a_a',
  renovationsFixturesDebrisCoverage: 'section1a_b',
  renovationsProfessionalFeesCoverage: 'section1a_c',
  contentsTotalCoverage: 'section1b_a',
  contentsValuablesCoverage: 'section1b_b',
  contentsCashCoverage: 'section1b_c',
  alternativeAccommodationCoverage: 'section1c_a',
  incidentalExpensesOrEmergencyCashAllowanceCoverage: 'section1c_b',
  accidentalBreakageOfMirrorOrFixedGlassCoverage: 'section1c_c',
  petDogOrCatCoverage: 'section1c_d',
  accidentalDamageOfEVChargerCoverage: 'section1c_e',
  accidentalDamageOfSolarPanelsCoverage: 'section1c_f',
  emergencyHomeAssistanceCoverage: 'section1c_g',
  tenantsLiabilityCoverage: 'section1c_h',
  lossOfRentalAfterInsuredEventCoverage: 'section1c_i',
  buildingCoverage: 'section2',
  personalWorldwideFPACoverage: 'section3',
} as const;
