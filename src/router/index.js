import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Ticket from '@/components/Ticket'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      meta: {
        title: '四川汽车票 - 订票助手'
      },
      component: Hello
    },
    {
      path: '/ticket',
      name: 'Ticket',
      meta: {
        title: '四川汽车票 - 开始订票'
      },
      component: Ticket
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        title: '四川汽车票 - 登录'
      },
      component: Login
    }
  ]
})
