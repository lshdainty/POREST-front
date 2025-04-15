import { api } from '@/api/index'

export const getUsers = () => {
  return api.request({
    method: 'get',
    url: '/users'
  })
}