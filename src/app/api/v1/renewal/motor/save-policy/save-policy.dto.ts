import { z } from 'zod';

export const savePolicySchema = z.object({
  proposal_id: z.string().min(1, 'Proposal ID is required'),
  policy_id: z.string().min(1, 'Policy ID is required'),
  key: z.string().min(1, 'Key is required'),
  renewal_data: z.object({}).passthrough(),
});

export type savePolicyDTO = z.infer<typeof savePolicySchema>;
