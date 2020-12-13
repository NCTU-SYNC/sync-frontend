import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import post from './post'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user, post
  },
  getters: {
    isLogin: state => state.user.authenticated,
    token: state => state.user.token,
    displayName: state => state.user.displayName,
    photoURL: state => state.user.photoURL,
    uid: state => state.user.uid,
    post: state => state.post
  }
})

export default store
