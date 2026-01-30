import { z } from 'zod';

export const paymentPolicySchema = z.object({
  email_address: z.string().min(1, 'Email address is required'),
  contact_no: z.string().min(1, 'Contact number is required'),
  proposal_id: z.string().min(1, 'Proposal ID is required'),
  address_line1: z.string().min(1, 'Address line 1 is required'),
  address_line2: z.string().optional(),
  address_line3: z.string().optional(),
  postal: z.string().min(1, 'Postal code is required'),
  marital_status_code: z.string().min(1, 'Marital status code is required'),
});

export type paymentPolicyDTO = z.infer<typeof paymentPolicySchema>;
