import { NextRequest, NextResponse } from 'next/server';

import logger from '@/app/api/libs/logger';

import { getCalcHomeContents } from './calc.service';

export async function POST(
  req: NextRequest,
  context: { params: { product: string } },
) {
  const body = await req.json();
  const productName = context.params.product;

  logger.info(`Received request to get calc:`);

  switch (productName) {
    // case PRODUCT_NAME.CAR:
    //   return saveProposalForCar(body);
    // case PRODUCT_NAME.MAID:
    //   return saveProposalForMaid(body);
    // case PRODUCT_NAME.MOTORCYCLE:
    //   return saveProposalForMotorcycle(body);
    case 'b2c_hc':
      return getCalcHomeContents(body);
    default:
      return NextResponse.json(
        { error: 'Unsupported product' },
        { status: 400 },
      );
  }
}
