import type { AxiosResponse } from 'axios';
import { ClaimPayload, ClaimResponseData } from '@/libs/types/claim';

import { API_CLAIM_GET } from '@/constants/api.constant';

import baseClient from './api.config';

const MOCK_DATA = [
  {
    claim_no: 'CLM2024001',
    policy: {
      id: 1,
      policy_no: 'MC2024001',
      policy_type: 'car',
      policy_type_name: 'Motor Vehicle - Car',
      start_date: '',
      end_date: '',
      issue_date: '',
      plan: { plan_code: '', plan_name: '' },
      scheme: '',
      intermediary_name: '',
      premium: 0,
      policy_status: 'active',
      tags: null,
      policy_holder: null,
      maid_info: null,
      drivers: null,
      vehicle: null,
      excess: null,
    },
    status: 'processing',
    progress: 'in_review',
    progress_histories: [
      {
        progress: 'submitted',
        process_date: '2024-12-15T04:01:10.449Z',
        expected_process_date: '2024-12-15T04:01:10.449Z',
      },
      {
        progress: 'initial_review',
        process_date: '2024-12-16T04:01:10.449Z',
        expected_process_date: '2024-12-16T04:01:10.449Z',
      },
      {
        progress: 'in_review',
        process_date: '2024-12-18T04:01:10.449Z',
        expected_process_date: '2024-12-18T15:00:00.000Z',
      },
      {
        progress: 'decision',
        process_date: null,
        expected_process_date: '2024-12-23T15:00:00.000Z',
      },
      {
        progress: 'settlement',
        process_date: null,
        expected_process_date: '2024-12-25T15:00:00.000Z',
      },
    ],
    documents: [
      {
        title: 'Incident Photos',
        file_count: 3,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Police Report',
        file_count: 1,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Repair Quotation',
        file_count: 1,
        upload_date: '2024-12-16T09:00:00.000Z',
      },
    ],
    notes: [
      {
        title: 'Claims Adjuster',
        publish_date: '2024-12-18T08:00:00.000Z',
        created_date: '2024-12-18T08:00:00.000Z',
        content:
          'Reviewing repair quotations. May require additional quotes from approved workshops.',
      },
      {
        title: 'System',
        publish_date: '2024-12-16T08:00:00.000Z',
        created_date: '2024-12-16T08:00:00.000Z',
        content:
          'All required documents received. Claim moved to review queue.',
      },
    ],
    address: {
      address_line_1: '',
      address_line_2: 'Orchard Road',
      address_line_3: 'Singapore',
    },
    amount: 2500,
    last_update: '2024-12-18',
    incident_date: '2024-12-14',
    estimate_settlement: '2024-12-15',

    description: 'Minor collision damage to front bumper',
    short_description: 'Minor collision damage to front bumper',
  },
  {
    claim_no: 'CLM2024002',
    policy: {
      id: 2,
      policy_no: 'MD2024003',
      policy_type: 'maid',
      policy_type_name: 'Maid',
      start_date: '',
      end_date: '',
      issue_date: '',
      plan: { plan_code: '', plan_name: '' },
      scheme: '',
      intermediary_name: '',
      premium: 0,
      policy_status: 'active',
      tags: null,
      policy_holder: null,
      maid_info: null,
      drivers: null,
      vehicle: null,
      excess: null,
    },
    status: 'approved',
    progress: 'settlement',
    progress_histories: [
      {
        progress: 'submitted',
        process_date: '2024-12-15T04:01:10.449Z',
        expected_process_date: '2024-12-15T04:01:10.449Z',
      },
      {
        progress: 'initial_review',
        process_date: '2024-12-16T04:01:10.449Z',
        expected_process_date: '2024-12-16T04:01:10.449Z',
      },
      {
        progress: 'in_review',
        process_date: '2024-12-18T15:00:00.000Z',
        expected_process_date: '2024-12-18T15:00:00.000Z',
      },
      {
        progress: 'decision',
        process_date: '2024-12-23T10:00:00.000Z',
        expected_process_date: '2024-12-23T5:00:00.000Z',
      },
      {
        progress: 'settlement',
        process_date: '2024-12-25T04:00:40.251Z',
        expected_process_date: '2024-12-25T15:00:00.000Z',
      },
    ],
    documents: [
      {
        title: 'Incident Photos',
        file_count: 3,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Police Report',
        file_count: 1,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Repair Quotation',
        file_count: 1,
        upload_date: '2024-12-16T09:00:00.000Z',
      },
    ],
    notes: [
      {
        title: 'Claims Adjuster',
        publish_date: '2024-12-18T08:00:00.000Z',
        created_date: '2024-12-18T08:00:00.000Z',
        content:
          'Reviewing repair quotations. May require additional quotes from approved workshops.',
      },
      {
        title: 'System',
        publish_date: '2024-12-16T08:00:00.000Z',
        created_date: '2024-12-16T08:00:00.000Z',
        content:
          'All required documents received. Claim moved to review queue.',
      },
    ],
    address: {
      address_line_1: '',
      address_line_2: 'Orchard Road',
      address_line_3: 'Singapore',
    },
    amount: 850,
    last_update: '2024-12-17',
    incident_date: '',
    estimate_settlement: '',
    description: 'Medical expenses for maid injury',
    short_description: 'Medical expenses for maid injury',
  },
  {
    claim_no: 'CLM2024003',
    policy: {
      id: 3,
      policy_no: 'HC2024005',
      policy_type: 'home',
      policy_type_name: 'Home Content',
      start_date: '',
      end_date: '',
      issue_date: '',
      plan: { plan_code: '', plan_name: '' },
      scheme: '',
      intermediary_name: '',
      premium: 0,
      policy_status: 'active',
      tags: null,
      policy_holder: null,
      maid_info: null,
      drivers: null,
      vehicle: null,
      excess: null,
    },
    status: 'settled',
    progress: 'settlement',
    progress_histories: [
      {
        progress: 'submitted',
        process_date: '2024-12-15T04:01:10.449Z',
        expected_process_date: '2024-12-15T04:01:10.449Z',
      },
      {
        progress: 'initial_review',
        process_date: '2024-12-16T04:01:10.449Z',
        expected_process_date: '2024-12-16T04:01:10.449Z',
      },
      {
        progress: 'in_review',
        process_date: '2024-12-18T15:00:00.000Z',
        expected_process_date: '2024-12-18T15:00:00.000Z',
      },
      {
        progress: 'decision',
        process_date: '2024-12-23T15:00:00.000Z',
        expected_process_date: '2024-12-23T15:00:00.000Z',
      },
      {
        progress: 'settlement',
        process_date: '2024-12-25T10:00:00.000Z',
        expected_process_date: '2024-12-25T15:00:00.000Z',
      },
    ],
    documents: [
      {
        title: 'Incident Photos',
        file_count: 3,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Police Report',
        file_count: 1,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Repair Quotation',
        file_count: 1,
        upload_date: '2024-12-16T09:00:00.000Z',
      },
    ],
    notes: [
      {
        title: 'Claims Adjuster',
        publish_date: '2024-12-18T08:00:00.000Z',
        created_date: '2024-12-18T08:00:00.000Z',
        content:
          'Reviewing repair quotations. May require additional quotes from approved workshops.',
      },
      {
        title: 'System',
        publish_date: '2024-12-16T08:00:00.000Z',
        created_date: '2024-12-16T08:00:00.000Z',
        content:
          'All required documents received. Claim moved to review queue.',
      },
    ],
    address: {
      address_line_1: '',
      address_line_2: 'Orchard Road',
      address_line_3: 'Singapore',
    },
    amount: 4200,
    last_update: '2024-12-16',
    incident_date: '',
    estimate_settlement: '',
    description: 'Water damage to living room contents',
    short_description: 'Water damage to living room contents',
  },
  {
    claim_no: 'CLM2024004',
    policy: {
      id: 4,
      policy_no: 'MM2024001',
      policy_type: 'motorcycle',
      policy_type_name: 'Motor Vehicle - Motorcycle',
      start_date: '',
      end_date: '',
      issue_date: '',
      plan: { plan_code: '', plan_name: '' },
      scheme: '',
      intermediary_name: '',
      premium: 0,
      policy_status: 'active',
      tags: null,
      policy_holder: null,
      maid_info: null,
      drivers: null,
      vehicle: null,
      excess: null,
    },
    status: 'rejected',
    progress: 'submitted',
    progress_histories: [
      {
        progress: 'submitted',
        process_date: '2024-12-15T15:01:10.449Z',
        expected_process_date: '2024-12-15T15:00:00.000Z',
      },
      {
        progress: 'initial_review',
        process_date: '2024-12-16T07:01:10.449Z',
        expected_process_date: null,
      },
      {
        progress: 'in_review',
        process_date: null,
        expected_process_date: null,
      },
      {
        progress: 'decision',
        process_date: null,
        expected_process_date: null,
      },
      {
        progress: 'settlement',
        process_date: null,
        expected_process_date: null,
      },
    ],
    documents: [
      {
        title: 'Incident Photos',
        file_count: 3,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Police Report',
        file_count: 1,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Repair Quotation',
        file_count: 1,
        upload_date: '2024-12-16T09:00:00.000Z',
      },
    ],
    notes: [
      {
        title: 'Claims Adjuster',
        publish_date: '2024-12-18T08:00:00.000Z',
        created_date: '2024-12-18T08:00:00.000Z',
        content:
          'Reviewing repair quotations. May require additional quotes from approved workshops.',
      },
      {
        title: 'System',
        publish_date: '2024-12-16T08:00:00.000Z',
        created_date: '2024-12-16T08:00:00.000Z',
        content:
          'All required documents received. Claim moved to review queue.',
      },
    ],
    address: {
      address_line_1: '',
      address_line_2: 'Orchard Road',
      address_line_3: 'Singapore',
    },
    amount: 1200,
    last_update: '2024-12-14',
    incident_date: '',
    estimate_settlement: '',
    description: 'Parking lot scratch on motorcycle',
    short_description: 'Parking lot scratch on motorcycle',
  },
  {
    claim_no: 'CLM2024005',
    policy: {
      id: 5,
      policy_no: 'TR2024002',
      policy_type: 'travel',
      policy_type_name: 'Travel Insurance',
      start_date: '',
      end_date: '',
      issue_date: '',
      plan: { plan_code: '', plan_name: '' },
      scheme: '',
      intermediary_name: '',
      premium: 0,
      policy_status: 'active',
      tags: null,
      policy_holder: null,
      maid_info: null,
      drivers: null,
      vehicle: null,
      excess: null,
    },
    status: 'draft',
    progress: 'draft',
    progress_histories: [
      {
        progress: 'submitted',
        process_date: null,
        expected_process_date: '2024-12-15T15:00:00.000Z',
      },
      {
        progress: 'initial_review',
        process_date: null,
        expected_process_date: '2024-12-16T04:01:10.449Z',
      },
      {
        progress: 'in_review',
        process_date: null,
        expected_process_date: '2024-12-18T15:00:00.000Z',
      },
      {
        progress: 'decision',
        process_date: null,
        expected_process_date: '2024-12-23T15:00:00.000Z',
      },
      {
        progress: 'settlement',
        process_date: null,
        expected_process_date: '2024-12-25T15:00:00.000Z',
      },
    ],
    documents: [
      {
        title: 'Incident Photos',
        file_count: 3,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Police Report',
        file_count: 1,
        upload_date: '2024-12-15T09:00:00.000Z',
      },
      {
        title: 'Repair Quotation',
        file_count: 1,
        upload_date: '2024-12-16T09:00:00.000Z',
      },
    ],
    notes: [
      {
        title: 'Claims Adjuster',
        publish_date: '2024-12-18T08:00:00.000Z',
        created_date: '2024-12-18T08:00:00.000Z',
        content:
          'Reviewing repair quotations. May require additional quotes from approved workshops.',
      },
      {
        title: 'System',
        publish_date: '2024-12-16T08:00:00.000Z',
        created_date: '2024-12-16T08:00:00.000Z',
        content:
          'All required documents received. Claim moved to review queue.',
      },
    ],
    address: {
      address_line_1: '',
      address_line_2: 'Orchard Road',
      address_line_3: 'Singapore',
    },
    amount: 680,
    last_update: '2024-12-20',
    incident_date: '',
    estimate_settlement: '',
    description: 'Flight cancellation compensation',
    short_description: 'Flight cancellation compensation',
  },
];

const getClaims = (payload: any) => {
  const results = MOCK_DATA.map((item, idx) => ({
    id: idx + 1,
    ...item,
  })).filter((item) => {
    if (payload.claimNo) return item.claim_no === payload.claimNo;

    const queryStr = payload.queryStr?.toLowerCase() ?? '';
    return (
      (!payload.claimStatus || payload.claimStatus === item.status) &&
      (!payload.policyType ||
        payload.policyType === 'all' ||
        payload.policyType === item?.policy?.policy_type) &&
      (!payload.queryStr ||
        item.claim_no?.toLowerCase()?.startsWith(queryStr) ||
        item.short_description?.startsWith(queryStr) ||
        item.policy?.policy_type_name?.toLowerCase()?.startsWith(queryStr))
    );
  });

  const summary = {
    total: MOCK_DATA.length,
    draft: MOCK_DATA.filter((item) => item.status === 'draft').length,
    processing: MOCK_DATA.filter((item) => item.status === 'processing').length,
    approved: MOCK_DATA.filter((item) => item.status === 'approved').length,
    settled: MOCK_DATA.filter((item) => item.status === 'settled').length,
    rejected: MOCK_DATA.filter((item) => item.status === 'rejected').length,
  };

  if (!payload.pageNo || !payload.pageSize) return { summary, results };
  const fromIdx = (payload.pageNo - 1) * payload.pageSize;
  const toIdx = fromIdx + payload.pageSize;

  return { summary, results: results.slice(fromIdx, toIdx) };
};

let timeout: any;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getClaims<T = ClaimResponseData>(
    payload: ClaimPayload,
  ): Promise<AxiosResponse<T>> {
    const params = {
      claimNo: payload?.claimNo ?? undefined,
      queryStr: payload?.queryStr,
      status: payload?.claimStatus,
      type: payload?.policyType,
      pagination: {
        page: payload.pageNo,
        pageSize: payload.pageSize,
      },
    };

    clearTimeout(timeout);
    // return baseClient.get<T>(`${API_CLAIM_GET}`, { params });
    return new Promise((resolve) => {
      timeout = setTimeout(
        () => {
          return resolve({
            data: {
              data: getClaims(payload),
              meta: { pagination: {} },
            } as any,
          });
        },
        Math.ceil(Math.random() * 100 + 50),
      );
    }) as any;
  },
};
