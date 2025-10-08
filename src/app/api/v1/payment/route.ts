import { NextRequest } from 'next/server';

import { paymentDTOSchema } from './payment.dto';
import { handleMotorcyclePayment, handlePayment } from './payment.service';
import { successRes } from '../../core/success.response';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = paymentDTOSchema.parse(body);
  let result;
  if (data.product_type) {
    result = await handleMotorcyclePayment(data);
  } else {
    result = await handlePayment(data);
  }

  return successRes({
    message: 'Payment processed successfully',
    data: result,
  });
}
