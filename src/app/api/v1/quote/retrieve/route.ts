import { NextRequest } from 'next/server';

import { successRes } from '@/app/api/core/success.response';
import { requestHandler } from '@/app/api/middleware/requestHandler';

import { retrieveQuoteDTOSchema } from './retrieve-quote.dto';
import { retrieveQuote } from './retrieve-quote.service';

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = retrieveQuoteDTOSchema.parse(body);
  const result = await retrieveQuote(data);

  return successRes(result);
});
