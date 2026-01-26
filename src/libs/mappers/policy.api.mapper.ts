/**
 * API → MOCK_DATA format mapper
 * --------------------------------
 * This intentionally ignores strict typings.
 * Shape matches MOCK_DATA exactly.
 */
//src/libs/mappers/policy.api.mappers.ts
export const mapApiPolicyToMockPolicy = (api: any) => {
  const details = api.summary.data.policy_details.data;
  const vehicle = api.summary.data.vehicle_details?.data;
  const excess = api.summary.data.excess_text?.data;
  const drivers = api.summary.data.insured_drivers?.data?.named_drivers;

  return {
    policy_type: api.summary.policy_type.toLowerCase(), // 'car'
    policy_type_name: details.type_of_policy,
    policy_name: details.type_of_policy,

    start_date: details.start_date,
    end_date: details.end_date,
    expire_date: api.POL_EXPDATE,
    issue_date: details.start_date,

    plan: {
      plan_code: details.plan_type,
      plan_name: details.plan_type,
    },

    scheme: details.scheme,
    intermediary_name: details.intermediary_name,

    premium: Number(details.premium),
    policy_status: details.policy_status.toLowerCase(),
    tags: details.tags ?? null,

    policy_holder: {
      name: api.INSDNAME,
      marital_status: '',
      mobile: '',
      email: '',
      address: {
        address_line_1: '',
        address_line_2: '',
        address_line_3: null,
        postal_code: '',
      },
    },

    drivers:
      drivers?.map((d: any) => ({
        name: d.name,
        is_main_driver: d.sequence === 1,
        gender: d.gender,
        nric_or_fin: d.nric,
        date_of_birth: d.date_of_birth,
        marital_status: d.marital_status,
        driving_experience: d.driving_experience,
      })) ?? [],

    vehicle: {
      registration_number: vehicle?.registration_number ?? '',
      chassis_no: vehicle?.chassis_number ?? '',
      engine_capacity: vehicle ? `${vehicle.capacity} CC` : '',
      vehicle_usage: details.type_of_policy,
      vehicle_make: vehicle?.make_model ?? '',
      engine_no: vehicle?.engine_motor_number ?? '',
      first_registered_year: vehicle?.registration_year ?? '',
      hire_purchase_company: vehicle?.hire_purchase_company ?? '',
      registration_no: vehicle?.registration_number ?? '',
    },

    excess: {
      policy_excess:
        excess?.policy_excess?.map((e: any) => ({
          name: e.title,
          description: e.subtitle,
          amount: e.value,
        })) ?? [],
      additional_excess:
        excess?.additional_excess?.map((e: any) => ({
          name: e.title,
          description: e.subtitle,
          amount: e.value,
        })) ?? [],
    },

    policy_no: api.POLICY_NUMBER,
  };
};
