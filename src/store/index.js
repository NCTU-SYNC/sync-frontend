import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import post from './post'
Vue.use(Vuex)

const getDefaultState = () => {
  return {
    showFooter: true
  }
}

const state = getDefaultState()

const store = new Vuex.Store({
  modules: {
    user, post
  },
  state,
  getters: {
    isLogin: state => state.user.authenticated,
    token: state => state.user.token,
    displayName: state => state.user.displayName,
    photoURL: state => state.user.photoURL,
    uid: state => state.user.uid,
    post: state => state.post,
    showFooter: state => state.showFooter
  },
  mutations: {
    SET_FOOTER(state, show) {
      state.showFooter = show
      console.log(show)
    }
  }
})

export default store
