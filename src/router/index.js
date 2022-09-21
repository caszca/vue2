import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home',    //重定向，为了让子路由组件显示

    children: [{
      path: 'home',      //嵌套路由
      component: () => import('@/views/home')
    },
    {
      path: 'user-info',
      component: () => import('@/views/user/userInfo')
    },
    {
      path: 'user-avatar',
      component: () => import('@/views/user/avatar')
    },
    {
      path: 'user-pwd',
      component: () => import('@/views/user/userPwd')
    },
    {
      path: 'art-cate',
      component: () => import('@/views/article/artCate')
    },
    {
      path: 'art-list',
      component: () => import('@/views/article/artList')
    }],

    beforeEnter: (to, from, next) => {   //独享路由守卫，获取用户信息，同时阻止未登录用户进入
      if (store.state.token) {
        store.dispatch("getUser");

        next();
      }
      else {
        next('/log')    //跳转到登陆页
      }

    }
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
    //webpack提供import函数来路由懒加载导入组件，
    //路由懒加载，就是页面路由切换带/reg，才去加载对应组件
  },
  {
    path: '/log',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

export default router
