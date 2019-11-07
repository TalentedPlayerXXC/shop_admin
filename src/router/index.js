import Vue from 'vue'
import Router from 'vue-router'
// 导入Login.vue组件

// 按需加载
// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName: "login" */ '@/components/Login')
// 导入Home.vue组件
// import Home from '@/components/Home'
const Home = () => import(/* webpackChunkName: "home" */ '@/components/Home')
// 导入Users.vue组件
// import Users from '@/components/users/Users'
const Users = () => import(/* webpackChunkName: "user" */ '@/components/users/Users')
// 导入Right.vue组件
// import Rights from '@/components/rights/Rights'
const Rights = () => import(/* webpackChunkName: "right" */ '@/components/rights/Rights')
// 导入Roles.vue组件
// import Roles from '@/components/rights/Roles'
const Roles = () => import(/* webpackChunkName: "right" */ '@/components/rights/Roles')
// 导入Categories.vue组件
// import Categories from '@/components/products/Categories'
const Categories = () => import(/* webpackChunkName: "product" */ '@/components/products/Categories')
// 导入Goods.vue组件
// import Goods from '@/components/products/Goods'
const Goods = () => import(/* webpackChunkName: "product" */ '@/components/products/Goods')
// 导入Add.vue组件
// import Add from '@/components/products/Add'
const Add = () => import(/* webpackChunkName: "product" */ '@/components/products/Add')
// 导入orders组件
// import Orders from '@/components/orders/orders'
const Orders = () => import(/* webpackChunkName: "order" */ '@/components/orders/Orders')
// 导入report组件
// import Report from '@/components/report/Report'
const Reports = () => import('@/components/report/Reports')
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
        },
        {
          path: '/orders',
          name: 'orders',
          component: Orders
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
