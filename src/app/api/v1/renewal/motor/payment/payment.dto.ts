import { z } from 'zod';

export const paymentPolicySchema = z.object({
  email_address: z.string().min(1, 'Email address is required'),
  contact_no: z.string().min(1, 'Contact number is required'),
  proposal_id: z.string().min(1, 'Proposal ID is required'),
});

export type paymentPolicyDTO = z.infer<typeof paymentPolicySchema>;
