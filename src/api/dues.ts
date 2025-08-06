import { api } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum DuesQueryKey {
  GET_YEAR_DUES = 'getYearDues',
  GET_YEAR_OPERATION_DUES = 'getYearOperationDues',
  GET_MONTH_BIRTH_DUES = 'getMonthBirthDues',
  GET_USERS_MONTH_BIRTH_DUES = 'getUsersMonthBirthDues',
  POST_DUES = 'postDues',
  DELETE_DUES = 'deleteDues'
}

interface getYearDuesReq {
  year: string
}

interface getYearDuesResp {
  dues_seq: number
  dues_user_name: string
  dues_amount: number
  dues_type: string
  dues_calc: string
  dues_date: string
  dues_detail: string
  total_dues: number
}

const useGetYearDues = (reqData: getYearDuesReq) => {
  return useQuery({
    queryKey: [DuesQueryKey.GET_YEAR_DUES, reqData],
    queryFn: async (): Promise<getYearDuesResp[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/dues?year=${reqData.year}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
}

interface getYearOperationDuesReq {
  year: string
}

interface getYearOperationDuesResp {
  total_dues: number
  total_deposit: number
  total_withdrawal: number
}

const useGetYearOperationDues = (reqData: getYearOperationDuesReq) => {
  return useQuery({
    queryKey: [DuesQueryKey.GET_YEAR_OPERATION_DUES, reqData],
    queryFn: async (): Promise<getYearOperationDuesResp> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/dues/operation?year=${reqData.year}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
}

interface useGetMonthBirthDuesReq {
  year: string
  month: string
}

interface useGetMonthBirthDuesResp {
  birth_month_dues: number
}

const useGetMonthBirthDues = (reqData: useGetMonthBirthDuesReq) => {
  return useQuery({
    queryKey: [DuesQueryKey.GET_MONTH_BIRTH_DUES, reqData],
    queryFn: async (): Promise<useGetMonthBirthDuesResp> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/dues/birth/month?year=${reqData.year}&month=${reqData.month}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
}

interface useGetUsersMonthBirthDuesReq {
  year: string
}

interface useGetUsersMonthBirthDuesResp {
  dues_user_name: string
  month_birth_dues: Array<number>
}

const useGetUsersMonthBirthDues = (reqData: useGetUsersMonthBirthDuesReq) => {
  return useQuery({
    queryKey: [DuesQueryKey.GET_USERS_MONTH_BIRTH_DUES, reqData],
    queryFn: async (): Promise<useGetUsersMonthBirthDuesResp[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/dues/users/birth/month?year=${reqData.year}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
}

interface PostDuesReq {
  dues_amount: number
  dues_type: string
  dues_calc: string
  dues_date: string
  dues_detail: string
  dues_user_name: string
}

const usePostDues = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostDuesReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/dues`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [DuesQueryKey.GET_YEAR_DUES] });
      console.log(`POST 성공! 생성된 데이터: ${JSON.stringify(data, null, 2)}`);
    },
    onError: (error) => {
      console.log(`POST 실패: ${error.message}`);
    }
  });
}

const useDeleteDues = () => {
  const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (dues_seq: number) => {
        const resp: ApiResponse = await api.request({
          method: 'delete',
          url: `/user/${dues_seq}`
        });
  
        if (resp.code !== 200) throw new Error(resp.data.data.message);
  
        return resp.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [DuesQueryKey.GET_YEAR_DUES] });
        console.log(`DELETE 성공!`);
      },
      onError: (error) => {
        console.log(`DELETE 실패: ${error.message}`);
      }
    }); 
} 

export {
  // QueryKey
  DuesQueryKey,

  // API Hook
  useGetYearDues,
  useGetYearOperationDues,
  useGetMonthBirthDues,
  useGetUsersMonthBirthDues,
  usePostDues,
  useDeleteDues
}