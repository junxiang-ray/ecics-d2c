import { NextRequest } from 'next/server';

import { retrievePolicySchema } from './retrieve-policy.dto';
import { retrievePoliciesFromISP } from './retrieve-policy.service';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const data = retrievePolicySchema.parse(bodyData);
  return await retrievePoliciesFromISP(data);
}
