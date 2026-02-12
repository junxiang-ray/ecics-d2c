// src/app/api/v1/auth/cognito-custom-auth/route.ts
import { NextResponse } from 'next/server';
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';
import { COOKIE_NAME } from '@/constants/general.constant';
import { encryptValue, encodeToBase64 } from '@/libs/utils/secureStorage-utils';
import { PortalAuthPayload } from '@/libs/types/auth';

function generateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string,
) {
  return crypto
    .createHmac('sha256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, nric, phone } = body;

    if (!email || !nric) {
      return NextResponse.json(
        { success: false, message: 'Email and NRIC are required' },
        { status: 400 },
      );
    }

    // ✅ Validate all required env vars
    const AWS_REGION = process.env.AWS_REGION;
    const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
    const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
    const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
    const COOKIE_PASSPHRASE = process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE;

    if (
      !AWS_REGION ||
      !USER_POOL_ID ||
      !CLIENT_ID ||
      !CLIENT_SECRET ||
      !COOKIE_PASSPHRASE
    ) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 },
      );
    }

    const client = new CognitoIdentityProviderClient({
      region: AWS_REGION,
    });

    const SECRET_HASH = generateSecretHash(email, CLIENT_ID, CLIENT_SECRET);

    // 1️⃣ Initiate custom auth
    const init = await client.send(
      new AdminInitiateAuthCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthFlow: 'CUSTOM_AUTH',
        AuthParameters: {
          USERNAME: email,
          SECRET_HASH,
        },
      }),
    );

    // 2️⃣ Respond to challenge
    const final = await client.send(
      new AdminRespondToAuthChallengeCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        ChallengeName: 'CUSTOM_CHALLENGE',
        Session: init.Session,
        ChallengeResponses: {
          USERNAME: email,
          ANSWER: 'anything',
          SECRET_HASH,
        },
      }),
    );

    if (!final.AuthenticationResult) {
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 401 },
      );
    }

    // Get cognito_sub from challenge (USERNAME field)
    const cognitoSub = init.ChallengeParameters?.USERNAME || '';

    // Create auth payload
    const portalAuthPayload: PortalAuthPayload = {
      nric: nric,
      cognito_sub: cognitoSub,
      accessToken: final.AuthenticationResult.AccessToken,
      accessTokenExpiresAt:
        Date.now() + (final.AuthenticationResult?.ExpiresIn || 3600) * 1000,
      code: null,
      code_verifier: null,
      email: email,
      phone: phone,
    };

    const encrypted = await encryptValue(
      JSON.stringify(portalAuthPayload),
      COOKIE_PASSPHRASE,
    );

    const res = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: email,
        nric: nric,
        cognito_sub: cognitoSub,
      },
    });

    // Set the _PA cookie
    res.cookies.set({
      name: `_${COOKIE_NAME.PORTAL_AUTHORIZATION}`,
      value: encodeToBase64(encrypted, true),
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return res;
  } catch (error: any) {
    console.error('Custom auth error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication failed' },
      { status: 500 },
    );
  }
}
