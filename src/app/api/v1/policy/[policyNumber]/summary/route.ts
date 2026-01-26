// app/api/v1/policy/[policyNumber]/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { machineTokenManager } from '@/libs/utils/machineToken';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { policyNumber: string } }
) {
  try {
    const policyNumber = params.policyNumber; // e.g., "MPC25P00846800"
    
    // 1. Get machine token (auto-refreshes)
    const machineToken = await machineTokenManager.getToken();
    
    // 2. Get user access token from _pa cookie
    const cookieStore = cookies();
    const paCookie = cookieStore.get('_pa');
    
    if (!paCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized - missing auth cookie' },
        { status: 401 }
      );
    }

    // 3. Proxy to Fastify (decode _pa minimally to get accessToken)
    const fastifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_FASTIFY_API_URL}/api/v1/o3/policy/${policyNumber}/summary`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${machineToken}`,  // Machine token
          'X-User-Token': paCookie.value,           // Raw _pa cookie value (Fastify will decode)
          'Content-Type': 'application/json',
        },
      }
    );

    if (!fastifyResponse.ok) {
      return NextResponse.json(
        { error: 'Policy fetch failed from backend' },
        { status: fastifyResponse.status }
      );
    }

    const policyData = await fastifyResponse.json();
    return NextResponse.json(policyData);

  } catch (error) {
    console.error('Policy API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
