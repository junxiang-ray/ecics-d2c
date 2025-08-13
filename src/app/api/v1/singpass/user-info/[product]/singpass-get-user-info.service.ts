import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import createSingpassClient from '@/app/api/libs/singpass/singpassClient';
import { prisma } from '@/app/api/libs/prisma';

export async function GetUserInfoFromSingpassService(
  product: string,
  code: string,
  code_verifier: string,
  nonce: string,
  state: string,
) {
  try {
    const client = await createSingpassClient(product);
    const redirectUri = process.env[`${product.toUpperCase()}_REDIRECT_URI`];

    const tokenSet = await client.callback(
      redirectUri,
      {
        code,
        state,
      },
      {
        code_verifier,
        nonce,
        state,
      },
    );

    const userInfo = await client.userinfo(tokenSet);
    logger.info(
      `User info retrieved for product ${product}: ${JSON.stringify(userInfo)}`,
    );

    //customize create mock data for the user info
    if (userInfo && userInfo.uinfin) {
      const uinfinObj = userInfo.uinfin as { value: string };
      const customUserInfo = await prisma.singpassData.findFirst({
        where: { uinfin: uinfinObj.value },
      });

      logger.info(`The custom user info: ${JSON.stringify(customUserInfo)}`);
      if (customUserInfo) {
        return successRes({
          data: customUserInfo.value,
          message: 'User info retrieved successfully',
        });
      }

      return successRes({
        data: userInfo,
        message: 'User info retrieved successfully',
      });
    }
  } catch (err) {
    logger.error(`Error get user info Singpass for product ${product}: ${err}`);
    throw new Error('Error retrieving user info from Singpass');
  }
}
