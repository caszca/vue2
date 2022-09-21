import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI/index' // 让element-ui参与打包，webpack打包时，才会有入口
import '@/vue-quill-editor/index'  //引入vue-quill-editor富文本编辑器
import '@/dayjs'     //引入格式化时间

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
