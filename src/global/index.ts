import { App } from 'vue'
import registerComponent from './register-component'

export function register(app: App): void {
  // registerComponent(app)
  //app是vue组件实例，所以也可以使用use方法使用registerComponent函数
  app.use(registerComponent)
}
