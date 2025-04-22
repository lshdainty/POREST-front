import {api} from '@/api/index'

export interface THoliday {
  holiday_seq: number;
  holiday_name: string;
  holiday_date: string;
  holiday_type: string;
}

export const enum HolidayQueryKey {
  GET_HOLIDAY_BY_START_END_DATE = 'getHolidayByStartEndDate'
}

export const getHolidayByStartEndDate = (start: string, end: string): Promise<THoliday[]> => {
  return api.request({
    method: 'get',
    url: `/holidays/date?start=${start}&end=${end}`
  });
}