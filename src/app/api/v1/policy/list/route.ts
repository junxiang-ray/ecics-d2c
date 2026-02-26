// src/app/api/v1/policy/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';
import { machineTokenManager } from '@/libs/utils/machineToken';
import {
  fetchPolicyList,
  fetchAllPolicySummariesParallel,
} from '@/libs/utils/policyFetcher';
import { PortalAuthPayload } from '@/libs/types/auth';

export async function POST(_: NextRequest) {
  try {
    /* ───────── AUTH (unchanged) ───────── */
    const cookieStore = cookies();
    const paCookie = cookieStore.get('_pa');

    if (!paCookie?.value) {
      return NextResponse.json(
        { error: 'Missing _pa cookie' },
        { status: 401 },
      );
    }

    const COOKIE_PASSPHRASE = process.env.PORTAL_COOKIE_PASSPHRASE;
    if (!COOKIE_PASSPHRASE) {
      return NextResponse.json(
        { error: 'Server config error' },
        { status: 500 },
      );
    }

    const encryptedAuth = Buffer.from(paCookie.value, 'base64').toString(
      'utf8',
    );
    const decryptedAuth = await decryptValue(encryptedAuth, COOKIE_PASSPHRASE);

    if (!decryptedAuth) {
      return NextResponse.json(
        { error: 'Auth decryption failed' },
        { status: 401 },
      );
    }

    const authPayload = parseJSON<PortalAuthPayload>(decryptedAuth);
    if (!authPayload?.accessToken || !authPayload.nric) {
      return NextResponse.json(
        { error: 'Invalid auth payload' },
        { status: 401 },
      );
    }

    /* ───────── NEW PARALLEL FLOW ───────── */

    // 1. Get machine token once
    const machineToken = await machineTokenManager.getToken();

    // 2. Fetch lightweight policy list (NEW: no summary embedded)
    const requestId = Math.random().toString(36).substring(7);

    const policyList = await fetchPolicyList(
      authPayload.nric,
      authPayload.accessToken,
    );

    if (!policyList.length) {
      return NextResponse.json({ policies: [] });
    }

    // 3. Fetch ALL summaries in parallel (NEW ENDPOINT)
    const summaryMap = await fetchAllPolicySummariesParallel(
      policyList,
      machineToken,
      5, // concurrency limit
    );

    // 4. Merge into EXACT original response structure
    const compiledPolicies = policyList.map((item) => {
      const summary = summaryMap.get(item.POLICY_NUMBER);

      return {
        POLICY_NUMBER: item.POLICY_NUMBER,
        INSDNAME: item.INSDNAME,
        POL_EXPDATE: item.POL_EXPDATE,
        summary: {
          policy_type: summary?.policy_type || 'MOTOR',
          policy_number: item.POLICY_NUMBER,
          data: summary?.data || {},
        },
      };
    });

    // 5. Return EXACT same structure as original API
    return NextResponse.json({ policies: compiledPolicies });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
