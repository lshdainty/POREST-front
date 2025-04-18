import {api} from '@/api/index'

export const getHolidayByStartEndDate = (start: string, end: string) => {
  return api.request({
    method: 'get',
    url: `/holidays/date?start=${start}&end=${end}`
  });
}