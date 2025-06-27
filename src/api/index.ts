import axios, { AxiosError, AxiosResponse } from 'axios'

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

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    const headers = config.headers as CustomHeaders;
    // url에 따른 각종 header 세팅
    // jwt 사용시 accessToken 세팅
    return config;
  },
  (err: AxiosError) => {
    console.log('this?? : ', err);
    return Promise.reject(err);
  }
);

// Response interceptor
api.interceptors.response.use(
  (resp: AxiosResponse) => {
    return resp.data;
  },
  async (err: any) => {
    console.log("API Error:", err);

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

export {api};