import {
  Policy,
  // PolicyStatus,
  PolicyType,
  // PolicyTag,
} from '@/libs/types/policy';
import { MaritalStatus, Gender } from '@/libs/types/common';
import { computePolicyStatus, computePolicyTag } from '@/libs/utils/policy';

/**
 * REAL API policy shape.
 * This is intentionally isolated from frontend domain types.
 */
export type RealApiPolicy = {
  POLICY_NUMBER: string;
  INSDNAME: string;
  POL_EXPDATE: string;
  summary: {
    policy_type: string;
    policy_number: string;
    data: {
      policy_details: {
        status: string;
        data: {
          policy_number: string;
          type_of_policy: string;
          start_date: string;
          end_date: string;
          plan_type: string;
          scheme: string;
          intermediary_name: string;
          premium: string;
          policy_status: string;
          tags: string;
        };
      };
      vehicle_details?: {
        status: string;
        data: {
          registration_number: string;
          make_model: string;
          chassis_number: string;
          engine_motor_number: string;
          capacity: number;
          registration_year: number;
          hire_purchase_company: string;
        };
      };
      excess_text?: {
        status: string;
        data: {
          policy_excess: Array<{
            title: string;
            subtitle: string;
            value: string;
          }>;
          additional_excess: Array<{
            title: string;
            subtitle: string;
            value: string;
          }>;
        };
      };
      insured_drivers?: {
        status: string;
        data: {
          named_drivers: Array<{
            sequence: number;
            name: string;
            nric: string;
            date_of_birth: string;
            marital_status: string;
            gender: string;
            driving_experience: number;
          }>;
        };
      };
      lower_text?: {
        status: string;
        data: {
          endorsements: Record<string, string>;
        };
      };
      policy_clauses?: {
        status: string;
        data: {
          clauses: Array<{
            seq_no: number;
            code: string;
            title: string;
          }>;
        };
      };
      policyholder_details?: {
        status: string;
        data: {
          full_name: string;
          mobile_number: number | string;
          email?: string;
          address_line_1: string;
          address_line_2?: string;
          address_line_3?: string;
          postal_code: number | string;
          marital_status?: string; // now "M", "S", etc
        };
      };
    };
  };
};

/**
 * Maps REAL API policy into canonical frontend Policy.
 * MOCK_DATA is the source of truth for representation.
 */
export const mapRealApiPolicyToPolicy = (
  apiPolicy: RealApiPolicy,
  index: number,
): Policy => {
  const details = apiPolicy.summary.data.policy_details.data;
  const computedStatus = computePolicyStatus(
    details.policy_status,
    details.start_date,
    details.end_date,
  );

  const computedTag = computePolicyTag(computedStatus, details.end_date);

  const vehicle = apiPolicy.summary.data.vehicle_details?.data;
  const excess = apiPolicy.summary.data.excess_text?.data;
  const drivers =
    apiPolicy.summary.data.insured_drivers?.data?.named_drivers ?? [];

  const policyHolderDetails = apiPolicy.summary.data.policyholder_details?.data;

  const lowerText = apiPolicy.summary.data.lower_text?.data;
  const policyClauses = apiPolicy.summary.data.policy_clauses?.data;

  const policyType = normalizePolicyType(apiPolicy.summary.policy_type);
  const isMotorPolicy = policyType === 'car' || policyType === 'motorcycle';
  const isMaidPolicy = policyType === 'maid';

  const mainDriver = drivers.find((d) => d.sequence === 1);

  return {
    /* =====================================================
     * Identity
     * ===================================================== */
    id: index + 1,
    policy_no: apiPolicy.POLICY_NUMBER,
    policy_type: policyType,
    policy_type_name: details.type_of_policy,
    policy_name: details.type_of_policy.toLowerCase(),

    /* =====================================================
     * Dates
     * ===================================================== */
    start_date: stripTime(details.start_date),
    end_date: stripTime(details.end_date),
    expire_date: stripTime(apiPolicy.POL_EXPDATE),
    issue_date: stripTime(details.start_date), // TEMP (MOCK_DATA-compatible)

    /* =====================================================
     * Plan
     * ===================================================== */
    plan: {
      plan_code: 'c', // TEMP until backend provides
      plan_name: details.plan_type,
    },

    scheme: details.scheme,
    intermediary_name: details.intermediary_name,

    /* =====================================================
     * Financial
     * ===================================================== */
    premium: Number(details.premium),

    /* =====================================================
     * Status / Tags
     * ===================================================== */
    // policy_status: normalizePolicyStatus(details.policy_status),
    // tags: details.tags as PolicyTag,
    policy_status: computedStatus,
    tags: computedTag,

    /* =====================================================
     * Policy Holder
     * ===================================================== */
    // policy_holder: {
    //   name: apiPolicy.INSDNAME,
    //   marital_status: normalizeMaritalStatus(
    //     mainDriver?.marital_status,
    //   ),
    //   mobile: '9999999999',
    //   email: 'DUMMY_DATA_EMAIL',
    //   address: {
    //     address_line_1: 'DUMMY_DATA_ADDRESS_LINE_1',
    //     address_line_2: 'DUMMY_DATA_ADDRESS_LINE_2',
    //     address_line_3: undefined,
    //     postal_code: '999999',
    //   },
    // },

    /* =====================================================
     * Drivers (motor only)
     * ===================================================== */
    drivers:
      isMotorPolicy && drivers.length
        ? drivers.map((d) => ({
            name: d.name,
            is_main_driver: d.sequence === 1,
            gender: normalizeGender(d.gender),
            nric_or_fin: d.nric,
            marital_status: normalizeMaritalStatus(d.marital_status),
            date_of_birth: stripTime(d.date_of_birth),
            driving_experience: d.driving_experience,
          }))
        : undefined,

    /* =====================================================
     * Vehicle (motor only)
     * ===================================================== */
    vehicle:
      isMotorPolicy && vehicle
        ? {
            registration_no: vehicle.registration_number,
            chassis_no: vehicle.chassis_number,
            engine_no: vehicle.engine_motor_number,
            engine_capacity: `${vehicle.capacity} CC`,
            vehicle_usage: 'MOTOR',
            vehicle_make: vehicle.make_model,
            first_registered_year: String(vehicle.registration_year),
            hire_purchase_company: vehicle.hire_purchase_company,
          }
        : undefined,

    /* =====================================================
     * Excess (motor only)
     * ===================================================== */
    excess:
      isMotorPolicy && excess
        ? {
            policy_excess: excess.policy_excess.map((e) => ({
              name: e.title,
              description: e.subtitle,
              amount: e.value,
            })),
            additional_excess: excess.additional_excess.map((e) => ({
              name: e.title,
              description: e.subtitle,
              amount: e.value,
            })),
          }
        : undefined,

    /* =====================================================
     * Maid Info (maid only)
     * ===================================================== */
    maid_info: isMaidPolicy
      ? {
          id: '',
          name: '',
          date_of_birth: '',
          gender: 'FEMALE',
          phone_number: '',
          nationality: '',
          passport_number: '',
          fin: '',
          coverage_details: [],
        }
      : undefined,

    /* =====================================================
     * Lower Text / Endorsements
     * ===================================================== */
    lower_text: lowerText
      ? {
          endorsements: lowerText.endorsements,
        }
      : undefined,

    /* =====================================================
     * Policy Clauses
     * ===================================================== */
    policy_clauses: policyClauses
      ? {
          clauses: policyClauses.clauses.map((c) => ({
            seq_no: c.seq_no,
            code: c.code,
            title: c.title,
          })),
        }
      : undefined,

    policy_holder: {
      name: policyHolderDetails?.full_name ?? apiPolicy.INSDNAME,

      marital_status: normalizeMaritalStatus(
        policyHolderDetails?.marital_status ?? mainDriver?.marital_status,
      ),

      mobile: policyHolderDetails?.mobile_number
        ? String(policyHolderDetails.mobile_number)
        : '9999999999',

      email: policyHolderDetails?.email ?? 'DUMMY_DATA_EMAIL',

      address: {
        address_line_1:
          policyHolderDetails?.address_line_1 ?? 'DUMMY_DATA_ADDRESS_LINE_1',

        address_line_2:
          policyHolderDetails?.address_line_2 ?? 'DUMMY_DATA_ADDRESS_LINE_2',

        address_line_3: policyHolderDetails?.address_line_3,

        postal_code: policyHolderDetails?.postal_code
          ? String(policyHolderDetails.postal_code)
          : '999999',
      },
    },
  };
};

/* =========================================================
 * Helpers
 * ========================================================= */

const stripTime = (value: string): string => value.split('T')[0];

const normalizePolicyType = (type: string): PolicyType => {
  switch (type.toUpperCase()) {
    case 'MOTOR':
      return 'car';
    case 'MOTORCYCLE':
      return 'motorcycle';
    case 'MAID':
      return 'maid';
    case 'TRAVEL':
      return 'travel';
    case 'HOME':
      return 'home';
    default:
      return 'all';
  }
};

// const normalizePolicyStatus = (status: string): PolicyStatus => {
//   switch (status.toLowerCase()) {
//     case 'active':
//       return 'active';
//     case 'expired':
//       return 'expired';
//     case 'cancelled':
//       return 'cancelled';
//     default:
//       return 'pending';
//   }
// };

const normalizeMaritalStatus = (m?: string): MaritalStatus => {
  switch (m) {
    case 'M':
      return 'MARRIED';
    case 'D':
      return 'DIVORCED';
    case 'W':
      return 'WIDOWED';
    case 'S':
    default:
      return 'SINGLE';
  }
};

const normalizeGender = (g?: string): Gender => {
  if (!g) return 'MALE';
  return g.toUpperCase().startsWith('F') ? 'FEMALE' : 'MALE';
};
