import { api } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarQueryKey } from '@/api/calendar';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum VacationQueryKey {
  POST_USE_VACATION = 'postUseVacation',
  GET_AVAILABLE_VACATIONS = 'getAvailableVacations',
  DELETE_VACATION_HISTORY = 'deleteVacationHistory'
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

const usePostUseVacation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostUseVacationReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/vacation/use/${d.vacation_id}`,
        data: d.vacation_data
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
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

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
}

const useDeleteVacationHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacationHistoryId: Number) => {
      const resp: ApiResponse = await api.request({
        method: 'delete',
        url: `/vacation/history/${vacationHistoryId}`,
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
      console.log(`POST 성공! 생성된 데이터: ${JSON.stringify(data, null, 2)}`);
    },
    onError: (error) => {
      console.log(`POST 실패: ${error.message}`);
    }
  });
}

export {
  // QueryKey
  VacationQueryKey,

  // API Hook
  usePostUseVacation,
  useGetAvailableVacations,
  useDeleteVacationHistory
}