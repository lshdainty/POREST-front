import { api } from '@/api/index'
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: number
  data: T
}

const enum AuthQueryKey {
  POST_LOGIN = 'postLogin',
  POST_LOGOUT = 'postLogout'
}

interface PostLoginReq {
  id: string
  pw: string
}

interface PostLoginResp {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

const usePostLogin = () => {
  return useMutation({
    mutationFn: async (d: PostLoginReq): Promise<PostLoginResp> => {
      const resp: ApiResponse<PostLoginResp> = await api.request({
        method: 'post',
        url: `/login`,
        data: d
      });

      return resp.data;
    },
    onSuccess: (data) => {
      toast.success('로그인에 성공했습니다.');
      // 토큰 저장
      localStorage.setItem('token', data.token);
    },
    onError: (error) => {
      toast.error('로그인에 실패했습니다.');
      console.error('Login failed:', error);
    }
  });
}

const usePostLogout = () => {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.request({
        method: 'post',
        url: `/logout`
      });
    },
    onSuccess: () => {
      toast.success('로그아웃 되었습니다.');
      // 토큰 제거
      localStorage.removeItem('token');
      localStorage.removeItem('key');
    },
    onError: (error) => {
      toast.error('로그아웃에 실패했습니다.');
      console.error('Logout failed:', error);
    }
  });
}

export {
  // QueryKey
  AuthQueryKey,

  // API Hook
  usePostLogin,
  usePostLogout
}

export type {
  // Interface
  PostLoginReq,
  PostLoginResp
}