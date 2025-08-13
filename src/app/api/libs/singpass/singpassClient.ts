import { Client, Issuer } from 'openid-client';

import logger from '../logger';

const createSingpassClient = async (product: string): Promise<Client> => {
  const prefix = product.toUpperCase(); // e.g., CAR, MAID

  const issuerUrl = process.env[`SINGPASS_ISSUER_URL`];
  const clientId = process.env[`${prefix}_CLIENT_ID`];
  const sigKey = JSON.parse(
    process.env[`${prefix}_KEYS_PRIVATE_SIG_KEY`] || '{}',
  );
  const encKey = JSON.parse(
    process.env[`${prefix}_KEYS_PRIVATE_ENC_KEY`] || '{}',
  );

  logger.info(
    `Creating Singpass client for product: ${product}, clientId: ${clientId}`,
  );

  if (!issuerUrl || !clientId || !sigKey || !encKey) {
    throw new Error(`Missing environment variables for product: ${product}`);
  }

  const issuer = await Issuer.discover(issuerUrl);

  return new issuer.Client(
    {
      client_id: clientId,
      response_types: ['code'],
      token_endpoint_auth_method: 'private_key_jwt',
      id_token_signed_response_alg: 'ES256',
      userinfo_encrypted_response_alg: encKey.alg,
      userinfo_encrypted_response_enc: 'A256GCM',
      userinfo_signed_response_alg: sigKey.alg,
    },
    { keys: [sigKey, encKey] },
  );
};

export default createSingpassClient;
