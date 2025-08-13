import { NextRequest, NextResponse } from 'next/server';
import { ErrBadRequest } from '@/app/api/core/error.response';
import logger from '@/app/api/libs/logger';
import { GetUserInfoFromSingpassService } from './singpass-get-user-info.service';

export const POST = async (
  req: NextRequest,
  context: { params: { product: string } },
) => {
  const product = context.params.product;
  const { code, code_verifier, nonce, state } = await req.json();

  logger.info(
    `Get user info with Singpass for product: ${product}, with data: ${JSON.stringify(req.json())}`,
  );

  if (!product) {
    return ErrBadRequest('Product is required');
  }

  return await GetUserInfoFromSingpassService(
    product,
    code,
    code_verifier,
    nonce,
    state,
  );
};
