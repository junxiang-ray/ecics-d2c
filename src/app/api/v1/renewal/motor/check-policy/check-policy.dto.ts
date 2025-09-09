import { z } from 'zod';

export const checkPolicySchema = z.object({
  veh_reg_no: z.string().min(1, 'Vehicle registration number is required'),
  passphrase: z.string().min(1, 'Passphrase is required'),
});

export type checkPolicyDTO = z.infer<typeof checkPolicySchema>;
