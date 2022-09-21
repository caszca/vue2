import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfo, updateUserInfo } from '@/api/index'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',    //token字符串
    userInfo: {}   //用户信息 {email、id、username、nickname、user-pic},解析完，会数据代理
  },
  getters: {
    nickname(state) {
      return state.userInfo.nickname
    },
    user_pic(state) {
      return state.userInfo.user_pic
    },
    username(state) {
      return state.userInfo.username
    }
  },

  mutations: {
    updateToken(state, value) {
      state.token = value
    },

    //第一次登录获取用户信息
    updateUser(state, value) {
      state.userInfo = value
    },

  },
  actions: {

    async getUser(store) {
      const result = await getUserInfo()
      //console.log(result);
      store.commit('updateUser', result.data.data)
    },



  },
  modules: {
  },
  plugins: [
    createPersistedState()
  ]
})
