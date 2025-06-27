import { api } from '@/api/index'
import { useQuery } from '@tanstack/react-query';
import { TCalendar } from '@/types/calendar';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

export const enum CalendarQueryKey {
  GET_EVENTS_BY_PERIOD = 'getEventsByPeriod'
}

interface getEventsByPeriodReq {
  startDate: string
  endDate: string
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

export const useGetEventsByPeriod = (d: getEventsByPeriodReq) => {
  return useQuery({
    queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD, d.startDate, d.endDate],
    queryFn: async (): Promise<TCalendar[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/calendar/period?startDate=${d.startDate}&endDate=${d.endDate}`
      });

      if (resp.code !== 200) throw new Error('Failed to fetch event');

      return resp.data.map((e: getEventsByPeriodResp) => ({
        userNo: e.user_no,
        userName: e.user_name,
        calendarName: e.calendar_name,
        calendarType: e.calendar_type,
        calendarDesc: e.calendar_desc,
        startDate: e.start_date,
        endDate: e.end_date,
        domainType: e.domain_type,
        historyIds: e.history_ids,
        scheduleId: e.schedule_id
      }));
    }
  });
}