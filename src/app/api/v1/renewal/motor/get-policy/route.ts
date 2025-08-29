import { NextRequest } from 'next/server';
import { fetchPolicyFromISP } from './get-policy.service';
import { ErrNotFound } from '@/app/api/core/error.response';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!key) {
    return ErrNotFound('Key query parameter is required');
  }
  return await fetchPolicyFromISP(key);
}
