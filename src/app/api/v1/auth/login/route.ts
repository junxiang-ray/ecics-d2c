import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/constants/general.constant';
import { encryptValue } from '@/libs/utils/secureStorage-utils';
import {
  encodeToBase64,
  decodeFromBase64,
  stringifyJSON,
  parseJSON,
} from '@/libs/utils/secureStorage-utils';
import { PortalAuthPayload } from '@/libs/types/auth';


export async function POST(req: Request) {
  const body = await req.json();
  void body;
  const backendResponse = await fetch(
    'http://localhost:5001/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!backendResponse.ok) {
    console.error(
      '[LOGIN] Backend login failed:',
      backendResponse.status
    );
    return NextResponse.json(
      { error: 'Login failed' },
      { status: backendResponse.status }
    );
  }
  const data = await backendResponse.json();

  // mocked backend response
  // const data = {
  //   user: {
  //     email: 'rayngjx@gmail.com',
  //     cognito_sub: '598a251c-60b1-709f-6960-ed3862fb3f6  4',
  //     group: 'Users',
  //   },  
  //   accessToken: 'eyJraWQiOiJzbnNFUFVYazAxTU1hNUhsRVpIcWorS1VVQnllXC9cL0dcL2ttbTFNRXNZUU1jPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1OThhMjUxYy02MGIxLTcwOWYtNjk2MC1lZDM4NjJmYjNmNjQiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VycyJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfM0Vsd0UxSUpBIiwiY2xpZW50X2lkIjoiNDM5MWtsb3E2amE1NWM4NmVkdDYwcjQ0aHAiLCJvcmlnaW5fanRpIjoiNGI5MzUxMDktYTE5Yy00NmQzLTk3OWMtZTUxMzBkZDI2YzRjIiwiZXZlbnRfaWQiOiIxNTQ1ZDkwOC00NWU4LTQyZTktODFjNC03NTFiNmJiNWNlN2EiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzYzMzY5NzM0LCJleHAiOjE3NjMzNzMzMzQsImlhdCI6MTc2MzM2OTczNCwianRpIjoiNTUwZmZjNTAtYzVlOS00YzM3LThlMjMtNzIwZWE3MWNhNDhjIiwidXNlcm5hbWUiOiI1OThhMjUxYy02MGIxLTcwOWYtNjk2MC1lZDM4NjJmYjNmNjQifQ.o0wAwGHg7ok88JMAj8VFJV8ZbSYXD86pEXkz8sURlCyHXcFsDkCV7oK-ncb8fN92UkCGvwfHXcqSAJqebOZFOcN6qCyJiU66orflpcoWW-ghl3aLFWbLm4DNs0VRTqHAlx_vITCN77RbWhq3MPN2UbFuZWEtH1dxLmKHQ0MQRyJvI4eXDekz0U-HmADF4lZOeuO6A4zDNTw07EpawO_q6AC8zoVSsYjid42FdrAIF1YZOnctGTGM38hYDuSaDMVg_cOF2rzVAxESRbXVnlRkHbcYPDi-TKM3SsRYTxNwkn9DJT4ZmWsLK5s5CG3_7dBmtctpAqLQfI8nQVyrTHQSfg',
  // };

  // Ensure typing for Auth payload
  const portalAuthPayload: PortalAuthPayload  = {
    nric: data.user.cognito_sub,
    accessToken: data.accessToken,
    code: null,
    code_verifier: null,
  };

  const encrypted = await encryptValue(
    JSON.stringify(portalAuthPayload),
    process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE!,
  );

  const response = NextResponse.json(data.user);

  response.cookies.set({
    name: `_${COOKIE_NAME.PORTAL_AUTHORIZATION}`, // "_pa"
    value: encodeToBase64(encrypted, true),  // ← Base64 encode like utils.ts
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
