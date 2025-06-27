import { api } from '@/api/index'
import { useQuery } from '@tanstack/react-query';
import { THoliday } from '@/types/holiday';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

export const enum HolidayQueryKey {
  GET_HOLIDAYS_BY_START_END_DATE = 'getHolidaysByStartEndDate'
}

interface getHolidaysReq {
  startDate: string
  endDate: string
}

interface getHolidays {
  holiday_seq: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
}

export const useGetHolidaysByStartEndDate = (d: getHolidaysReq) => {
  return useQuery({
    queryKey: [HolidayQueryKey.GET_HOLIDAYS_BY_START_END_DATE, d.startDate, d.endDate],
    queryFn: async (): Promise<THoliday[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/holidays/date?start=${d.startDate}&end=${d.endDate}`
      });

      if (resp.code !== 200) throw new Error('Failed to fetch holidays');

      return resp.data.map((h: getHolidays) => ({
        holidayName: h.holiday_name,
        holidayDate: h.holiday_date,
        holidayType: h.holiday_type
      }));
    }
  });
};