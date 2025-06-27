import { api } from '@/api/index'
import { useQuery } from '@tanstack/react-query';
import { TUser } from '@/types/user';

interface ApiResponse<T = any> {
  code: number
  message: "success"
  count: string
  data: T
}

interface getUsers {
  user_no: number
  user_name: string
  user_employ: string
  user_birth: string
  user_work_time: string
  lunar_yn: string
}

export const enum UserQueryKey {
  GET_USERS = 'getUsers'
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: [UserQueryKey.GET_USERS],
    queryFn: async (): Promise<TUser[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/users`
      });

      if (resp.code !== 200) throw new Error('Failed to fetch users');

      const users: TUser[] = resp.data.map((u: getUsers) => ({
        userNo: u.user_no,
        userName: u.user_name,
        userEmploy: u.user_employ,
        userBirth: u.user_birth,
        userWorkTime: u.user_work_time,
        lunarYN: u.lunar_yn,
      }));

      return users;
    }
  });
};