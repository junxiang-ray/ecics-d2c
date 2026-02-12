// src/app/api/v1/auth/resend-verification/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 },
      );
    }

    const backendRes = await fetch(
      `${process.env.FASTIFY_API_URL}/api/auth/resend-verification`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      },
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.message || 'Failed to resend verification code' },
        { status: backendRes.status },
      );
    }

    return NextResponse.json({
      message: data.message || 'Verification code resent successfully',
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
