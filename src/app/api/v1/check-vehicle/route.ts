import { NextRequest } from 'next/server';
import { z } from 'zod';

import { checkVehicleDTOSchema } from './check-vechicle.dto';
import { checkVehicleMakeAndModel } from './vehicle.service';
import { ErrBadRequest } from '../../core/error.response';
import logger from '../../libs/logger';

export const GET = async (
  req: NextRequest,
  context: {
    params: {
      vehicle_make: string;
      vehicle_model: string;
      vehicle_type: string;
      vehicle_capacity: string;
    };
  },
) => {
  const { searchParams } = new URL(req.url);
  const queryParams = {
    vehicle_make: searchParams.get('vehicle_make') || '',
    vehicle_model: searchParams.get('vehicle_model') || '',
    vehicle_type: searchParams.get('vehicle_type') || '',
    vehicle_capacity: searchParams.get('vehicle_capacity') || '',
  };

  try {
    checkVehicleDTOSchema.parse(queryParams);
    return await checkVehicleMakeAndModel(queryParams);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(`Validation error: ${JSON.stringify(error)}`);
      return ErrBadRequest(error.errors[0].message);
    }
  }
};
