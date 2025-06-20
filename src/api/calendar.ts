import { api } from '@/api/index'

export interface TCalendar {
  user_no: number;
  user_name: string;
  calendar_name: string;
  calendar_type: string;
  calendar_desc: string;
  start_date: Date;
  end_date: Date;
  domain_type: string;
  history_ids: number[];
  schedule_id: number;
}

export const enum CalendarQueryKey {
  GET_PERIOD_CALENDAR = 'getPeriodCalendar'
}

export const getPeriodCalendar = (start: string, end: string): Promise<TCalendar[]> => {
  return api.request({
    method: 'get',
    url: `/calendar/period?startDate=${start}&endDate=${end}`
  });
}