//存放请求的根路径、超时时间等配置的配置文件

let BASE_URL = 'https://autumnfish.cn'
const TIME_OUT = 10000

//根据process.env.NODE_ENV的值判断当前所处环境，使用不同的请求根路径
// 开发环境: development
// 生成环境: production
// 测试环境: test

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'https://autumnfish.cn'
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http:sakura-zzs.com'
} else {
  BASE_URL = 'http:sakura-zzs.com'
}

export { BASE_URL, TIME_OUT }
