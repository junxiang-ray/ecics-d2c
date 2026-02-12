// src/app/api/v1/auth/signup/verify/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and code are required' },
        { status: 400 },
      );
    }

    const backendRes = await fetch(
      `${process.env.FASTIFY_API_URL}/api/auth/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      },
    );

    const data = await backendRes.json();

    // Forward the exact status and message/error from backend
    if (!backendRes.ok) {
      // Backend returns { error: "..." } on failure, { message: "..." } on success
      const errorMessage =
        data?.error || data?.message || 'Verification failed';
      return NextResponse.json(
        { message: errorMessage },
        { status: backendRes.status }, // Forward 400, 401, 403, 500, etc.
      );
    }

    // Success - backend returns { message: "Account verified successfully." }
    return NextResponse.json({
      status: 'VERIFIED',
      message: data.message,
    });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
