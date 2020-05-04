import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {

  },
  getters: {
    token: state => state.user.token,
    name: state => state.user.name
  }
})

export default store
