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
