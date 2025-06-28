import { api } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarQueryKey } from '@/api/calendar';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum ScheduleQueryKey {
  POST_SCHEDULE = 'postSchedule',
  DELETE_SCHEDULE = 'deleteSchedule'
}

interface PostScheduleReq {
  user_no: number
  start_date: string
  end_date: string
  schedule_type: string
  schedule_desc: string
}

const usePostSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostScheduleReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/schedule`,
        data: d
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

const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (scheduleId: Number) => {
        const resp: ApiResponse = await api.request({
          method: 'delete',
          url: `/schedule/${scheduleId}`,
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
  ScheduleQueryKey,

  // API Hook
  usePostSchedule,
  useDeleteSchedule
}