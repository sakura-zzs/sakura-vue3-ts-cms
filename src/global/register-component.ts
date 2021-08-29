import { App } from 'vue' //取出APP类型
import 'element-plus/lib/theme-chalk/base.css'
import { ElButton } from 'element-plus'

const components = [ElButton]

export default function (app: App): void {
  for (const cpn of components) {
    app.component(cpn.name, cpn)
  }
}
