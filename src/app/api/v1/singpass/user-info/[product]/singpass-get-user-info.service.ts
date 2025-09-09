import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import createSingpassClient from '@/app/api/libs/singpass/singpassClient';

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

    return successRes({
      data: userInfo,
      message: 'User info retrieved successfully',
    });
  } catch (err) {
    logger.error(`Error get user info Singpass for product ${product}: ${err}`);
    throw new Error('Error retrieving user info from Singpass');
  }
}
