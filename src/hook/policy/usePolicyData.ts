// hooks/policy/usePolicyData.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hook/auth/useAuth';

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
      vehicle_details: {
        status: string;
        data: {
          registration_number: string;
          make_model: string;
          chassis_number: string;
          engine_motor_number: string;
          capacity: number;
          registration_year: number;
          hire_purchase_company: string;
        };
      };
      excess_text: {
        status: string;
        data: {
          policy_excess: Array<{
            title: string;
            subtitle: string;
            value: string;
          }>;
          additional_excess: Array<{
            title: string;
            subtitle: string;
            value: string;
          }>;
        };
      };
      lower_text: {
        status: string;
        data: {
          endorsements: Record<string, string>;
        };
      };
      policy_clauses: {
        status: string;
        data: {
          clauses: Array<{
            seq_no: number;
            code: string;
            title: string;
          }>;
        };
      };
      insured_drivers: {
        status: string;
        data: {
          named_drivers: Array<{
            sequence: number;
            name: string;
            nric: string;
            date_of_birth: string;
            marital_status: string;
            gender: string;
            driving_experience: number;
          }>;
        };
      };
    };
  };
}

// hooks/policy/usePolicyData.ts - FIXED RESPONSE HANDLING
export function usePolicyData() {
  const { auth, initialized } = useAuth();

  return useQuery<PolicySummary[]>({
    queryKey: ['policies', auth?.nric],
    queryFn: async (): Promise<PolicySummary[]> => {
      const response = await fetch('/api/v1/policy/list', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Policy fetch failed: ${response.status}`);
      }

      const data = await response.json();
      
      // 🔥 DEBUG: Log raw response
      console.log('🔍 RAW API RESPONSE:', {
        isArray: Array.isArray(data),
        hasData: !!data?.data,
        keys: data && typeof data === 'object' ? Object.keys(data) : null,
        count: data?.length || data?.data?.length || 0
      });

      // ✅ Handle both array + wrapped responses
      return Array.isArray(data) ? data : 
             Array.isArray(data?.data) ? data.data : 
             data?.policies || [];
    },
    enabled: !!auth?.nric && initialized,
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
}


