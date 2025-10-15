import {
  InsurancePlan,
  AddOn,
  OwnershipType,
  HomeType,
  UnitType,
  CoverageOption,
} from '../types/types';

// Basic constants - loaded immediately
export const OWNERSHIP_TYPES: OwnershipType[] = [
  { value: 'owner-living-in', label: 'Owner (Living In)' },
  {
    value: 'landlord-renting-out',
    label: 'Landlord (Renting out partially/fully)',
  },
  { value: 'tenant', label: 'Tenant' },
];

export const HOME_TYPES: HomeType[] = [
  {
    value: 'landed',
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
  { value: 'studio', label: '1-room/Studio', homeTypes: ['hdb', 'condo'] },
  { value: '2-room', label: '2-Room', homeTypes: ['hdb', 'condo'] },
  { value: '3-room', label: '3-Room', homeTypes: ['hdb', 'condo'] },
  { value: '4-room', label: '4-Room', homeTypes: ['hdb', 'condo'] },
  { value: '5-room', label: '5-Room', homeTypes: ['hdb', 'condo'] },
  {
    value: 'executive',
    label: 'Executive/Multi-generation',
    homeTypes: ['hdb'],
  },
  { value: 'landed-single', label: 'Single Story', homeTypes: ['landed'] },
  { value: 'landed-double', label: 'Double Story', homeTypes: ['landed'] },
  { value: 'landed-triple', label: 'Triple Story+', homeTypes: ['landed'] },
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
    originalPrice: 675, // 3 years worth at $225/year (10% discount applied)
    discountedPrice: 675,
    discount: 10, // 10% discount already applied to the price
    isPopular: true,
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
];

// Add-ons for Home Content Insurance
export const ADD_ONS: AddOn[] = [
  {
    id: 'valuables-extension',
    name: 'Valuables Extension',
    price: 80,
    description:
      'Extended coverage for jewelry, watches, cameras, and other high-value items.',
    details:
      'Coverage for individual items above $2,000 each, up to total limit.',
    hasOptions: true,
    options: [
      { value: '10000', price: 80, label: 'Up to $10,000' },
      { value: '20000', price: 150, label: 'Up to $20,000' },
      { value: '30000', price: 220, label: 'Up to $30,000' },
    ],
    iconName: 'Gem',
    popular: true,
    savings: 'Most Popular',
  },
  {
    id: 'home-business',
    name: 'Home Business Coverage',
    price: 120,
    description: 'Coverage for business equipment and stock kept at home.',
    details:
      'Covers computers, printers, stock, and other business equipment used from home.',
    iconName: 'Briefcase',
  },
  {
    id: 'family-accidental-death',
    name: 'Family Accidental Death Protection',
    price: 60,
    description:
      'Accidental death coverage for family members residing in the insured home.',
    details:
      'Provides financial protection in case of accidental death of family members.',
    iconName: 'Shield',
  },
  {
    id: 'water-damage-plus',
    name: 'Enhanced Water Damage',
    price: 90,
    description: 'Extended coverage for water damage from various sources.',
    details:
      'Covers water damage from burst pipes, overflow, and gradual leaks.',
    iconName: 'Droplets',
  },
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
  { value: '100000', label: '$100,000', amount: 100000 },
  { value: '150000', label: '$150,000', amount: 150000 },
  { value: '200000', label: '$200,000', amount: 200000 },
  { value: '250000', label: '$250,000', amount: 250000 },
  { value: '300000', label: '$300,000', amount: 300000 },
];

export const HOME_CONTENT_COVERAGE_OPTIONS: CoverageOption[] = [
  { value: '30000', label: '$30,000', amount: 30000 },
  { value: '50000', label: '$50,000', amount: 50000 },
  { value: '75000', label: '$75,000', amount: 75000 },
  { value: '100000', label: '$100,000', amount: 100000 },
  { value: '150000', label: '$150,000', amount: 150000 },
];

export const RENOVATION_COVERAGE_OPTIONS: CoverageOption[] = [
  { value: '10000', label: '$10,000', amount: 10000 },
  { value: '25000', label: '$25,000', amount: 25000 },
  { value: '50000', label: '$50,000', amount: 50000 },
  { value: '75000', label: '$75,000', amount: 75000 },
];
