import { z } from 'zod';

export const paymentDTOSchema = z.object({
  key: z.string().min(1, 'Key quote is required'),
  product_type: z.string().optional(),
});

export type paymentDTO = z.infer<typeof paymentDTOSchema>;
