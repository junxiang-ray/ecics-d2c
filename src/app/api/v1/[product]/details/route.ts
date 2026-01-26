import { NextRequest, NextResponse } from 'next/server';

import logger from '@/app/api/libs/logger';

import { getDetailsHomeContents } from './get-details.service';

export async function POST(
  req: NextRequest,
  context: { params: { product: string } },
) {
  const productName = context.params.product;

  logger.info(`Received request to get product details:`);

  switch (productName) {
    // case PRODUCT_NAME.CAR:
    //   return saveProposalForCar(body);
    // case PRODUCT_NAME.MAID:
    //   return saveProposalForMaid(body);
    // case PRODUCT_NAME.MOTORCYCLE:
    //   return saveProposalForMotorcycle(body);
    case 'b2c_hc':
      return getDetailsHomeContents();
    default:
      return NextResponse.json(
        { error: 'Unsupported product' },
        { status: 400 },
      );
  }
}
