import { AxiosRequestConfig } from 'axios';

const axiosConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  responseType: 'json',
  timeout: 30000,
};

const config = {
  axios: axiosConfig,
};

export default config;
