import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/constants/general.constant';
import { encryptValue, encodeToBase64 } from '@/libs/utils/secureStorage-utils';
import { PortalAuthPayload } from '@/libs/types/auth';

export async function POST(req: Request) {
  const body = await req.json();

  // ✅ Validate env vars
  const FASTIFY_API_URL = process.env.FASTIFY_API_URL;
  const COOKIE_PASSPHRASE = process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE;

  if (!FASTIFY_API_URL || !COOKIE_PASSPHRASE) {
    console.error('Missing required environment variables');
    return NextResponse.json(
      { message: 'Server configuration error' },
      { status: 500 },
    );
  }

  const backendRes = await fetch(`${FASTIFY_API_URL}/api/auth/login/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data?.message || 'OTP verification failed' },
      { status: backendRes.status },
    );
  }

  // ✅ MFA completed → issue portal auth cookie
  const portalAuthPayload: PortalAuthPayload = {
    nric: data.user.nric,
    cognito_sub: data.user.cognito_sub,
    accessToken: data.accessToken,
    code: null,
    code_verifier: null,
    email: body.email,
  };

  const encrypted = await encryptValue(
    JSON.stringify(portalAuthPayload),
    COOKIE_PASSPHRASE,
  );

  const res = NextResponse.json(data.user);

  res.cookies.set({
    name: `_${COOKIE_NAME.PORTAL_AUTHORIZATION}`,
    value: encodeToBase64(encrypted, true),
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60,
  });

  return res;
}
