/// change to motorcycle insurance constants when available
export const MOTORCYCLE_INSURANCE = {
  PREFIX_ENDPOINT: 'b2c_motorcycle2',
  TYPE: 'motorcycle',
  PLAN_CODE: {
    COMP: 'COMP',
    TPFT: 'TPFT',
    TPO: 'TPO',
    // FNCD: 'FNCD',
  },
  PLAN_NAME: {
    COMP: 'Comprehensive',
    TPFT: 'Third Party, Fire and Theft',
    TPO: 'Third Party Only',
    // FNCD: 'Comprehensive - Family NCD Builder',
  },

  ADD_ONS: {
    LOU: {
      YES: 'YES',
      NO: 'NO',
    },
    CC: {
      YES_UP_TO_1600CC: 'YES (up to 1,600cc)',
      YES_UP_TO_2000CC: 'YES (up to 2,000cc)',
      NO: 'NO',
    },
    ADDL_DRIVER: {
      YES: 'YES',
      NO: 'NO',
      DRIVERS_AGE_FROM_27_TO_70: 'drivers_age_from_27_to_70',
      ALL_DRIVERS: 'all_drivers',
    },
  },

  CODE_ADDL_DRIVERS: [
    'MOTORCYCLE_COMP_AND',
    'MOTORCYCLE_TPFT_AND',
    'MOTORCYCLE_TPO_AND',
  ],

  CODE_LOUS: ['MOTORCYCLE_COMP_LOU'],
};

export const MOTORCYCLE_PLAN_ADDON_CONFIG = {
  [MOTORCYCLE_INSURANCE.PLAN_NAME.COMP]: {
    andKey: 'MOTORCYCLE_COMP_AND',
    louKey: 'MOTORCYCLE_COMP_LOU',
    applyLouAndCc: true,
    setDefaults: false,
  },
  [MOTORCYCLE_INSURANCE.PLAN_NAME.TPFT]: {
    andKey: 'MOTORCYCLE_TPFT_AND',
    louKey: 'MOTORCYCLE_TPFT_LOU',
    applyLouAndCc: true,
    setDefaults: true,
  },
  [MOTORCYCLE_INSURANCE.PLAN_NAME.TPO]: {
    andKey: 'MOTORCYCLE_TPO_AND',
    louKey: 'MOTORCYCLE_TPO_LOU',
    applyLouAndCc: true,
    setDefaults: true,
  },
};

export const ADD_ON_VALUES = {
  YES: 'Yes',
  NO: 'No',
};
