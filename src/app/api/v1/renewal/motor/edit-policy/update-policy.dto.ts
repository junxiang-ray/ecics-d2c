import { z } from 'zod';

export const updatePolicySchema = z.object({
  policy_id: z.string().min(1, 'Policy ID is required'),
  proposal_id: z.string().min(1, 'Proposal ID is required'),
  veh_reg_no: z.string().min(1, 'Vehicle Registration Number is required'),
  passphrase: z.string().min(1, 'Passphrase is required'),
  email_address: z.string().optional(),
  contact_no: z.string().optional(),
  renewal_end_date: z.string().min(1, 'Renewal End Date is required'),
  selected_add_on_optional_benefits: z.array(z.any()),
  finalize_renewal: z.boolean().default(false),
});

export type updatePolicyDTO = z.infer<typeof updatePolicySchema>;
