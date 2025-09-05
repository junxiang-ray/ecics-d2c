import { NextRequest } from 'next/server';
import { paymentResultDTOSchema } from './payment-result.dto';
import { handlePaymentResult } from './payment-result.service';
import logger from '@/app/api/libs/logger';

export async function POST(req: NextRequest) {
  logger.info('Callback payment renewal');
  const rawBody = await req.text();

  const params = new URLSearchParams(rawBody);
  logger.info(`Received payment result params: ${params.toString()}`);

  const body: Record<string, string> = {};
  params.forEach((value, key) => {
    body[key] = value;
  });

  logger.info(`Parsed payment result body: ${JSON.stringify(body)}`);

  const data = paymentResultDTOSchema.parse(body);
  return await handlePaymentResult(data);
}
