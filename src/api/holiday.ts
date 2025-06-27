import { api } from '@/api/index'
import { useQuery } from '@tanstack/react-query';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum HolidayQueryKey {
  GET_HOLIDAYS_BY_START_END_DATE = 'getHolidaysByStartEndDate'
}

interface getHolidaysReq {
  start_date: string
  end_date: string
}

interface getHolidays {
  holiday_seq: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
}

const useGetHolidaysByStartEndDate = (d: getHolidaysReq) => {
  return useQuery({
    queryKey: [HolidayQueryKey.GET_HOLIDAYS_BY_START_END_DATE, d.start_date, d.end_date],
    queryFn: async (): Promise<getHolidays[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/holidays/date?start=${d.start_date}&end=${d.end_date}`
      });

      if (resp.code !== 200) throw new Error('Failed to fetch holidays');

      return resp.data;
    }
  });
}

export {
  // QueryKey
  HolidayQueryKey,

  // API Hook
  useGetHolidaysByStartEndDate
}