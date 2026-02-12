'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hook/auth/useAuth';
import { PolicyStatus, PolicyTag } from '@/libs/types/policy';

/* ─────────────────────────────────────────────
 * Backend (RAW) policy type – mirrors API
 * ───────────────────────────────────────────── */

export interface PolicySummary {
  POLICY_NUMBER: string;
  INSDNAME: string;
  POL_EXPDATE: string;
  summary: {
    policy_type: string;
    policy_number: string;
    data: {
      policy_details: {
        status: string;
        data: {
          policy_number: string;
          type_of_policy: string;
          start_date: string;
          end_date: string;
          plan_type: string;
          scheme: string;
          intermediary_name: string;
          Status: string;
          premium: string;
          policy_status: string;
          tags: string;
        };
      };
      vehicle_details: any;
      excess_text: any;
      lower_text: any;
      policy_clauses: any;
      insured_drivers: any;
    };
  };
}

/* ─────────────────────────────────────────────
 * Normalized (UI) policy types
 * ───────────────────────────────────────────── */

// Extract raw policy_details.data
type RawPolicyDetails =
  PolicySummary['summary']['data']['policy_details']['data'];

// Replace policy_status + tags correctly
type NormalizedPolicyDetails = Omit<
  RawPolicyDetails,
  'policy_status' | 'tags'
> & {
  policy_status: PolicyStatus;
  tags?: PolicyTag;
};

// Full normalized policy shape
export type NormalizedPolicySummary = Omit<PolicySummary, 'summary'> & {
  summary: Omit<PolicySummary['summary'], 'data'> & {
    data: Omit<PolicySummary['summary']['data'], 'policy_details'> & {
      policy_details: {
        status: string;
        data: NormalizedPolicyDetails;
      };
    };
  };
};

/* ─────────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────────── */

const MS_IN_DAY = 1000 * 60 * 60 * 24;

function computePolicyStatus(
  backendStatus: string,
  startDate: string,
  endDate: string,
): PolicyStatus {
  if (backendStatus?.toLowerCase() === 'cancelled') {
    return 'cancelled';
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'pending';
  if (now > end) return 'expired';
  return 'active';
}

function computePolicyTag(
  status: PolicyStatus,
  endDate: string,
): PolicyTag | undefined {
  if (status !== 'active') return undefined;

  const now = new Date();
  const end = new Date(endDate);

  const diffInDays = (end.getTime() - now.getTime()) / MS_IN_DAY;

  return diffInDays <= 60 ? 'pending_renewal' : undefined;
}

/* ─────────────────────────────────────────────
 * Hook
 * ───────────────────────────────────────────── */

export function usePolicyData() {
  const { auth, initialized } = useAuth();

  return useQuery<NormalizedPolicySummary[]>({
    queryKey: ['policies', auth?.nric],

    queryFn: async (): Promise<NormalizedPolicySummary[]> => {
      const response = await fetch('/api/v1/policy/list', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Policy fetch failed: ${response.status}`);
      }

      const raw = await response.json();

      const policies: PolicySummary[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : raw?.policies || [];
      return policies.map((policy): NormalizedPolicySummary => {
        const details = policy.summary.data.policy_details.data;

        const computedStatus = computePolicyStatus(
          details.policy_status,
          details.start_date,
          details.end_date,
        );

        const computedTag = computePolicyTag(computedStatus, details.end_date);

        console.log('🧪 NORMALIZED POLICY', {
          policyNo: details.policy_number,
          start: details.start_date,
          end: details.end_date,
          computedStatus,
          computedTag,
          rawStatus: details.policy_status,
        });

        return {
          ...policy,
          summary: {
            ...policy.summary,
            data: {
              ...policy.summary.data,
              policy_details: {
                ...policy.summary.data.policy_details,
                data: {
                  ...details,
                  policy_status: computedStatus,
                  tags: computedTag,
                },
              },
            },
          },
        };
      });
    },

    enabled: !!auth?.nric && initialized,
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
}
