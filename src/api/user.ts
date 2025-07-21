import { api } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum UserQueryKey {
  GET_USERS = 'getUsers',
  POST_USER = 'postUser',
  PUT_USER = 'putUser',
  DELETE_USER = 'deleteUser'
}

interface getUsersResp {
  user_id: string
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

interface PostUserReq {
  user_id: string
  user_pwd: string
  user_name: string
  user_email: string
  user_birth: string
  user_employ: string
  user_work_time: string
  lunar_yn: string
}

const usePostUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostUserReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/user`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      console.log(`POST 성공! 생성된 데이터: ${JSON.stringify(data, null, 2)}`);
    },
    onError: (error) => {
      console.log(`POST 실패: ${error.message}`);
    }
  });
}

interface PutUserReq {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_employ: string
  user_work_time: string
  lunar_yn: string
}

const usePutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PutUserReq) => {
      const resp: ApiResponse = await api.request({
        method: 'put',
        url: `/user/${d.user_id}`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      console.log(`PUT 성공! 변경된 데이터: ${JSON.stringify(data, null, 2)}`);
    },
    onError: (error) => {
      console.log(`PUT 실패: ${error.message}`);
    }
  });
}

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user_id: string) => {
      const resp: ApiResponse = await api.request({
        method: 'delete',
        url: `/user/${user_id}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      console.log(`DELETE 성공!`);
    },
    onError: (error) => {
      console.log(`DELETE 실패: ${error.message}`);
    }
  });
}

export {
  // QueryKey
  UserQueryKey,

  // API Hook
  useGetUsers,
  usePostUser,
  usePutUser,
  useDeleteUser
}