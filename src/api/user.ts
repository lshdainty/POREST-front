import {api} from '@/api/index'

export interface TUser {
  user_no: Int16Array,
  user_name: string,
  user_employ: string,
  user_birth: string,
  user_work_time: string,
}

export const enum QueryKey {
  GET_USERS = 'getUsers'
}

export const getUsers = (): Promise<TUser[]> => {
  return api.request({
    method: 'get',
    url: '/users'
  })
}