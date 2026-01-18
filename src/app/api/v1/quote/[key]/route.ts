import { NextRequest, NextResponse } from 'next/server';

import { successRes } from '@/app/api/core/success.response';

import { QUOTE_MESSAGES } from './quote.contants';
import { getQuoteByKey } from './quote.service';

export const GET = async (
  req: NextRequest,
  context: { params: { key: string } },
) => {
  const { key } = context.params;

  if (!key) {
    return NextResponse.json(
      { message: QUOTE_MESSAGES.QUOTE_KEY_REQUIRED },
      { status: 400 },
    );
  }

  const result = await getQuoteByKey(key);
  console.log('result after the backend fetching', result);
  return successRes(result);
};
