import { NextRequest, NextResponse } from 'next/server';
import { ErrBadRequest } from '@/app/api/core/error.response';
import { LoginSingpassService } from './singpass-login.service';
import logger from '@/app/api/libs/logger';

export const GET = async (
  req: NextRequest,
  context: { params: { product: string } },
) => {
  const product = context.params.product;
  logger.info(`Received request for Singpass login with product: ${product}`);

  if (!product) {
    return ErrBadRequest('Product is required');
  }

  return await LoginSingpassService(product);
};
