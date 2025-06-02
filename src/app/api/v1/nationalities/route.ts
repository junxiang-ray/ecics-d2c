import { NextRequest } from 'next/server';
import { successRes } from '../../core/success.response';
import { ErrBadRequest } from '../../core/error.response';
import { prisma } from '../../libs/prisma';

export const GET = async (req: NextRequest) => {
  const results = await prisma.countryNationality.findMany();

  return successRes({
    data: results,
    message: 'Get vehicle makes successfully',
  });
};
