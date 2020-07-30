import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user
  },
  getters: {
    token: state => state.user.token,
    name: state => state.user.name
  }
})

export default store
