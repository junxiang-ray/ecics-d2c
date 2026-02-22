// src/app/api/v1/auth/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';
import { PortalAuthPayload } from '@/libs/types/auth';

export async function POST(request: NextRequest) {
  try {
    /* ───────── AUTH ───────── */
    const cookieStore = cookies();
    const paCookie = cookieStore.get('_pa');

    if (!paCookie?.value) {
      return NextResponse.json(
        { message: 'Missing access token' },
        { status: 401 },
      );
    }

    const encryptedAuth = Buffer.from(paCookie.value, 'base64').toString(
      'utf8',
    );

    const decryptedAuth = await decryptValue(
      encryptedAuth,
      process.env.PORTAL_COOKIE_PASSPHRASE!,
    );

    if (!decryptedAuth) {
      return NextResponse.json(
        { message: 'Auth decryption failed' },
        { status: 401 },
      );
    }

    const authPayload = parseJSON<PortalAuthPayload>(decryptedAuth);

    if (!authPayload?.accessToken) {
      return NextResponse.json(
        { message: 'Invalid auth payload' },
        { status: 401 },
      );
    }

    /* ───────── PARSE REQUEST BODY ───────── */
    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }
    console.log('authPayload.accessToken', authPayload.accessToken);
    /* ───────── PROXY TO FASTIFY ───────── */
    const response = await fetch(
      `${process.env.FASTIFY_API_URL}/api/auth/change-password`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authPayload.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to change password' },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
