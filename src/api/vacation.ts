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

export const enum VacationQueryKey {
  CHECK_POSSIBLE = 'checkPossible'
}

export const checkPossible = (start: string, end: string): Promise<boolean> => {
  return api.request({
    method: 'get',
    url: `/vacation/check-possible/${1}?startDate=${start}&endDate=${end}`
  });
}