import { CAR_INSURANCE } from '@/app/api/constants/car.insurance';
import { ErrNotFound } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import { prisma } from '@/app/api/libs/prisma';
import { addonToQuickProposalMap } from '@/app/api/utils/quote.helpers';

export async function saveProposalForCar(data: any) {
  const { key, selected_plan, selected_addons, add_named_driver_info } = data;

  const quoteInfo = await prisma.quote.findFirst({
    where: {
      key: key,
    },
    select: {
      quote_id: true,
      proposal_id: true,
    },
  });

  if (!quoteInfo) {
    return ErrNotFound('Quote not found');
  }

  const { quote_id, proposal_id } = quoteInfo;
  const payload: any = {
    proposal_id,
    quote_id,
    quick_proposal_plan: selected_plan,
    __finalize: 0,
    redirect_url: `${process.env.NEXT_PUBLIC_REDIRECT_PAYMENT_WEBSITE}?key=${key}`,
    return_baseurl: process.env.NEXT_PUBLIC_CALLBACK_PAYMENT_URL,
  };

  for (const [addonKey, quickKey] of Object.entries(addonToQuickProposalMap)) {
    payload[quickKey] = selected_addons[addonKey] || 'NO';
  }

  // update quick_proposal_any_workshop and quick_proposal_excess based on selected_plan
  if (selected_plan !== CAR_INSURANCE.PLAN_NAME.COM) {
    payload.quick_proposal_any_workshop = 'N.A.';
    payload.quick_proposal_excess = 'N.A.';
  }

  // Add-on LOU & cc
  const louValue = selected_addons['CAR_COM_LOU'];

  switch (louValue) {
    case 'YES':
      payload.quick_proposal_lou = 'YES';
      payload.quick_proposal_cc = 'NO';
      break;
    case 'YES (up to 1,600cc)':
      payload.quick_proposal_lou = 'NO';
      payload.quick_proposal_cc = 'YES (up to 1,600cc)';
      break;
    case 'YES (up to 2,000cc)':
      payload.quick_proposal_lou = 'NO';
      payload.quick_proposal_cc = 'YES (up to 2,000cc)';
      break;
    default:
      payload.quick_proposal_lou = 'NO';
      payload.quick_proposal_cc = 'NO';
      break;
  }

  // Add-on additional driver
  if (selected_addons['CAR_COM_AND'] === 'all_drivers') {
    payload.quick_proposal_has_addl_driver = 'NO';
    payload.quick_proposal_has_yied_driver = 'YES';
  } else if (selected_addons['CAR_COM_AND'] === 'drivers_age_from_27_to_70') {
    payload.quick_proposal_has_addl_driver = 'YES';
    payload.quick_proposal_has_yied_driver = 'NO';
  } else {
    payload.quick_proposal_has_addl_driver = 'NO';
    payload.quick_proposal_has_yied_driver = 'NO';
  }

  // Add named driver information
  for (let i = 0; i < 3; i++) {
    const driver = add_named_driver_info[i];
    payload[`quick_proposal_addl_nd${i + 1}_name`] = driver?.name || '';
    payload[`quick_proposal_addl_nd${i + 1}_dob`] = driver?.date_of_birth || '';
    payload[`quick_proposal_addl_nd${i + 1}_drv_exp`] =
      driver?.driving_experience ?? '';
    payload[`quick_proposal_addl_nd${i + 1}_nric`] = driver?.nric_or_fin || '';
    payload[`quick_proposal_addl_nd${i + 1}_gender`] = driver?.gender || '';
    payload[`quick_proposal_addl_nd${i + 1}_marital_status`] =
      driver?.marital_status || '';
  }

  return successRes({
    message: 'Proposal saved successfully',
    data: payload,
  });
}
