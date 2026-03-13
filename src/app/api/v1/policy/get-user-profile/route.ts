// src/app/api/v1/policy/get-user-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';
import { PortalAuthPayload } from '@/libs/types/auth';
import { machineTokenManager } from '@/libs/utils/machineToken';

export async function POST(_: NextRequest) {
  try {
    /* ───────── AUTH ───────── */
    const cookieStore = cookies();
    const paCookie = cookieStore.get('_pa');

    if (!paCookie?.value) {
      return NextResponse.json(
        { error: 'Missing _pa cookie' },
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
        { error: 'Auth decryption failed' },
        { status: 401 },
      );
    }

    const authPayload = parseJSON<PortalAuthPayload>(decryptedAuth);

    if (!authPayload?.accessToken || !authPayload?.nric) {
      return NextResponse.json(
        { error: 'Invalid auth payload' },
        { status: 401 },
      );
    }
    console.log('USER NRIC ', authPayload.nric);

    /* ───────── FETCH POLICYHOLDER ───────── */
    const machineToken = await machineTokenManager.getToken();

    const fastifyRes = await fetch(
      `${process.env.FASTIFY_API_URL}/api/v1/o3/policyholder-icno/by-icno`,
      {
        method: 'POST', // changed to GET
        headers: {
          Authorization: `Bearer ${machineToken}`,
          'X-User-Token': authPayload.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          icno: authPayload.nric,
        }),
      },
    );

    if (!fastifyRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: fastifyRes.status },
      );
    }

    const fastifyData = await fastifyRes.json();

    const policyholder = fastifyData?.policyholder_details?.data;

    if (!policyholder) {
      return NextResponse.json(
        { error: 'Invalid policyholder response' },
        { status: 500 },
      );
    }

    /* ───────── MAP TO MOCK SHAPE ───────── */
    const profile = {
      name: policyholder.full_name,
      phone: authPayload.phone || String(policyholder.mobile_number),
      email: authPayload.email, // 🔐 authoritative source
      gender: policyholder.gender ? policyholder.gender.toUpperCase() : null,
      marital_status: policyholder.marital_status
        ? policyholder.marital_status.toUpperCase()
        : null,
      address: {
        address_line_1: policyholder.address_line_1,
        address_line_2: policyholder.address_line_2,
        address_line_3: policyholder.address_line_3,
        postal_code: String(policyholder.postal_code),
      },
    };

    /* ───────── RETURN MOCK-COMPATIBLE RESPONSE ───────── */
    return NextResponse.json({
      data: profile,
    });
  } catch (error) {
    console.error('💥 GET USER PROFILE ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
