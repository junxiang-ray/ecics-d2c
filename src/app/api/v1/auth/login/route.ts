import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/constants/general.constant';
import { encryptValue } from '@/libs/utils/secureStorage-utils';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: 'Login failed' },
      { status: res.status },
    );
  }

  const payload = {
    nric: data.user.cognito_sub, // or whatever maps to NRIC in your system
    accessToken: data.accessToken,
  };

  const encrypted = await encryptValue(
    JSON.stringify(payload),
    process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE!,
  );

  const response = NextResponse.json(data.user);

  response.cookies.set({
    name: COOKIE_NAME.PORTAL_AUTHORIZATION,
    value: encrypted,
    httpOnly: true,
    path: '/',
  });

  return response;
}
