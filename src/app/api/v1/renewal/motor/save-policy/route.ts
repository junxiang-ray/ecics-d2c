import { NextRequest } from 'next/server';

import { savePolicySchema } from './save-policy.dto';
import { savePolicyFromISP } from './save-policy.service';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const data = savePolicySchema.parse(bodyData);
  return await savePolicyFromISP(data);
}
