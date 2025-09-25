import axios, { AxiosError, AxiosResponse } from 'axios'
import config from '@/config/config';
import { toast } from '@/components/alert/toast';

interface CustomHeaders {
  [key: string]: any;
}

interface ApiErrorResponse {
  code: number;
  message: string;
  count: number;
  data?: {
    code: number;
    message: string;
    url: string;
  };
}

const baseURL = config.apiBaseUrl;
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
    console.log('Request Error: ', err);
    return Promise.reject(err);
  }
);

// Response interceptor
api.interceptors.response.use(
  (resp: AxiosResponse) => {
    // 성공 응답은 그대로 data 부분만 반환
    return resp.data;
  },
  async (err: AxiosError<ApiErrorResponse>) => {
    console.log('API Error : ', err);

    // 네트워크 에러나 요청 자체가 실패한 경우
    if (!err.response) {
      toast.error('네트워크 오류가 발생했습니다.');
      return Promise.reject(new Error('네트워크 오류가 발생했습니다.'));
    }

    const { status, data } = err.response;

    // 401 에러 처리
    if (status === 401) {
      if (err.response.config.url !== `/api/relogin`) {
        console.log('jwt relogin');
        // 재로그인 로직 처리
      } else {
        toast.error('인증에 실패했습니다.');
      }
      return Promise.reject(new Error('인증에 실패했습니다.'));
    }

    // 기타 HTTP 에러 처리
    if (status >= 400) {
      // Java에서 온 에러 응답 구조에 따라 메시지 추출
      const errorMessage = data?.data?.message || data?.message || '서버 오류가 발생했습니다.';
      toast.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    // 기본 에러 처리
    const errorMessage = err.message || '알 수 없는 오류가 발생했습니다.';
    toast.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export { api };
