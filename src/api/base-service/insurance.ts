import { QuoteCreationPayload, QuoteResponse } from '@/libs/types/quote';
import baseClient from './api.config';

export default {
  getQuoteByKey(key: string) {
    return baseClient.get<QuoteResponse>('/quote/' + key);
  },
  createQuote(data: QuoteCreationPayload) {
    return baseClient.post<QuoteResponse>('/car/quote', data);
  },
};
