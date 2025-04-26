import baseClient from './api.config';

export default {
  getQuoteByKey(key: string) {
    return baseClient.get('/quote/' + key);
  },
};
