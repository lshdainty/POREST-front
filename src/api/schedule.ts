import { api } from '@/api/index'

export interface TSchedule {
  schedule_id: number;
  user_no: number;
  user_name: string;
  vacation_id: number;
  schedule_type: string;
  schedule_type_name: string;
  schedule_desc: string;
  start_date: Date;
  end_date: Date;
}

export const enum ScheduleQueryKey {
  GET_PERIOD_SCHEDULES = 'getPeriodSchedules'
}

export const getPeriodSchedules = (start: string, end: string): Promise<TSchedule[]> => {
  return api.request({
    method: 'get',
    url: `/schedules/period?startDate=${start}&endDate=${end}`
  });
}