import Vue from 'vue'
// 引入element ui创建
import ElementUI from 'element-ui'
// 引入element ui 的样式
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
// 引入通用样式
import '@/assets/common.css'
// 引入axios
import axios from 'axios'
// 引入moment
import moment from 'moment'
// 引入vue-quill-editor 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 引入vue-quill-editor 样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
// 把axios放到Vue原型上将来vue所有的实例都能用axios
Vue.prototype.axios = axios
// 1.给axios配置默认值
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
// 2. 给axios设置请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 给config配置baseURL
    // config.baseURL = 'http://localhost:8888/api/private/v1/'
    // 给config设置headers
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 使用element ui插件
Vue.use(ElementUI)
Vue.config.productionTip = false
// 定义全局过滤器 用于过滤时间
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
  // render: function(creatElement) {
  //   return creatElement(App)
  // }
})
