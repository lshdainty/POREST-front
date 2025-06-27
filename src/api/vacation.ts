import { api } from '@/api/index'
import { useQuery, useMutation } from '@tanstack/react-query';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum VacationQueryKey {
  POST_USE_VACATION = 'postUseVacation',
  GET_AVAILABLE_VACATIONS = 'getAvailableVacations',
}

interface PostUseVacationReq {
  vacation_id: number
  vacation_data: {
    user_no: number
    start_date: string
    end_date: string
    vacation_time_type: string
    vacation_desc: string
  }
}

const usePostUseVacation = (d: PostUseVacationReq) => {
  return useMutation({
    mutationFn: async (d: PostUseVacationReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/vacation/use/${d.vacation_id}`,
        data: d.vacation_data
      });

      if (resp.code !== 200) throw new Error('Failed to fetch users');

      return resp.data;
    },
    onSuccess: (data) => {
      // 사용자 목록 쿼리 무효화
      // queryClient.invalidateQueries({ queryKey: ['users'] });
      console.log(`POST 성공! 생성된 데이터: ${JSON.stringify(data, null, 2)}`);
    },
    onError: (error) => {
      console.log(`POST 실패: ${error.message}`);
    }
  });
}

interface GetAvailableVacationsReq {
  user_no: number
  start_date: string
}

interface GetAvailableVacationsResp {
  vacation_id: number;
  vacation_type: string;
  vacation_type_name: string;
  remain_time: number;
  occur_date: Date;
  expiry_date: Date;
}

const useGetAvailableVacations = (d: GetAvailableVacationsReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_AVAILABLE_VACATIONS],
    queryFn: async (): Promise<GetAvailableVacationsResp[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/vacation/available/${d.user_no}?startDate=${d.start_date}`
      });

      if (resp.code !== 200) throw new Error('Failed to fetch users');

      return resp.data;
    }
  });
}

export {
  // QueryKey
  VacationQueryKey,

  // API Hook
  usePostUseVacation,
  useGetAvailableVacations
}