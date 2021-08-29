import { createRouter, createWebHashHistory } from 'vue-router'
//还可以这样写，表示导入的是一个类型
//import type { RouteRecordRaw } from 'vue-router'
import { RouteRecordRaw } from 'vue-router' //这个类型就是vue-router提供的createRouter函数第一个形参的类型

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/main',
    component: () => import('../views/main/main.vue')
  },
  {
    path: '/login',
    component: () => import('../views/login/login.vue')
  }
]

const router = createRouter({
  //按住ctrl键点击createRouter函数就能进到源码里看这个函数参数的类型
  routes,
  history: createWebHashHistory()
})

export default router
