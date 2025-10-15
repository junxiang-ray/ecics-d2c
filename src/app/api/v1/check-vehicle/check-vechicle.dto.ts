import { z } from 'zod';

export const checkVehicleDTOSchema = z.object({
  vehicle_make: z.string().min(1, 'Vehicle make is required'),
  vehicle_model: z.string().min(1, 'Vehicle model is required'),
  vehicle_capacity: z.string().min(1, 'Vehicle capacity is required'),
  vehicle_type: z.string().min(1, 'Vehicle type is required'),
});

export type checkVehicleDTO = z.infer<typeof checkVehicleDTOSchema>;
