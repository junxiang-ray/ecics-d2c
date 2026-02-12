// src/app/api/v1/auth/singpass/exchange-code/route.ts
import { NextResponse } from 'next/server';
import { retrieveNRICFromSingpass } from '@/app/api/v1/singpass/retrieve-nric/[prefix]/retrieve-nric-singpass.service';

// Helper to map mock NRIC to real NRIC
function mapMockNricToReal(mockNric: string): string {
  const mapString = process.env.SINGPASS_NRIC_MAP || '';

  // Parse "mock1:real1,mock2:real2" format
  const pairs = mapString.split(',').filter(Boolean);

  for (const pair of pairs) {
    const [mock, real] = pair.split(':');
    if (mock?.trim() === mockNric) {
      console.log(`🎭 Mapped mock NRIC ${mockNric} → ${real?.trim()}`);
      return real?.trim() || mockNric;
    }
  }

  // No mapping found, return original
  return mockNric;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, code_verifier } = body;

    console.log('🔧 Exchange code request received:', {
      code: code?.substring(0, 20) + '...',
      code_verifier: code_verifier?.substring(0, 20) + '...',
    });

    if (!code || !code_verifier) {
      return NextResponse.json(
        { message: 'Code and code_verifier are required' },
        { status: 400 },
      );
    }

    // Call the service
    const result = await retrieveNRICFromSingpass(
      code,
      code_verifier,
      'PORTAL',
    );

    console.log('📦 Service result type:', typeof result);
    console.log('📦 Service result:', result);

    // Extract NRIC
    let mockNric: string | null = null;
    const resultAny = result as any;

    if (resultAny && typeof resultAny.json === 'function') {
      const cloned = resultAny.clone ? resultAny.clone() : resultAny;
      const resultData = await cloned.json();
      mockNric = resultData.data;
    } else {
      mockNric = resultAny.data;
    }

    console.log('🔍 Extracted mock NRIC:', mockNric);

    if (!mockNric) {
      return NextResponse.json(
        { message: 'Failed to extract NRIC from Singpass response' },
        { status: 400 },
      );
    }

    // Map mock NRIC to real NRIC
    const realNric = mapMockNricToReal(mockNric);

    console.log('✅ NRIC mapped:', mockNric, '→', realNric);

    return NextResponse.json({
      nric: realNric, // Return the mapped real NRIC
      _originalNric: mockNric, // Optional: include original for debugging
    });
  } catch (error: any) {
    console.error('❌ Exchange code error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to exchange code' },
      { status: 500 },
    );
  }
}

// src/app/api/v1/auth/singpass/exchange-code/route.ts
// import { NextResponse } from 'next/server';
// import { retrieveNRICFromSingpass } from '@/app/api/v1/singpass/retrieve-nric/[prefix]/retrieve-nric-singpass.service';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { code, code_verifier } = body;

//     console.log('🔧 Exchange code request received:', {
//       code: code?.substring(0, 20) + '...',
//       code_verifier: code_verifier?.substring(0, 20) + '...',
//     });

//     if (!code || !code_verifier) {
//       return NextResponse.json(
//         { message: 'Code and code_verifier are required' },
//         { status: 400 }
//       );
//     }

//     // Call the service - returns real NRIC from Singpass
//     const result = await retrieveNRICFromSingpass(code, code_verifier, 'PORTAL');

//     console.log('📦 Service result type:', typeof result);
//     console.log('📦 Service result:', result);

//     // Extract NRIC
//     let nric: string | null = null;
//     const resultAny = result as any;

//     if (resultAny && typeof resultAny.json === 'function') {
//       const cloned = resultAny.clone ? resultAny.clone() : resultAny;
//       const resultData = await cloned.json();
//       nric = resultData.data;
//     } else {
//       nric = resultAny.data;
//     }

//     console.log('🔍 Extracted NRIC:', nric);

//     if (!nric) {
//       return NextResponse.json(
//         { message: 'Failed to extract NRIC from Singpass response' },
//         { status: 400 }
//       );
//     }

//     console.log('✅ NRIC extracted successfully:', nric);

//     // Return the actual NRIC from Singpass (no mapping)
//     return NextResponse.json({
//       nric: nric,
//     });

//   } catch (error: any) {
//     console.error('❌ Exchange code error:', error);
//     return NextResponse.json(
//       { message: error.message || 'Failed to exchange code' },
//       { status: 500 }
//     );
//   }
// }
