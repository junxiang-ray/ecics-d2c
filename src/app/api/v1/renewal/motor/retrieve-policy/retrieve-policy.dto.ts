import { z } from 'zod';

export const retrievePolicySchema = z.object({
  nric: z.string().min(9, 'NRIC is required'),
});

export type retrievePolicyDTO = z.infer<typeof retrievePolicySchema>;
