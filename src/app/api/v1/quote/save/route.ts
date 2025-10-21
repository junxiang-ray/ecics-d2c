import { NextRequest } from 'next/server';

import { ErrBadRequest } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import { requestHandler } from '@/app/api/middleware/requestHandler';

import { saveQuoteDTOSchema } from './quote.dto';
import { saveQuote } from './quote.service';

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = saveQuoteDTOSchema.parse(body);
  const result = await saveQuote(data);

  if (!result.data) {
    return ErrBadRequest(result.message);
  }

  return successRes(result);
});
