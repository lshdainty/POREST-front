import { api } from '@/api/index'
import { useQuery } from '@tanstack/react-query';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum DuesQueryKey {
  GET_YEAR_OPERATION_DUES = 'getYearOperationDues',
  GET_MONTH_BIRTH_DUES = 'getMonthBirthDues',
  GET_USERS_MONTH_BIRTH_DUES = 'getUsersMonthBirthDues'
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

export {
  // QueryKey
  DuesQueryKey,

  // API Hook
  useGetYearOperationDues,
  useGetMonthBirthDues,
  useGetUsersMonthBirthDues
}