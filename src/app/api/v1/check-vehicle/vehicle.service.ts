import logger from '@/app/api/libs/logger';
import { prisma } from '@/app/api/libs/prisma';

import { checkVehicleDTO } from './check-vechicle.dto';
import apiCheckVehicle from '../../configs/api-check-vehicle.config';
import { successRes } from '../../core/success.response';

export async function checkVehicleMakeAndModel({
  vehicle_make,
  vehicle_model,
  vehicle_capacity,
  vehicle_type,
}: checkVehicleDTO) {
  try {
    const [{ data: dataFromAIAgent }, vehicle_make_info, vehicle_model_info] =
      await Promise.all([
        apiCheckVehicle.get(`/motor`, {
          params: {
            make: vehicle_make,
            model: vehicle_model,
            capacity: vehicle_capacity,
            type: vehicle_type,
          },
        }),
        prisma.vehicleMake.findFirst({
          where: {
            name: {
              equals: vehicle_make,
              mode: 'insensitive',
            },
            product_type: {
              name: vehicle_type === 'motor' ? 'car' : vehicle_type,
            },
          },
        }),
        prisma.vehicleModel.findFirst({
          where: {
            name: {
              equals: vehicle_model,
              mode: 'insensitive',
            },
            product_type: {
              name: vehicle_type === 'motor' ? 'car' : vehicle_type,
            },
          },
        }),
      ]);

    logger.info(
      `Vehicle data from AI agent: ${JSON.stringify(dataFromAIAgent)}`,
    );
    logger.info(`Vehicle make info: ${JSON.stringify(vehicle_make_info)}`);
    logger.info(`Vehicle model info: ${JSON.stringify(vehicle_model_info)}`);

    return successRes({
      data: {
        ...dataFromAIAgent.body,
        vehicle_make_id: vehicle_make_info?.id || null,
        vehicle_model_id: vehicle_model_info?.id || null,
      },
      message: 'Check vehicle make and model successfully',
    });
  } catch (error) {
    logger.error(
      `Error occurred while checking vehicle make and model: ${error}`,
    );
    throw new Error('Error occurred while checking vehicle make and model');
  }
}
