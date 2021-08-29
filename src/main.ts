import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { register } from './global'
import sakuraRequest from './service/index'
//初始化页面样式
import 'normalize.css'
import './assets/css/index.less'

// register()可以这样传入vue实例，也可以直接use使用register函数,会默认传入组件实例
//这样按需集中注册组件，就不用每次用到都注册一次了
createApp(App).use(router).use(store).use(register).mount('#app')

//定义请求方法的返回值类型
//因为请求方法内部的返回值类型已经改变，需要我们手动传递类型指定与内部返回数据一致的类型
//使得里外数据的类型一致,这里定义的接口类型需要与请求方法内部返回的数据类型一致，否则无效
interface DataType {
  result: any
  code: string
  success: boolean
}

sakuraRequest
  .request<DataType>({
    url: '/search',
    method: 'POST',
    params: {
      keywords: '恋爱循环'
    },
    interceptors: {
      requestInterceptor(config) {
        console.log('本次请求单独设置的请求成功的拦截器')
        return config
      },
      responseInterceptor(res) {
        console.log('本次请求单独设置的响应成功的拦截器')
        return res
      }
    }
  })
  .then((res) => {
    console.log(res.result)
    console.log(res.code)
    console.log(res.success)
  })
