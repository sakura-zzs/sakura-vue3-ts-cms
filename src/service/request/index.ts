import axios from 'axios'
//引入axios的实例类型
import type { AxiosInstance } from 'axios'
//引入自定义的请求参数类型和拦截器类型
import type { SakuraInterceptors, SakuraRequestConfig } from './type'
import { ElLoading } from 'element-plus' //导入加载动画组件
import { ILoadingInstance } from 'element-plus/lib/el-loading/src/loading.type' //导入加载动画服务的类型

//定义加载动画开关的默认值,默认开启
const DEFAULT_LOADING = true
class SakuraRequest {
  instance: AxiosInstance
  interceptors?: SakuraInterceptors
  showLoading: boolean
  loading?: ILoadingInstance
  constructor(config: SakuraRequestConfig) {
    //创建axios实例
    this.instance = axios.create(config)
    //保存某些axios实例需要的拦截器
    this.interceptors = config.interceptors

    //初始化加载动画的属性
    this.showLoading = config.showLoading ?? DEFAULT_LOADING
    //根据实例传递的拦截器函数创建请求拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    //根据实例传递的拦截器函数创建响应拦截器
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )

    //添加所有axios实例都有的拦截器（公共拦截器）
    this.instance.interceptors.request.use(
      (config) => {
        console.log('所有实例都有的公共的请求成功的拦截器')
        if (this.showLoading) {
          //开启加载动画
          this.loading = ElLoading.service({
            lock: true, //开启显示加载动画时的遮罩层
            text: '正在加载中', //显示加载动画时的文字说明
            background: 'rgba(0,0,0,0.5)' //遮罩层的颜色
          })
        }
        return config
      },
      (err) => {
        console.log('所有实例都有的公共的请求失败的拦截器')
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        console.log('所有实例都有的公共的响应成功的拦截器')
        //拿到响应结果,请求结束,关闭加载动画
        this.loading?.close()
        //在这里对响应的多余数据做处理，只取出有用的数据
        res = res.data
        return res
      },
      (err) => {
        console.log('所有实例都有的公共的响应失败的拦截器')
        //响应失败也关闭加载动画
        this.loading?.close()
        return err
      }
    )
  }
  //封装通用的请求方法request
  request<T>(config: SakuraRequestConfig<T>): Promise<T> {
    //通过promise的形式将响应结果返回出去
    return new Promise((resolve, reject) => {
      //创建请求方法自己的拦截器
      //设置在调用axios实例的request方法前触发请求拦截器，将传递进来的请求参数拦截处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }
      //若传递了为false的加载动画开关属性,则将动画开关属性置为false,本次请求不开启加载动画
      if (config.showLoading === false) {
        this.showLoading = config.showLoading
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          //在这里已经拿到响应结果了，即响应成功
          //响应成功,本次请求结束,将加载动画开关值恢复为默认值(true),这样就不会影响下一次请求了
          this.showLoading = DEFAULT_LOADING
          if (config.interceptors?.responseInterceptor) {
            //第二个类型冲突
            //T类型不能赋值给AxiosResponse类型
            //因为我们定义的拦截器接口中响应成功拦截器返回的res和接收的res是AxiosResponse类型
            //而这里的res已经被改为手动调用方法时通过泛型传递的类型T了，这就会有类型冲突
            //所以我们不能在定义拦截器接口时将响应成功拦截器返回的res和接收的res的类型固定为AxiosResponse类型了
            //我们为了拓展axios的请求参数类型而定义的自己的请求参数类型中使用了拦截器接口
            //所以可以在使用请求参数类型接口时可以将类型T传给请求参数类型接口
            //再通过请求参数类型接口中使用的拦截器接口将类型T传递给拦截器接口本身
            //拦截器接口再将类型T给到响应成功拦截器，完成对响应成功拦截器类型的改变，使它的类型与这里的res一致
            //只有在这里才需要类型的改变，其他地方响应成功拦截器的类型应还是AxiosResponse类型
            //所以可以给需要给拦截器接口和请求参数接口的类型T设置默认值为AxiosResponse类型
            //这样需要改变类型的地方直接传递类型就可以了，而不需要的地方还是默认值，并不会因此而改变
            res = config.interceptors.responseInterceptor(res)
          }
          console.log(res)
          //第一个类型冲突
          //在这里res的类型会冲突，因为在全局响应拦截器中提取出了我们需要的res，
          //而下面resolve的res是request方法返回的，它的类型是AxiosResponse，
          //而本来应该从这个类型的数据中提取出里面的data才与全局响应拦截器放行的res类型一致
          //这就导致了类型冲突
          //我们可以通过request方法的泛型改变它返回数据的类型，request方法有两个泛型（ctrl点进去就可以查看），
          //第二个就是它返回的数据的类型，默认就是AxiosResponse，我们可以手动传递类型让它变成我们需要的类型
          resolve(res)
        })
        .catch((err) => {
          //响应失败,本次请求结束,将加载动画开关值恢复为默认值(true),这样就不会影响下一次请求了
          this.showLoading = DEFAULT_LOADING
          console.log(err)
          reject(err)
        })
    })
  }
  //封装其他的请求方法,这里还是调用的封装好的request方法，所以这里的SakuraRequestConfig也需要是T类型
  get<T>(config: SakuraRequestConfig<T>): Promise<T> {
    //这是单独的请求方法，所以需要单独指定请求方式，而调用它的时候就不需指定了
    //所以这里使用展开运算符将请求参数展开与请求方式合并，再调用request方法完成请求
    return this.request<T>({ ...config, method: 'GET' })
  }
  delete<T>(config: SakuraRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
  post<T>(config: SakuraRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  patch<T>(config: SakuraRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}

export default SakuraRequest
