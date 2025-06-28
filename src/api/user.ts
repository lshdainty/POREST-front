import { api } from '@/api/index'
import { useQuery } from '@tanstack/react-query';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum UserQueryKey {
  GET_USERS = 'getUsers'
}

interface getUsersResp {
  user_no: number
  user_name: string
  user_employ: string
  user_birth: string
  user_work_time: string
  lunar_yn: string
}

const useGetUsers = () => {
  return useQuery({
    queryKey: [UserQueryKey.GET_USERS],
    queryFn: async (): Promise<getUsersResp[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/users`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
};

export {
  // QueryKey
  UserQueryKey,

  // API Hook
  useGetUsers
}