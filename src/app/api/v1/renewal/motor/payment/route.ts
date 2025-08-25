import { NextRequest } from 'next/server';
import { paymentPolicySchema } from './payment.dto';
import { paymentPolicyFromISP } from './payment.service';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const data = paymentPolicySchema.parse(bodyData);
  return await paymentPolicyFromISP(data);
}
