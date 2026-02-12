// src/app/api/v1/auth/machine-token/route.ts
import { NextResponse } from 'next/server';
import { machineTokenManager } from '@/libs/utils/machineToken';

export async function GET() {
  try {
    const token = await machineTokenManager.getToken();
    const expiresIn = 3600; // Cognito default, or calculate from your manager

    return NextResponse.json({
      token,
      expires_in: expiresIn,
    });
  } catch (error: any) {
    console.error('Failed to get machine token:', error);
    return NextResponse.json(
      { message: 'Failed to get machine token' },
      { status: 500 },
    );
  }
}
