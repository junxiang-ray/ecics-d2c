import { NextRequest } from 'next/server';

import { ErrBadRequest } from '@/app/api/core/error.response';
import { successRes } from '@/app/api/core/success.response';
import { requestHandler } from '@/app/api/middleware/requestHandler';

import { saveQuoteDTOSchema } from './quote.dto';
import { saveQuote } from './quote.service';

export const POST = requestHandler(async (req: NextRequest) => {
  const body = await req.json(); //user request
  console.log('body before saveQuooteDTO', body);
  const data = saveQuoteDTOSchema.parse(body); //(zod validation) typescript understands that thsi is of saveQuoteDTO
  const result = await saveQuote(data); //save into the database

  if (!result.data) {
    return ErrBadRequest(result.message);
  }

  return successRes(result);
});
