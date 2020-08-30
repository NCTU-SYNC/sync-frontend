import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user
  },
  getters: {
    isLogin: state => state.user.authenticated,
    token: state => state.user.token,
    displayName: state => state.user.displayName,
    photoURL: state => state.user.photoURL,
    uid: state => state.user.uid
  }
})

export default store
