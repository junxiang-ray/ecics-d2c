// src/app/api/v1/auth/signup/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  // Transform frontend field names to match backend expectations
  const backendPayload = {
    email: body.email_address,
    password: body.password,
    nric: body.nric,
    phone_number: `+65${body.phone_number}`,
  };

  const backendRes = await fetch(
    `${process.env.FASTIFY_API_URL}/api/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload),
    },
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data?.message || 'Signup failed' },
      { status: backendRes.status },
    );
  }

  // ✅ Registration initiated → OTP sent to email
  // Return session/info needed for OTP verification
  return NextResponse.json({
    status: 'OTP_REQUIRED',
    message: data.message,
    email: backendPayload.email,
    nric: data.nric,
    phone_number: data.phone_number,
    // session: data.session, // Uncomment if backend returns a session for OTP verification
  });
}
