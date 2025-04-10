import request from '@/api/index'

export const getUsers = () => {
    return request({
        method: 'GET',
        url: '/users'
    })
}