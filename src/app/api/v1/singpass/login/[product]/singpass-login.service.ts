import * as crypto from 'crypto';
import { generators } from 'openid-client';

import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import createSingpassClient from '@/app/api/libs/singpass/singpassClient';

export async function LoginSingpassService(product: string) {
  try {
    const client = await createSingpassClient(product);
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const nonce = crypto.randomUUID();
    const state = crypto.randomBytes(16).toString('hex');
    const redirectUri =
      process.env[`${product.toUpperCase()}_REDIRECT_URI`] || '';
    const scope = process.env[`${product.toUpperCase()}_SCOPES`] || '';

    const url = client.authorizationUrl({
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge,
      nonce,
      state,
      scope,
    });

    logger.info(
      `Generated Singpass login URL for product ${product}: url${url}, code_verifier: ${code_verifier}, nonce: ${nonce}, state: ${state}`,
    );

    return successRes({
      data: {
        url,
        code_verifier,
        nonce,
        state,
      },
      message: 'Login URL generated successfully',
    });
  } catch (err) {
    logger.error(
      `Error generating Singpass login URL for product ${product}: ${err}`,
    );
    throw new Error('Error generating Singpass login');
  }
}
