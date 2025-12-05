import type { AxiosResponse } from 'axios';
import { PolicyPayload, PolicyResponse } from '@/libs/types/policy';

import { API_POLICY_GET } from '@/constants/api.constant';

import baseClient from './api.config';
const MOCK_DATA = [
  {
    policy_type: 'car',
    policy_type_name: 'MOTOR POLICY - PRIVATE',
    policy_name: 'motor vehicle - car',
    start_date: '2024-05-21',
    end_date: '2025-05-20',
    expire_date: '2025-05-21',
    issue_date: '2024-05-21',
    plan: {
      plan_code: 'cfncdb',
      plan_name: 'Comprehensive - Family NCD Builder',
    },
    scheme: 'Tailored Workshop',
    intermediary_name: 'AON SINGAPORE (ORG) PTE. LTD.',
    premium: 1000.0,
    policy_status: 'active',
    tags: 'renewed',
    policy_holder: {
      name: 'TAN AH KOW',
      marital_status: 'Married',
      mobile: '+65 9123 4567',
      email: 'tanak@email.com',
      address: {
        address_line_1: '123 YISHUN AVENUE 1',
        address_line_2: '#05-123',
        address_line_3: null,
        postal_code: '760123',
      },
    },
    drivers: [
      {
        name: 'LIM WEI LING',
        is_main_driver: true,
        gender: 'MALE',
        nric_or_fin: '',
        date_of_birth: '',
        marital_status: '',
        driving_experience: '',
      },
    ],
    vehicle: {
      registration_number: 'SMC3345U@040620',
      chassis_no: 'JM1FDH53A4U049828',
      engine_capacity: '1598 TO 1599 CC',
      vehicle_usage: 'MOTOR PRIVATE CAR',
      vehicle_make: 'TOYOTA COROLLA ALTIS 1.6',
      engine_no: '1N8198751',
      first_registered_year: '2018',
      hire_purchase_company: 'N/A',
      registration_no: 'SMC3345U@040620',
    },
    excess: {
      policy_excess: [
        {
          name: 'Windscreen/Sun/Moon/Glass Roof (Where Applicable)',
          description: '',
          amount: 'SGD 100.00',
        },
        {
          name: 'Standard Excess',
          description: 'Insured/Named Driver',
          amount: 'SGD 1,000.00',
        },
        {
          name: 'Standard Excess (Outside of Singapore)',
          description: 'Insured/Named Driver',
          amount: 'SGD 100.00',
        },
      ],
      additional_excess: [
        {
          name: 'Unnamed Drivers',
          description: '',
          amount: 'SGD 500.00',
        },
        {
          name: 'Young or Inexperienced Drivers Excess',
          description: '(Age < 26 or driving experience < 2 years)',
          amount: 'SGD 3,000.00',
        },
      ],
    },
    policy_no: 'MC2024001',
  },
  {
    policy_type: 'car',
    policy_type_name: 'MOTOR POLICY - PRIVATE',
    policy_name: 'motor vehicle - car',
    start_date: '2024-01-15',
    end_date: '2025-01-14',
    expire_date: '2025-01-15',
    issue_date: '2024-01-15',
    plan: {
      plan_code: 'cp',
      plan_name: 'Comprehensive Plus',
    },
    scheme: 'Authorized Workshop',
    intermediary_name: 'MSIG INSURANCE (SINGAPORE) PTE. LTD.',
    premium: 1400.0,
    policy_status: 'active',
    tags: 'pending_renewal',
    policy_holder: {
      name: 'NEESHA D/O KRISHNAMOORTHY (NOT DRIVING)',
      marital_status: 'Single',
      mobile: '+65 8765 4321',
      email: 'neesha.k@email.com',
      address: {
        address_line_1: '547 WOODLANDS DRIVE 16',
        address_line_2: '#06-123',
        address_line_3: null,
        postal_code: '730547',
      },
    },
    drivers: [
      {
        name: 'PRIYA D/O KRISHNAMOORTHY',
        is_main_driver: true,
        gender: 'MALE',
        nric_or_fin: '',
        date_of_birth: '',
        marital_status: '',
        driving_experience: '',
      },
    ],
    vehicle: {
      registration_number: 'SJR5319D',
      chassis_no: 'JM1FNH35A4U004929',
      engine_capacity: '1499 CC',
      vehicle_usage: 'MOTOR PRIVATE CAR',
      vehicle_make: 'MITSUBISHI LANCER 1.6',
      engine_no: '1N8198579',
      first_registered_year: '2012',
      hire_purchase_company: 'FWA CAPITAL PTE LTD',
      registration_no: 'SJR5319D',
    },
    excess: {
      policy_excess: [
        {
          name: 'Windscreen/Sun/Moon/Glass Roof (Where Applicable)',
          description: '',
          amount: 'SGD 100.00',
        },
        {
          name: 'Standard Excess',
          description: 'Insured/Named Driver',
          amount: 'SGD 1,000.00',
        },
        {
          name: 'Standard Excess (Outside of Singapore)',
          description: 'Insured/Named Driver',
          amount: 'SGD 100.00',
        },
      ],
      additional_excess: [
        {
          name: 'Unnamed Drivers',
          description: '',
          amount: 'SGD 500.00',
        },
        {
          name: 'Young or Inexperienced Drivers Excess',
          description: '(Age < 26 or driving experience < 2 years)',
          amount: 'SGD 3,000.00',
        },
      ],
    },
    policy_no: 'MC2024002',
  },
  {
    policy_type: 'maid',
    policy_type_name: 'DOMESTIC MAID INSURANCE',
    policy_name: 'maid',
    start_date: '2024-06-10',
    end_date: '2025-06-09',
    expire_date: '2025-06-10',
    issue_date: '2023-06-23',
    plan: {
      plan_code: 'c',
      plan_name: 'Classic',
    },
    scheme: 'ABC World Agency',
    intermediary_name: 'ABC Maid Agency',
    premium: 348.9,
    policy_status: 'active',
    tags: null,
    policy_holder: {
      name: 'LIM TIANBAO, WILSON',
      marital_status: 'Married',
      mobile: '+65 9123 4567',
      email: 'wilson.lim@email.com',
      address: {
        address_line_1: '173 WOODLANDS STREET 13',
        address_line_2: '03-409',
        address_line_3: null,
        postal_code: '730173',
      },
    },
    maid_info: {
      id: 'S0289-93L',
      name: 'Maria Santos',
      date_of_birth: '1990-03-15',
      gender: 'FEMALE',
      phone_number: '65197230',
      nationality: 'PHILIPPINES',
      passport_number: 'MK191229',
      fin: 'M3669545L',
      coverage_details: [
        {
          id: 10,
          name: 'Letter of Guarantee to Ministry of Manpower (MOM)',
          amount: null,
          notes: '$ 5000',
          sub_details: null,
        },
        {
          id: 11,
          name: 'Personal Accident',
          amount: null,
          notes: null,
          sub_details: [
            {
              name: '(a) Death',
              amount: 60000,
              notes: null,
            },
            {
              name: '(b) Permanent Disability',
              amount: null,
              notes: 'Up to $60,000',
            },
            {
              name: '(c) Accidental Medical Expenses (sub-limit of $200 for TCM)',
              amount: null,
              notes: 'Up to $1,500',
            },
            {
              name: 'Panel Clinics - Co-payment $10 each claim',
              amount: null,
              notes: null,
            },
            {
              name: 'Non-Panel Clinics - Co-payment $30 each claim',
              amount: null,
              notes: null,
            },
          ],
        },
        {
          id: 12,
          name: 'Hospital and Surgical Expenses',
          amount: null,
          notes: null,
          sub_details: [
            {
              name: 'Co-payment per policy year',
              amount: null,
              notes: '$60,000 per policy year',
            },
            {
              name: 'First $15,000: No co-payment',
              amount: '',
              notes: '',
            },
            {
              name: 'From $15,001 onwards: 25% paid by Employer, 75% paid by ECICS',
              amount: '',
              notes: '',
            },
          ],
        },
        {
          id: 13,
          name: 'Daily Hospitalisation Benefit (up to 90 days)',
          amount: null,
          notes: '$15 per day',
        },
        {
          id: 14,
          name: 'Wages and Levy Reimbursement (up to 90 days)',
          amount: null,
          notes: 'Up to $30 per day',
        },
        {
          id: 15,
          name: 'Termination & Re-hiring Expenses',
          amount: null,
          notes: 'Up to $500',
        },
        {
          id: 15,
          name: 'Repatriation Expenses (cover suicide – reimbursement basis capped $3,000)',
          amount: null,
          notes: 'Up to $10,000',
        },
        {
          id: 16,
          name: "Domestic Helper's Liability",
          amount: null,
          notes: 'Up to $10,000',
        },
        {
          id: 17,
          name: 'Special Grant',
          amount: null,
          notes: '$1,000',
        },
        {
          id: 18,
          name: 'Waiver of Counter Indemnity under Section 1 ($250 excess)',
          amount: null,
          notes: 'Covered',
        },
        {
          id: 19,
          name: 'Outpatient Medical Expenses Rider (Maximum Limit $60 each claim)',
          amount: null,
          notes: 'Not Covered',
          sub_details: [
            {
              name: 'Co-payment each claim (Panel Clinics - $10 / Non-Panel Clinics - $30)',
              amount: null,
              notes: null,
            },
          ],
        },
        {
          id: 20,
          name: 'Waiver of Co-Payment Payable by Employer under Section 3',
          amount: null,
          notes: 'Not Covered',
        },
      ],
    },
    policy_no: 'GMA23F0061460',
  },
  {
    policy_type: 'motorcycle',
    policy_type_name: 'MOTOR POLICY - MOTORCYCLE',
    policy_name: 'motor vehicle - motorcycle',
    start_date: '2023-08-05',
    end_date: '2024-08-04',
    expire_date: '2024-08-05',
    issue_date: '2023-08-05',
    plan: {
      plan_code: 'cm',
      plan_name: 'Comprehensive - Motorcycle',
    },
    scheme: 'Authorized Workshop',
    intermediary_name: 'NTUC INCOME (SINGAPORE) PTE. LTD.',
    premium: 400.0,
    policy_status: 'expired',
    tags: null,
    policy_holder: {
      name: 'WONG KAH SENG',
      marital_status: 'Single',
      mobile: '+65 8234 5678',
      email: 'wongs@email.com',
      address: {
        address_line_1: '789 ANG MO KIO AVENUE 5',
        address_line_2: '#08-123',
        address_line_3: null,
        postal_code: '560789',
      },
    },
    vehicle: {
      registration_number: 'SGM9876C',
      chassis_no: 'JM1FDK45A4U801234',
      engine_capacity: '150 CC',
      vehicle_usage: 'MOTOR MOTORCYCLE',
      vehicle_make: 'YAMAHA YZF-R15',
      engine_no: '201987529',
      first_registered_year: '2015',
      hire_purchase_company: 'N/A',
      registration_no: 'SGM9876C',
    },
    excess: {
      policy_excess: [
        {
          name: 'Windscreen/Sun/Moon/Glass Roof (Where Applicable)',
          description: null,
          amount: 'N/A',
        },
        {
          name: 'Standard Excess',
          description: 'Insured/Named Driver',
          amount: 'SGD 500.00',
        },
        {
          name: 'Standard Excess (Outside of Singapore)',
          description: 'Insured/Named Driver',
          amount: 'SGD 500.00',
        },
      ],
      additional_excess: [
        {
          name: 'Unnamed Drivers',
          description: '',
          amount: 'SGD 300.00',
        },
        {
          name: 'Young or Inexperienced Drivers Excess',
          description: '(Age < 26 or driving experience < 2 years)',
          amount: 'SGD 2,000.00',
        },
      ],
    },
    policy_no: 'MC2023005',
  },
  {
    policy_type: 'home',
    policy_type_name: 'Home Content',
    policy_name: 'home content',
    start_date: '2024-06-10',
    end_date: '2025-06-09',
    expire_date: '2025-03-20',
    plan: {
      plan_code: 'c',
      plan_name: 'Classic',
    },
    intermediary_name: 'ABC Maid Agency',
    premium: 340.0,
    policy_status: 'active',
    tags: '',
    maid_info: {
      id: 'MZ34537E',
      name: 'Maria Santos',
      date_of_birth: '1990-03-15',
      gender: null,
      phone_number: '196 23550',
      nationality: 'PHILIPPINES',
      passport_number: 'MK191229',
      fin: 'M3669545L',
      coverage_details: [
        {
          id: 10,
          name: 'Letter of Guarantee to Ministry of Manpower (MOM)',
          amount: null,
          notes: '$ 5000',
          sub_details: null,
        },
        {
          id: 11,
          name: 'Personal Accident',
          amount: null,
          notes: null,
          sub_details: [
            {
              name: '(a) Death',
              amount: 60000,
              notes: null,
            },
            {
              name: '(b) Permanent Disability',
              amount: null,
              notes: 'Up to $60,000',
            },
            {
              name: '(c) Accidental Medical Expenses (sub-limit of $200 for TCM)',
              amount: null,
              notes: 'Up to $1,500',
            },
            {
              name: 'Panel Clinics - Co-payment $10 each claim',
              amount: null,
              notes: null,
            },
            {
              name: 'Non-Panel Clinics - Co-payment $30 each claim',
              amount: null,
              notes: null,
            },
          ],
        },
        {
          id: 12,
          name: 'Hospital and Surgical Expenses',
          amount: null,
          notes: null,
          sub_details: [
            {
              name: 'Co-payment per policy year',
              amount: null,
              notes: '$60,000 per policy year',
            },
            {
              name: 'First $15,000: No co-payment',
              amount: '',
              notes: '',
            },
            {
              name: 'From $15,001 onwards: 25% paid by Employer, 75% paid by ECICS',
              amount: '',
              notes: '',
            },
          ],
        },
        {
          id: 13,
          name: 'Daily Hospitalisation Benefit (up to 90 days)',
          amount: null,
          notes: '$15 per day',
        },
        {
          id: 14,
          name: 'Wages and Levy Reimbursement (up to 90 days)',
          amount: null,
          notes: 'Up to $30 per day',
        },
        {
          id: 15,
          name: 'Termination & Re-hiring Expenses',
          amount: null,
          notes: 'Up to $500',
        },
        {
          id: 15,
          name: 'Repatriation Expenses (cover suicide – reimbursement basis capped $3,000)',
          amount: null,
          notes: 'Up to $10,000',
        },
        {
          id: 16,
          name: "Domestic Helper's Liability",
          amount: null,
          notes: 'Up to $10,000',
        },
        {
          id: 17,
          name: 'Special Grant',
          amount: null,
          notes: '$1,000',
        },
        {
          id: 18,
          name: 'Waiver of Counter Indemnity under Section 1 ($250 excess)',
          amount: null,
          notes: 'Covered',
        },
        {
          id: 19,
          name: 'Outpatient Medical Expenses Rider (Maximum Limit $60 each claim)',
          amount: null,
          notes: 'Not Covered',
          sub_details: [
            {
              name: 'Co-payment each claim (Panel Clinics - $10 / Non-Panel Clinics - $30)',
              amount: null,
              notes: null,
            },
          ],
        },
        {
          id: 20,
          name: 'Waiver of Co-Payment Payable by Employer under Section 3',
          amount: null,
          notes: 'Not Covered',
        },
      ],
    },
    policy_holder: {
      name: 'LIM TIANBAO, WILSON',
      marital_status: 'Married',
      mobile: '+65 9234 5678',
      email: 'wilson.lim@email.com',
      address: {
        address_line_1: '173 WOODLANDS STREET 13',
        address_line_2: '03-409',
        address_line_3: null,
        postal_code: '730173',
      },
    },
    policy_no: 'MC2024006',
  },
  {
    policy_type: 'travel',
    policy_type_name: 'Travel Insurance',
    policy_name: 'travel insurance',
    start_date: '2024-06-10',
    expire_date: '2024-07-15',
    issue_date: '2025-09-23',
    plan: {
      plan_code: 'c',
      plan_name: 'Classic',
    },
    intermediary_name: 'ABC Maid Agency',
    premium: 150,
    policy_status: 'cancelled',
    tags: '',
    policy_holder: {
      name: 'LIM TIANBAO, WILSON',
      marital_status: 'Married',
      mobile: '+65 8765 4321',
      email: 'wilson.lim@email.com',
      address: {
        address_line_1: '173 WOODLANDS STREET 13',
        address_line_2: '03-409',
        address_line_3: null,
        postal_code: '730173',
      },
    },
    maid_info: {
      id: 'S0289-93L',
      name: 'Maria Santos',
      date_of_birth: '1990-03-15',
      gender: 'FEMALE',
      phone_number: '65197230',
      nationality: 'PHILIPPINES',
      passport_number: 'MK191229',
      fin: 'M3669545L',
      coverage_details: [
        {
          id: 10,
          name: 'Letter of Guarantee to Ministry of Manpower (MOM)',
          amount: null,
          notes: '$ 5000',
          sub_details: null,
        },
        {
          id: 11,
          name: 'Personal Accident',
          amount: null,
          notes: null,
          sub_details: [
            {
              name: '(a) Death',
              amount: 60000,
              notes: null,
            },
            {
              name: '(b) Permanent Disability',
              amount: null,
              notes: 'Up to $60,000',
            },
            {
              name: '(c) Accidental Medical Expenses (sub-limit of $200 for TCM)',
              amount: null,
              notes: 'Up to $1,500',
            },
            {
              name: 'Panel Clinics - Co-payment $10 each claim',
              amount: null,
              notes: null,
            },
            {
              name: 'Non-Panel Clinics - Co-payment $30 each claim',
              amount: null,
              notes: null,
            },
          ],
        },
        {
          id: 12,
          name: 'Hospital and Surgical Expenses',
          amount: null,
          notes: null,
          sub_details: [
            {
              name: 'Co-payment per policy year',
              amount: null,
              notes: '$60,000 per policy year',
            },
            {
              name: 'First $15,000: No co-payment',
              amount: '',
              notes: '',
            },
            {
              name: 'From $15,001 onwards: 25% paid by Employer, 75% paid by ECICS',
              amount: '',
              notes: '',
            },
          ],
        },
        {
          id: 13,
          name: 'Daily Hospitalisation Benefit (up to 90 days)',
          amount: null,
          notes: '$15 per day',
        },
        {
          id: 14,
          name: 'Wages and Levy Reimbursement (up to 90 days)',
          amount: null,
          notes: 'Up to $30 per day',
        },
        {
          id: 15,
          name: 'Termination & Re-hiring Expenses',
          amount: null,
          notes: 'Up to $500',
        },
        {
          id: 15,
          name: 'Repatriation Expenses (cover suicide – reimbursement basis capped $3,000)',
          amount: null,
          notes: 'Up to $10,000',
        },
        {
          id: 16,
          name: "Domestic Helper's Liability",
          amount: null,
          notes: 'Up to $10,000',
        },
        {
          id: 17,
          name: 'Special Grant',
          amount: null,
          notes: '$1,000',
        },
        {
          id: 18,
          name: 'Waiver of Counter Indemnity under Section 1 ($250 excess)',
          amount: null,
          notes: 'Covered',
        },
        {
          id: 19,
          name: 'Outpatient Medical Expenses Rider (Maximum Limit $60 each claim)',
          amount: null,
          notes: 'Not Covered',
          sub_details: [
            {
              name: 'Co-payment each claim (Panel Clinics - $10 / Non-Panel Clinics - $30)',
              amount: null,
              notes: null,
            },
          ],
        },
        {
          id: 20,
          name: 'Waiver of Co-Payment Payable by Employer under Section 3',
          amount: null,
          notes: 'Not Covered',
        },
      ],
    },
    policy_no: 'GMA23F0061461',
  },
  {
    policy_type: 'car',
    policy_type_name: 'MOTOR POLICY - PRIVATE',
    policy_name: 'motor vehicle - car',
    start_date: '2024-02-10',
    end_date: '2025-02-09',
    expire_date: '2025-02-10',
    plan: {
      plan_code: 'cs',
      plan_name: 'Comprehensive - Standard',
    },
    scheme: 'Authorised Workshop',
    intermediary_name: 'ASSURE (SINGAPORE) PTE. LTD.',
    premium: 1380,
    policy_status: 'active',
    tags: 'pending_renewal',
    policy_holder: {
      name: 'CHUA BENG HUAT',
      marital_status: 'Divorced',
      mobile: '+65 9876 5432',
      email: 'chua.bh@webmail.sg',
      address: {
        address_line_1: 'BLK 34 TAMPINES STREET 91',
        address_line_2: '#10-205',
        address_line_3: null,
        postal_code: '520034',
      },
    },
    vehicle: {
      registration_number: 'SJQ1234F',
      chassis_no: 'JM1FDK45A4U908765',
      engine_capacity: '1998 CC',
      vehicle_usage: 'MOTOR PRIVATE CAR',
      vehicle_make: 'TOYOTA CAMRY 2.0',
      engine_no: '1N1234567',
      first_registered_year: '2020',
      hire_purchase_company: 'N/A',
      registration_no: 'SJQ1234F',
    },
    excess: {
      policy_excess: [
        {
          name: 'Windscreen/Sun/Moon/Glass Roof (Where Applicable)',
          description: '',
          amount: 'SGD 100.00',
        },
        {
          name: 'Standard Excess',
          description: 'Insured/Named Driver',
          amount: 'SGD 1,000.00',
        },
        {
          name: 'Standard Excess (Outside of Singapore)',
          description: 'Insured/Named Driver',
          amount: 'SGD 100.00',
        },
      ],
      additional_excess: [
        {
          name: 'Unnamed Drivers',
          description: '',
          amount: 'SGD 500.00',
        },
        {
          name: 'Young or Inexperienced Drivers Excess',
          description: '(Age < 26 or driving experience < 2 years)',
          amount: 'SGD 3,000.00',
        },
      ],
    },
    policy_no: 'MC2025010',
  },
  {
    policy_type: 'maid',
    policy_type_name: 'DOMESTIC MAID INSURANCE',
    policy_name: 'maid',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    expire_date: '2025-12-31',
    issue_date: '2024-12-28',
    plan: {
      plan_code: 'c',
      plan_name: 'Classic',
    },
    scheme: 'Standard Agency',
    intermediary_name: 'Direct Sales',
    premium: 340,
    policy_status: 'active',
    tags: 'pending_renewal',
    policy_holder: {
      name: 'MARK GOH',
      marital_status: 'Married',
      mobile: '+65 8234 1122',
      email: 'mark.goh@corp.com',
      address: {
        address_line_1: '1 RAFFLES PLACE',
        address_line_2: '#35-01',
        address_line_3: null,
        postal_code: '048616',
      },
    },
    maid_info: {
      id: 'M0123-01D',
      name: 'Siti Nurhaliza',
      date_of_birth: '1988-08-20',
      gender: 'Female',
      phone_number: '56781234',
      nationality: 'INDONESIA',
      passport_number: 'ID823456',
      forgeign_id_number: 'M8234567K',
      coverage_details: [
        {
          id: 10,
          name: 'Letter of Guarantee to Ministry of Manpower (MOM)',
          amount: null,
          notes: '$ 5000',
          sub_details: null,
        },
        {
          id: 11,
          name: 'Personal Accident',
          amount: null,
          notes: null,
          sub_details: [
            {
              name: '(a) Death',
              amount: 60000,
              notes: null,
            },
            {
              name: '(b) Permanent Disability',
              amount: null,
              notes: 'Up to $60,000',
            },
            {
              name: '(c) Accidental Medical Expenses (sub-limit of $200 for TCM)',
              amount: null,
              notes: 'Up to $1,500',
            },
            {
              name: 'Panel Clinics - Co-payment $10 each claim',
              amount: null,
              notes: null,
            },
            {
              name: 'Non-Panel Clinics - Co-payment $30 each claim',
              amount: null,
              notes: null,
            },
          ],
        },
        {
          id: 12,
          name: 'Hospital and Surgical Expenses',
          amount: null,
          notes: null,
          sub_details: [
            {
              name: 'Co-payment per policy year',
              amount: null,
              notes: '$60,000 per policy year',
            },
            {
              name: 'First $15,000: No co-payment',
              amount: '',
              notes: '',
            },
            {
              name: 'From $15,001 onwards: 25% paid by Employer, 75% paid by ECICS',
              amount: '',
              notes: '',
            },
          ],
        },
        {
          id: 13,
          name: 'Daily Hospitalisation Benefit (up to 90 days)',
          amount: null,
          notes: '$15 per day',
        },
        {
          id: 14,
          name: 'Wages and Levy Reimbursement (up to 90 days)',
          amount: null,
          notes: 'Up to $30 per day',
        },
        {
          id: 15,
          name: 'Termination & Re-hiring Expenses',
          amount: null,
          notes: 'Up to $500',
        },
        {
          id: 15,
          name: 'Repatriation Expenses (cover suicide – reimbursement basis capped $3,000)',
          amount: null,
          notes: 'Up to $10,000',
        },
        {
          id: 16,
          name: "Domestic Helper's Liability",
          amount: null,
          notes: 'Up to $10,000',
        },
        {
          id: 17,
          name: 'Special Grant',
          amount: null,
          notes: '$1,000',
        },
        {
          id: 18,
          name: 'Waiver of Counter Indemnity under Section 1 ($250 excess)',
          amount: null,
          notes: 'Covered',
        },
        {
          id: 19,
          name: 'Outpatient Medical Expenses Rider (Maximum Limit $60 each claim)',
          amount: null,
          notes: 'Not Covered',
          sub_details: [
            {
              name: 'Co-payment each claim (Panel Clinics - $10 / Non-Panel Clinics - $30)',
              amount: null,
              notes: null,
            },
          ],
        },
        {
          id: 20,
          name: 'Waiver of Co-Payment Payable by Employer under Section 3',
          amount: null,
          notes: 'Not Covered',
        },
      ],
    },
    policy_no: 'GMA24F0071120',
  },
];

const getPolicy = (payload: any) => {
  const results = MOCK_DATA.map((item, idx) => ({
    id: idx + 1,
    ...item,
  })).filter((item) => {
    if (payload.policyNo) return item.policy_no === payload.policyNo;

    const queryStr = payload.queryStr?.toLowerCase() ?? '';
    return (
      (!payload.policyStatus || payload.policyStatus === item.policy_status) &&
      (!payload.tags || payload.tags.split(',').includes(item.tags)) &&
      (!payload.policyType ||
        payload.policyType === 'all' ||
        payload.policyType === item.policy_type) &&
      (!payload.queryStr ||
        item.policy_no?.toLowerCase()?.startsWith(queryStr) ||
        item.policy_name?.startsWith(queryStr) ||
        item.vehicle?.registration_no?.toLowerCase()?.startsWith(queryStr) ||
        item.maid_info?.name?.toLowerCase()?.startsWith(queryStr))
    );
  });

  const summary = {
    total: MOCK_DATA.length,
    active: MOCK_DATA.filter((item) => item.policy_status === 'active').length,
    pending_renewal: MOCK_DATA.filter((item) => item.tags === 'pending_renewal')
      .length,
    expired: MOCK_DATA.filter((item) => item.policy_status === 'expired')
      .length,
    cancelled: MOCK_DATA.filter((item) => item.tags === 'cancelled').length,
  };

  if (!payload.pageNo || !payload.pageSize) return { summary, results };
  const fromIdx = (payload.pageNo - 1) * payload.pageSize;
  const toIdx = fromIdx + payload.pageSize;

  return { summary, results: results.slice(fromIdx, toIdx) };
};

let timeout: any;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getPolicies<T = PolicyResponse>(
    payload: PolicyPayload,
  ): Promise<AxiosResponse<T>> {
    const params = {
      policyNo: payload?.policyNo ?? undefined,
      queryStr: payload?.queryStr,
      status: payload?.policyStatus,
      type: payload?.policyType,
      tags: payload?.tags,
      pagination: {
        page: payload.pageNo,
        pageSize: payload.pageSize,
      },
    };

    clearTimeout(timeout);
    // return baseClient.get<T>(`${API_POLICY_GET}`, { params });
    return new Promise((resolve) => {
      timeout = setTimeout(
        () => {
          return resolve({
            data: {
              data: getPolicy(payload),
              meta: { pagination: {} },
            } as any,
          });
        },
        Math.ceil(Math.random() * 100 + 50),
      );
    }) as any;
  },
};
