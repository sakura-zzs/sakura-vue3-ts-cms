import SakuraRequest from './request'
import { BASE_URL, TIME_OUT } from './request/config'

const sakuraRequest = new SakuraRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      console.log('实例自己设置的请求成功的拦截')
      return config
    },
    requestInterceptorCatch: (err) => {
      console.log('实例自己设置的请求失败的拦截')
      return err
    },
    responseInterceptor: (res) => {
      console.log('实例自己设置的响应成功的拦截')
      return res
    },
    responseInterceptorCatch: (err) => {
      console.log('实例自己设置的响应失败的拦截')
      return err
    }
  }
})

export default sakuraRequest
