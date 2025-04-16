import { api } from '@/api/index'

export const getPeriodSchedules = (start: string, end: string) => {
  return api.request({
    method: 'get',
    url: `/schedules/period?startDate=${start}&endDate=${end}`
  })
}