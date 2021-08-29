import type { AxiosRequestConfig, AxiosResponse } from 'axios'
//定义自己的拦截器类型接口
export interface SakuraInterceptors<T = AxiosResponse> {
  //SakuraInterceptors接收SakuraRequestConfig传递过来的类型T，改变它里面的响应成功拦截器的类型
  //使它返回和接收的res与外部使用的一致
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (err: any) => any
}
//定义自己的请求参数类型接口，对axios的请求参数类型接口进行拓展
//使请求方法通过传递拦截器参数就能设置对某个请求进行拦截的功能
export interface SakuraRequestConfig<T = AxiosResponse>
  //接收使用SakuraRequestConfig时传递进来的类型T，传递给下面的SakuraInterceptors
  extends AxiosRequestConfig {
  interceptors?: SakuraInterceptors<T>
  //将加载动画的开关属性封装进请求参数接口，某些请求不需要加载动画就可以进行控制了
  showLoading?: boolean
}
