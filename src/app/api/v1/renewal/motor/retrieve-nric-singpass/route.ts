import { NextRequest } from 'next/server';

import logger from '@/app/api/libs/logger';

import { retrieveNRICFromSingpass } from './retrieve-nric-singpass.service';

export const POST = async (req: NextRequest) => {
  const { code, code_verifier } = await req.json();

  logger.info(
    `Get user info with Singpass with code: ${code}, code_verifier: ${code_verifier}`,
  );

  return await retrieveNRICFromSingpass(code, code_verifier);
};
