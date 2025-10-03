import { NextRequest } from 'next/server';
import { updatePolicySchema } from './update-policy.dto';
import { updatePoliciesFromISP } from './update-policy.service';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const data = updatePolicySchema.parse(bodyData);
  return await updatePoliciesFromISP(data);
}
