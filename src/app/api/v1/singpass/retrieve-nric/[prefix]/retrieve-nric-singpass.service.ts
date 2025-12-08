import { successRes } from '@/app/api/core/success.response';
import logger from '@/app/api/libs/logger';
import axios from 'axios';
import { compactDecrypt, importJWK, SignJWT } from 'jose';
import { v4 as uuidv4 } from 'uuid';

export async function retrieveNRICFromSingpass(
  code: string,
  code_verifier: string,
  prefix: string,
) {
  try {
    logger.info(`Retrieving NRIC from Singpass with prefix: ${prefix}`);
    const client_assertion = await generateClientAssertion(prefix);
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append(
      'redirect_uri',
      process.env[`${prefix.toUpperCase()}_REDIRECT_URI`]!,
    );
    params.append(
      'client_assertion_type',
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    );
    params.append(
      'client_id',
      process.env[`${prefix.toUpperCase()}_CLIENT_ID`]!,
    );
    params.append('code', code);
    params.append('code_verifier', code_verifier);
    params.append('client_assertion', client_assertion);

    const tokenRes = await axios.post(
      `${process.env.SINGPASS_ISSUER_URL}/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    let nric = null;
    if (tokenRes?.data?.id_token) {
      logger.info(`Token response received`);
      nric = await decryptJWE(tokenRes.data.id_token, prefix);
    }

    return successRes({
      data: nric,
      message: 'Retrieved NRIC successfully',
    });
  } catch (err) {
    logger.error(`Error get NRIC from Singpass: ${err}`);
    throw new Error('Error retrieving NRIC from Singpass');
  }
}

async function generateClientAssertion(prefix: string) {
  const publicKeyFromEnv =
    process.env[`${prefix.toUpperCase()}_KEYS_PRIVATE_SIG_KEY`]!;
  const PUBLICKEY_JWK = JSON.parse(publicKeyFromEnv);

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 300;

  const publicKey = await importJWK(
    PUBLICKEY_JWK,
    PUBLICKEY_JWK.alg || 'ES256',
  );

  const jwtAssertion = await new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: PUBLICKEY_JWK.kid })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setJti(uuidv4())
    .setIssuer(process.env[`${prefix.toUpperCase()}_CLIENT_ID`]!)
    .setSubject(process.env[`${prefix.toUpperCase()}_CLIENT_ID`]!)
    .setAudience(`${process.env.SINGPASS_ISSUER_URL}/token`)
    .sign(publicKey);

  logger.info('Generated client assertion JWT');
  return jwtAssertion;
}

async function decryptJWE(token: string, prefix: string) {
  const ENC_KEY_JWK = JSON.parse(
    process.env[`${prefix.toUpperCase()}_KEYS_PRIVATE_ENC_KEY`]!,
  );
  const encKey = await importJWK(ENC_KEY_JWK, ENC_KEY_JWK.alg);
  const { plaintext } = await compactDecrypt(token, encKey);
  const inner = new TextDecoder().decode(plaintext);
  const parts = inner.split('.');
  const payload = JSON.parse(
    Buffer.from(parts[1], 'base64url').toString('utf8'),
  );
  if (payload) {
    let nric = null;
    if (payload.sub) {
      const match = payload.sub.match(/s=([^,]+)/);
      if (match) {
        logger.info('NRIC retrieved from decrypted token');
        nric = match[1];
      }
    }
    return nric;
  }
}
