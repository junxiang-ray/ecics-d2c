import axios, { AxiosRequestConfig } from 'axios';

import AppConfig from '../config/AppConfig';
import DebugConfig from '../config/DebugConfig';

const debugLogFlag = process.env.DEBUG_LOG_FLAG;

const _apiLogRequest = (apiName: string, axiosRequest: any) => {
  console.group &&
    console.group(
      '%cAPI Request',
      'color:white;font-weight:bold;background:#0194ff;padding:2px 6px',
      apiName,
    );
  console.log('HTTP Method\t\t', axiosRequest.method.toUpperCase());
  console.log('Endpoint\t\t', axiosRequest.url);
  axiosRequest.data && console.log('Request Body\t', axiosRequest.data);
  console.log('AXIOS Request\t', axiosRequest);
  console.groupEnd && console.groupEnd();
};

const _apiLogResponse = (apiName: string, axiosResponse: any) => {
  console.log(axiosResponse);
  console.group &&
    console.group(
      '%cAPI Response',
      'color:white;font-weight:bold;background:green;padding:2px 6px',
      apiName,
    );
  console.log('HTTP Method\t\t', axiosResponse.config.method.toUpperCase());
  console.log('Endpoint\t\t', axiosResponse.config.url);
  axiosResponse.config.data &&
    console.log('Request Body\t', axiosResponse.config.data);
  axiosResponse.data && console.log('Response Body\t', axiosResponse.data);
  console.log('AXIOS Response\t', axiosResponse);
  console.groupEnd && console.groupEnd();
};

const apiLogError = (apiName: string, error: any) => {
  console.log('error', error);
  console.group &&
    console.group(
      '%cAPI Response',
      'color:white;font-weight:bold;background:red;padding:2px 6px',
      apiName,
    );
  console.log('HTTP Method\t\t', error.config.method.toUpperCase());
  console.log('Endpoint\t\t', error.config.url);
  error &&
    error.config.data &&
    console.log('Request Body\t', error.config.data);
  error && error.data && console.log('Response Body\t', error.data);
  console.log('AXIOS Error\t', error);
  console.groupEnd && console.groupEnd();
};

const client = axios.create(AppConfig.axios);

if (DebugConfig.logging) {
  client.interceptors.request.use(
    (request: any) => {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        request.headers.Authorization = 'Bearer ' + token;
      }
      return request;
    },
    (error) => {
      console.log('API Error', error);
      return error;
    },
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        const apiName = error.config.url || 'UNKNOWN';
        debugLogFlag && apiLogError(apiName, error.response);
        return error.response.data;
      } else if (error.request) {
        const apiName = error.config.headers.X_HEADER_API_LOG || 'UNKNOWN';
        debugLogFlag && apiLogError(apiName, error.request);
      } else {
        console.log('API Error', error.message);
      }
      throw error;
    },
  );
}

const myClient = {
  async post(endpoint: string, mParams: any, config?: AxiosRequestConfig) {
    const resp = await client.post<{
      data: any;
      meta: { code: number; message: string };
    }>(endpoint, mParams, config);
    return resp.data;
  },
  async put(endpoint: string, mParams: any, config?: AxiosRequestConfig) {
    const resp = await client.put<{
      data: any;
      meta: { code: number; message: string };
    }>(endpoint, mParams, config);
    return resp.data;
  },
  async get(endpoint: string, config?: AxiosRequestConfig) {
    const resp = await client.get<{
      data: any;
      meta: { code: number; message: string };
    }>(endpoint, config);
    return resp.data;
  },
  async delete(endpoint: string, config?: AxiosRequestConfig) {
    const resp = await client.delete<{
      data: any;
      meta: { code: number; message: string };
    }>(endpoint, config);
    return resp.data;
  },
};

export default myClient;
