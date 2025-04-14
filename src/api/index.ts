import axios, { AxiosError, AxiosResponse } from 'axios'
import { useEffect } from 'react';
import { useLoadStateStore } from '@/store/LoadingStore'

interface CustomHeaders {
  [key: string]: any;
}

const baseURL = 'http://localhost:8080/api/v1';
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const useAxiosInterceptor = () => {
  const { startLoading, endLoading, getState } = useLoadStateStore(s => s.actions);

  // Request interceptor
  const request = api.interceptors.request.use(
    (config: any) => {
      startLoading();
      console.log("request interceptor Load : ", getState())
      const headers = config.headers as CustomHeaders;
      // url에 따른 각종 header 세팅
      // jwt 사용시 accessToken 세팅
      return config;
    },
    (err: AxiosError) => {
      endLoading()
      console.log('this?? : ', err);
      return Promise.reject(err);
    }
  );

  // Response interceptor
  const response = api.interceptors.response.use(
    (resp: AxiosResponse) => {
      endLoading();
      console.log("response interceptor Load : ", getState())
      const res = resp.data;
      return res;
    },
    async (err: any) => {
      endLoading();
      console.log("resp err : ", err);

      if (err.response && err.response.status === 401) {
        if (err.response.config.url !== `/api/relogin`) {
          console.log('jwt relogin')
        } else {
          return err;
        }

        return err;
      }

      if (err.response && err.response.status !== 401) {
        return err.response;
      }
    }
  );

  useEffect(() => {
    return () => {
      api.interceptors.request.eject(request);
      api.interceptors.response.eject(response);
    };
  }, [request, response]);
};

export { useAxiosInterceptor, api };