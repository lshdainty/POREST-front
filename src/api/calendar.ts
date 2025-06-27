import { api } from '@/api/index'
import { useQuery } from '@tanstack/react-query';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum CalendarQueryKey {
  GET_EVENTS_BY_PERIOD = 'getEventsByPeriod'
}

interface getEventsByPeriodReq {
  start_date: string
  end_date: string
}

interface getEventsByPeriodResp {
  user_no: number
  user_name: string
  calendar_name: string
  calendar_type: string
  calendar_desc: string
  start_date: Date
  end_date: Date
  domain_type: string
  history_ids: number[]
  schedule_id: number
}

const useGetEventsByPeriod = (d: getEventsByPeriodReq) => {
  return useQuery({
    queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD, d.start_date, d.end_date],
    queryFn: async (): Promise<getEventsByPeriodResp[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/calendar/period?startDate=${d.start_date}&endDate=${d.end_date}`
      });

      if (resp.code !== 200) throw new Error('Failed to fetch event');

      return resp.data;
    }
  });
}

export {
  // QueryKey
  CalendarQueryKey,

  // API Hook
  useGetEventsByPeriod
}