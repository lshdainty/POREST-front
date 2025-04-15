import { api } from '@/api/index'

export const getPeriodSchedules = (start: any, end: any) => {
  return api.request({
    method: 'get',
    url: `/schedules/period?startDate=${start}&endDate=${end}`
  })
}