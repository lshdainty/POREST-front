import { api } from '@/api/index'

export const getUsers = () => {
  // api.request({})

  const test = async () => {
    try {
      const resp = await api.request({
          method: 'get',
          url: '/users'
      })
      return resp.data;
    } catch (e) {
      console.log(e)
    }
  }

  const data = test();

  return data;

  // const data = await test({
  //     method: 'get',
  //     url: '/users'
  // });

  // console.log(data);
  // return data.data;

  return api.request({
      method: 'get',
      url: '/users'
  })
}

export const test = () => {
  const hello = async () => {
    try {
        const resp = await api.request({
            method: 'get',
            url: '/test'
        })
        return resp;
    } catch (e) {
        console.log(e)
    }
  }

  const data = hello();

  return data;
}