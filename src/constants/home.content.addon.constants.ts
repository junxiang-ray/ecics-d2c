import { AddOn } from '../libs/types/homeContents';

// Add-ons for Home Content Insurance
export const ADD_ONS: AddOn[] = [
  {
    id: 'building',
    name: 'Building Coverage',
    price: 80,
    description:
      'Extended coverage for jewelry, watches, cameras, and other high-value items.',
    details:
      'Coverage for individual items above $2,000 each, up to total limit.',
    hasOptions: true,
    options: [
      { value: '200000', price: 80, label: 'Up to $200,000' },
      { value: '500000', price: 150, label: 'Up to $500,000' },
      { value: '1000000', price: 220, label: 'Up to $1,000,000' },
    ],
    iconName: 'Gem',
    popular: true,
    savings: 'Most Popular',
  },

  {
    id: 'worldwide-fpa',
    name: 'Worldwide Family Personal Accident',
    price: 60,
    description:
      'Accidental death coverage for family members residing in the insured home.',
    details:
      'Provides financial protection in case of accidental death of family members.',
    hasOptions: true,
    options: [
      { value: '50000', price: 62.5, label: 'Up to $50,000' },
      { value: '100000', price: 125, label: 'Up to $100,000' },
    ],
    iconName: 'Shield',
  },
  // {
  //   id: 'water-damage-plus',
  //   name: 'Enhanced Water Damage',
  //   price: 90,
  //   description: 'Extended coverage for water damage from various sources.',
  //   details:
  //     'Covers water damage from burst pipes, overflow, and gradual leaks.',
  //   iconName: 'Droplets',
  // },
  // {
  //   id: 'home-business',
  //   name: 'Home Business Coverage',
  //   price: 120,
  //   description: 'Coverage for business equipment and stock kept at home.',
  //   details:
  //     'Covers computers, printers, stock, and other business equipment used from home.',
  //   iconName: 'Briefcase',
  // },
];
