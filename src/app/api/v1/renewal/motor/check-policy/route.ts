import { NextRequest } from 'next/server';
import { checkPolicySchema } from './check-policy.dto';
import { checkPolicyFromISP } from './check-policy.service';
import { z } from 'zod';
import logger from '@/app/api/libs/logger';
import { ErrBadRequest } from '@/app/api/core/error.response';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const data = checkPolicySchema.parse(bodyData);
  return await checkPolicyFromISP(data);
}
