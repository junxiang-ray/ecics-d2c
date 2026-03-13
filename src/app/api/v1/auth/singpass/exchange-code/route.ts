// src/app/api/v1/auth/singpass/exchange-code/route.ts
import { NextResponse } from 'next/server';
import { retrieveNRICFromSingpass } from '@/app/api/v1/singpass/retrieve-nric/[prefix]/retrieve-nric-singpass.service';

// Helper to map mock NRIC to real NRIC
function mapMockNricToReal(mockNric: string): string {
  const mapString = process.env.SINGPASS_NRIC_MAP || '';

  // console.log("🔍 Loaded NRIC MAP:", mapString);
  // console.log("🔍 Incoming NRIC from Singpass:", mockNric);

  // Parse "mock1:real1,mock2:real2" format
  const pairs = mapString.split(',').filter(Boolean);

  for (const pair of pairs) {
    const [mock, real] = pair.split(':');

    if (mock?.trim().toUpperCase() === mockNric?.trim().toUpperCase()) {
      const mapped = real?.trim() || mockNric;

      // console.log("✅ NRIC mapping found:", {
      //   mockNric,
      //   mappedTo: mapped,
      // });
      console.log('found');

      return mapped;
    }
  }

  // No mapping found
  console.warn('⚠️ No NRIC mapping found. Using original mock NRIC:', mockNric);

  return mockNric;
}

export async function POST(req: Request) {
  try {
    // console.log("🚀 Singpass exchange-code API called");

    const body = await req.json();
    const { code, code_verifier } = body;

    // console.log("📥 Request payload received:", {
    //   codeExists: !!code,
    //   codeVerifierExists: !!code_verifier,
    // });

    if (!code || !code_verifier) {
      // console.error("❌ Missing code or code_verifier");

      return NextResponse.json(
        { message: 'Code and code_verifier are required' },
        { status: 400 },
      );
    }

    // Call the Singpass service
    // console.log("🔗 Calling retrieveNRICFromSingpass service...");

    const result = await retrieveNRICFromSingpass(
      code,
      code_verifier,
      'PORTAL',
    );

    // console.log("📨 Raw response received from Singpass service");

    // Extract NRIC
    let mockNric: string | null = null;
    const resultAny = result as any;

    if (resultAny && typeof resultAny.json === 'function') {
      const cloned = resultAny.clone ? resultAny.clone() : resultAny;
      const resultData = await cloned.json();

      // console.log("📄 Parsed Singpass response:", resultData);

      mockNric = resultData.data;
    } else {
      mockNric = resultAny.data;

      // console.log("📄 Parsed Singpass response (direct):", resultAny);
    }

    // console.log("🆔 NRIC extracted from Singpass:", mockNric);

    if (!mockNric) {
      console.error('❌ Failed to extract NRIC from Singpass response');

      return NextResponse.json(
        { message: 'Failed to extract NRIC from Singpass response' },
        { status: 400 },
      );
    }

    // Map mock NRIC to real NRIC
    const realNric = mapMockNricToReal(mockNric);

    // Final response payload
    const responsePayload = {
      nric: realNric,
      _originalNric: mockNric,
    };

    // console.log("📤 Final API response:", responsePayload);

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('❌ Exchange code error:', error);

    return NextResponse.json(
      { message: error.message || 'Failed to exchange code' },
      { status: 500 },
    );
  }
}
