// src/app/api/v1/auth/check-nric/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nric } = body;

    if (!nric) {
      return NextResponse.json(
        { message: 'NRIC is required' },
        { status: 400 },
      );
    }

    const backendRes = await fetch(
      `https://0hp7ph6z1f.execute-api.ap-southeast-1.amazonaws.com/prod/api/api/auth/check-nric`,
      // `${process.env.FASTIFY_API_URL}/api/auth/check-nric`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nric }),
      },
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.message || 'Failed to check NRIC' },
        { status: backendRes.status },
      );
    }

    // Forward the response (includes email if exists: true)
    return NextResponse.json({
      exists: data.exists,
      email: data.email, // Will be present if exists is true
    });
  } catch (error: any) {
    console.error('Check NRIC error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
