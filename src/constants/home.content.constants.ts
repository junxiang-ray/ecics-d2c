import {
  CoverageOption,
  HomeType,
  InsurancePlan,
  OwnershipType,
  UnitType,
} from '../libs/types/homeContents';

// Basic constants - loaded immediately
export const HOME_OWNERSHIP_TYPES: OwnershipType[] = [
  { value: 'owner', label: 'Owner', description: 'Living In' },
  {
    value: 'landlord',
    label: 'Landlord',
    description: 'Renting out partially/fully',
  },
  { value: 'tenant', label: 'Tenant', description: 'Renting from landlord' },
];

export const HOME_TYPES: HomeType[] = [
  {
    value: 'landed property',
    label: 'Landed Property',
    description: 'Terrace, semi-detached, detached, shophouse',
  },
  {
    value: 'hdb',
    label: 'HDB Flat',
    description: 'Housing Development Board apartment',
  },
  {
    value: 'condo',
    label: 'Condo/Executive Condo',
    description: 'Condominium or executive condominium',
  },
];

export const UNIT_TYPES: UnitType[] = [
  { value: 'Landed', label: 'Landed', homeTypes: ['landed'] },
  {
    value: '1-Room/Studio',
    label: '1-room/Studio',
    homeTypes: ['hdb', 'condo'],
  },
  { value: '2-Room', label: '2-Room', homeTypes: ['hdb', 'condo'] },
  { value: '3-Room', label: '3-Room', homeTypes: ['hdb', 'condo'] },
  { value: '4-Room', label: '4-Room', homeTypes: ['hdb', 'condo'] },
  { value: '5-Room', label: '5-Room', homeTypes: ['hdb', 'condo'] },
  {
    value: 'Executive/Multi-generation',
    label: 'Executive/Multi-generation',
    homeTypes: ['hdb'],
  },
  // { value: 'landed-single', label: 'Single Story', homeTypes: ['landed'] },
  // { value: 'landed-double', label: 'Double Story', homeTypes: ['landed'] },
  // { value: 'landed-triple', label: 'Triple Story+', homeTypes: ['landed'] },
];

// Policy durations are now plan-based instead of form-based
export const POLICY_DURATIONS = [
  { value: '12', label: '1 Year', months: 12 },
  { value: '36', label: '3 Years', months: 36 },
];

export const PROMO_CODES = {
  VALID_CODE: '123',
  DISCOUNT_PERCENTAGE: 10,
} as const;

export const COLORS = {
  PRIMARY: '#02ADEF',
  PRIMARY_HOVER: '#0198d4',
  SUCCESS: '#52c41a',
  SUCCESS_HOVER: '#45a615',
  GRADIENT_START: '#2ecc71',
  GRADIENT_END: '#27ae60',
} as const;

// Core data - Home Content Insurance plans
export const PLANS: InsurancePlan[] = [
  {
    id: '1-year',
    name: '1 Year',
    originalPrice: 250,
    discountedPrice: 250, // No discount for 1-year
    totalPricePlanB4GST: 250,
    totalPricePlan: 268.75,
    discount: 0,
    isPopular: false,
    coverage: {
      renovations: '45000',
      renovationsFixturesDebris: '30000',
      renovationsProfessionalFees: '20000',

      contents: '50000',
      // valuables may be descriptive; keep raw
      contentsValuables: 'Up to policy sub-limits',

      contentsCash: '15000',
      alternativeAccommodation: '40000',

      incidentalExpensesOrEmergencyCashAllowance: '10000',

      accidentalBreakageOfMirrorOrFixedGlass: '20000',
      petDogOrCatCover: '15000',

      accidentalDamageOfEVCharger: '25000',
      accidentalDamageOfSolarPanels: '30000',

      emergencyHomeAssistance: '10000',
      tenantsLiability: '50000',

      lossOfRentalAfterInsuredEvent: '35000',
      buildingCoverage: '50000',

      personalWorldwideFPA: '20000',
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
    originalPrice: 675, // 3 years worth at $225/year (10% discount applied)
    discountedPrice: 675,
    totalPricePlanB4GST: 675,
    totalPricePlan: 723.75,
    discount: 10, // 10% discount already applied to the price
    isPopular: true,
    coverage: {
      renovations: '45000',
      renovationsFixturesDebris: '30000',
      renovationsProfessionalFees: '20000',

      contents: '50000',
      // valuables may be descriptive; keep raw
      contentsValuables: 'Up to policy sub-limits',

      contentsCash: '15000',
      alternativeAccommodation: '40000',

      incidentalExpensesOrEmergencyCashAllowance: '10000',

      accidentalBreakageOfMirrorOrFixedGlass: '20000',
      petDogOrCatCover: '15000',

      accidentalDamageOfEVCharger: '25000',
      accidentalDamageOfSolarPanels: '30000',

      emergencyHomeAssistance: '10000',
      tenantsLiability: '50000',

      lossOfRentalAfterInsuredEvent: '35000',
      buildingCoverage: '50000',

      personalWorldwideFPA: '20000',
    },

    features: [
      'Contents coverage up to $50,000',
      'Personal accident protection up to $30,000',
      'Personal liability coverage up to $1,000,000',
      'Alternative accommodation up to $5,000',
      'Loss of rent coverage up to $3,000',
      'Priority customer support',
      'Express claims processing',
      'Worldwide coverage for personal belongings',
    ],
    highlights: [
      'Best value',
      'Save 10%',
      'Long-term protection',
      'Most popular',
    ],
  },
  // {
  //   id: '5-year',
  //   name: '5 Year',
  //   originalPrice: 1000, // 3 years worth at $225/year (10% discount applied)
  //   discountedPrice: 1000,
  //   discount: 20, // 10% discount already applied to the price
  //   isPopular: false,
  //   coverage: {
  //     contents: 50000,
  //     personalAccident: 30000,
  //     personalLiability: 1000000,
  //     alternativeAccommodation: 5000,
  //     lossOfRent: 3000,
  //     tenantLiability: 20000,
  //   },
  //   features: [
  //     'Contents coverage up to $50,000',
  //     'Personal accident protection up to $30,000',
  //     'Personal liability coverage up to $1,000,000',
  //     'Alternative accommodation up to $5,000',
  //     'Loss of rent coverage up to $3,000',
  //     'Priority customer support',
  //     'Express claims processing',
  //     'Worldwide coverage for personal belongings',
  //   ],
  //   highlights: [
  //     'Best value',
  //     'Save 10%',
  //     'Long-term protection',
  //     'Most popular',
  //   ],
  // },
];

export const INSURER_OPTIONS = [
  'Great Eastern',
  'NTUC Income',
  'AIA',
  'Prudential',
  'Tokio Marine',
  'AXA',
  'Allianz',
  'Liberty Insurance',
  'QBE Insurance',
  'Other',
] as const;

///fetch from API in future
export const NATIONALITIES = [
  'Singaporean',
  'Malaysian',
  'Chinese',
  'Indian',
  'Indonesian',
  'Filipino',
  'Myanmar',
  'Sri Lankan',
  'Bangladeshi',
  'Other',
] as const;

export const GENDER = ['Male', 'Female'] as const;

export const MARITAL_STATUS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
] as const;

// Simple function that returns just the nationality name
export const getNationalityDisplay = (nationality: string): string => {
  return nationality;
};

// Alias for consistency - both return the same simple string
export const getNationalityWithFlag = getNationalityDisplay;

// Customization coverage options with pricing
// Base rates per $1,000 of coverage (annual rates)
export const COVERAGE_PRICING = {
  BUILDING_RATE_PER_1000: 0.5, // $0.50 per $1,000 of building coverage
  HOME_CONTENT_RATE_PER_1000: 0.8, // $0.80 per $1,000 of home content coverage
  RENOVATION_RATE_PER_1000: 0.6, // $0.60 per $1,000 of renovation coverage
} as const;

export const BUILDING_COVERAGE_OPTIONS: CoverageOption[] = [
  { value: '200000', label: '$200,000', amount: 200000 },
  { value: '300000', label: '$300,000', amount: 300000 },
  { value: '400000', label: '$400,000', amount: 400000 },
  { value: '500000', label: '$500,000', amount: 500000 },
  { value: '600000', label: '$600,000', amount: 600000 },
  { value: '700000', label: '$700,000', amount: 700000 },
  { value: '800000', label: '$800,000', amount: 800000 },
  { value: '900000', label: '$900,000', amount: 900000 },
  { value: '1000000', label: '$1,000,000', amount: 1000000 },
];

export const HOME_CONTENT_COVERAGE_OPTIONS: CoverageOption[] = [
  { value: '40000', label: '$40,000', amount: 40000 },
  { value: '50000', label: '$50,000', amount: 50000 },
  { value: '60000', label: '$60,000', amount: 60000 },
  { value: '70000', label: '$70,000', amount: 70000 },
  { value: '80000', label: '$80,000', amount: 80000 },
  { value: '90000', label: '$90,000', amount: 90000 },
  { value: '100000', label: '$100,000', amount: 100000 },
  { value: '110000', label: '$110,000', amount: 110000 },
  { value: '120000', label: '$120,000', amount: 120000 },
  { value: '130000', label: '$130,000', amount: 130000 },
  { value: '140000', label: '$140,000', amount: 140000 },
  { value: '150000', label: '$150,000', amount: 150000 },
  { value: '160000', label: '$160,000', amount: 160000 },
  { value: '170000', label: '$170,000', amount: 170000 },
  { value: '180000', label: '$180,000', amount: 180000 },
  { value: '190000', label: '$190,000', amount: 190000 },
  { value: '200000', label: '$200,000', amount: 200000 },
];

export const RENOVATION_COVERAGE_OPTIONS: CoverageOption[] = [
  { value: '30000', label: '$30,000', amount: 30000 },
  { value: '40000', label: '$40,000', amount: 40000 },
  { value: '50000', label: '$50,000', amount: 50000 },
  { value: '60000', label: '$60,000', amount: 60000 },
  { value: '70000', label: '$70,000', amount: 70000 },
  { value: '80000', label: '$80,000', amount: 80000 },
  { value: '90000', label: '$90,000', amount: 90000 },
  { value: '100000', label: '$100,000', amount: 100000 },
  { value: '110000', label: '$110,000', amount: 110000 },
  { value: '120000', label: '$120,000', amount: 120000 },
  { value: '130000', label: '$130,000', amount: 130000 },
  { value: '140000', label: '$140,000', amount: 140000 },
  { value: '150000', label: '$150,000', amount: 150000 },
  { value: '160000', label: '$160,000', amount: 160000 },
  { value: '170000', label: '$170,000', amount: 170000 },
  { value: '180000', label: '$180,000', amount: 180000 },
  { value: '190000', label: '$190,000', amount: 190000 },
  { value: '200000', label: '$200,000', amount: 200000 },
];
