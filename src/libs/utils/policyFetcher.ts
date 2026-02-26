// src/libs/utils/policyFetcher.ts
import { machineTokenManager } from './machineToken';

const FASTIFY_API_URL = process.env.FASTIFY_API_URL;

if (!FASTIFY_API_URL) {
  throw new Error('Missing FASTIFY_API_URL');
}

// New lightweight list response
interface PolicyListItem {
  POLICY_NUMBER: string;
  INSDNAME: string;
  POL_EXPDATE: string;
}

// New detail endpoint response
interface PolicySummaryResponse {
  policy_type: string;
  data: {
    policy_details?: { status: string; data: any };
    vehicle_details?: { status: string; data: any };
    excess_text?: { status: string; data: any };
    lower_text?: { status: string; data: any };
    policy_clauses?: { status: string; data: any };
    insured_drivers?: { status: string; data: any };
    policyholder_details?: { status: string; data: any };
  };
}

export async function fetchPolicyList(
  nric: string,
  accessToken: string,
): Promise<PolicyListItem[]> {
  const machineToken = await machineTokenManager.getToken();

  const res = await fetch(`${FASTIFY_API_URL}/api/v1/o3/polmaster/by-icno`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${machineToken}`,
      'X-User-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ icno: nric }),
  });

  if (!res.ok) throw new Error('Failed to fetch policy list');

  return res.json();
}

export async function fetchPolicySummary(
  policyNumber: string,
  machineToken: string,
): Promise<PolicySummaryResponse> {
  const res = await fetch(
    `${FASTIFY_API_URL}/api/v1/o3/policy/${policyNumber}/summary`,
    {
      headers: {
        Authorization: `Bearer ${machineToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    console.error(`Failed to fetch summary for ${policyNumber}:`, res.status);
    // Return empty structure to not break entire response
    return {
      policy_type: 'MOTOR',
      data: {},
    };
  }

  return res.json();
}

export async function fetchAllPolicySummariesParallel(
  policies: PolicyListItem[],
  machineToken: string,
  concurrency = 5,
): Promise<Map<string, PolicySummaryResponse>> {
  const summaryMap = new Map<string, PolicySummaryResponse>();

  // Process in batches to avoid overwhelming the API
  for (let i = 0; i < policies.length; i += concurrency) {
    const batch = policies.slice(i, i + concurrency);

    const batchPromises = batch.map(async (policy) => {
      const summary = await fetchPolicySummary(
        policy.POLICY_NUMBER,
        machineToken,
      );
      return { policyNumber: policy.POLICY_NUMBER, summary };
    });

    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach(({ policyNumber, summary }) => {
      summaryMap.set(policyNumber, summary);
    });
  }

  return summaryMap;
}
