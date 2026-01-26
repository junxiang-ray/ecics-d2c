import { AddOn } from '../libs/types/homeContents';

// Add-ons for Home Content Insurance
export const ADD_ONS: AddOn[] = [
  {
    id: 'building',
    name: 'Building Coverage',
    price: 0,
    description:
      'Extended coverage for jewelry, watches, cameras, and other high-value items.',
    details:
      'Coverage for individual items above $2,000 each, up to total limit.',
    hasOptions: false,
    hasList: true,

    options: [
      { value: '200000', price: 0, label: '$200,000' },
      { value: '300000', price: 0, label: '$300,000' },
      { value: '400000', price: 0, label: '$400,000' },
      { value: '500000', price: 0, label: '$500,000' },
      { value: '600000', price: 0, label: '$600,000' },
      { value: '700000', price: 0, label: '$700,000' },
      { value: '800000', price: 0, label: '$800,000' },
      { value: '900000', price: 0, label: '$900,000' },
      { value: '1000000', price: 0, label: '$1,000,000' },
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
    hasList: false,

    options: [
      { value: '50000', price: 62.5, label: 'Up to $50,000' },
      { value: '100000', price: 125, label: 'Up to $100,000' },
    ],
    iconName: 'Shield',
  },
  // {
  //   id: 'building New',
  //   name: 'Building New Coverage',
  //   price: 80,
  //   description:
  //     'Extended coverage for jewelry, watches, cameras, and other high-value items.',
  //   details:
  //     'Coverage for individual items above $2,000 each, up to total limit.',
  //   hasOptions: false,
  //   hasList: true,

  //   options: [
  //     { value: '200000', price: 0, label: '$200,000' },
  //     { value: '300000', price: 0, label: '$300,000' },
  //     { value: '400000', price: 0, label: '$400,000' },
  //     { value: '500000', price: 0, label: '$500,000' },
  //     { value: '600000', price: 0, label: '$600,000' },
  //     { value: '700000', price: 0, label: '$700,000' },
  //     { value: '800000', price: 0, label: '$800,000' },
  //     { value: '900000', price: 0, label: '$900,000' },
  //     { value: '1000000', price: 0, label: '$1,000,000' },
  //   ],
  //   iconName: 'Gem',
  //   popular: true,
  //   savings: 'Most Popular',
  // },
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
