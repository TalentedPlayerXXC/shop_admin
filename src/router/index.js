import Vue from 'vue'
import Router from 'vue-router'
// 导入Login.vue组件
import Login from '@/components/Login'
// 导入Home.vue组件
import Home from '@/components/Home'
// 导入Users.vue组件
import Users from '@/components/users/Users'
// 导入Right.vue组件
import Rights from '@/components/rights/Rights'
// 导入Roles.vue组件
import Roles from '@/components/rights/Roles'
// 导入Categories.vue组件
import Categories from '@/components/products/Categories'
// 导入Goods.vue组件
import Goods from '@/components/products/Goods'
// 导入Add.vue组件
import Add from '@/components/products/Add'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      // 给home路由配置子路由
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods-add',
          name: 'goods-add',
          component: Add
        }
      ]
    }
  ]
})
// 给router对象注册导航守卫
// to 要去哪
// form 从哪里来
// next()放行
router.beforeEach((to, form, next) => {
  // 判断token中是否有值
  let token = localStorage.getItem('token')
  // 如果是login的话也需要放行
  if (to.path === '/login' || token) {
    next()
  } else {
    // 如果没有token就去登录页
    next('/login')
  }
})
export default router
