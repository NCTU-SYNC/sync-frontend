import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import post from './post'
import article from './article'
Vue.use(Vuex)

const getDefaultState = () => {
  return {
    showFooter: true
  }
}

const state = getDefaultState()

const store = new Vuex.Store({
  modules: {
    user, post, article
  },
  state,
  getters: {
    isInitialized: state => state.user.isInitialized,
    isLogin: state => state.user.authenticated,
    token: state => state.user.token,
    displayName: state => state.user.displayName,
    photoURL: state => state.user.photoURL,
    uid: state => state.user.uid,
    post: state => state.post,
    user: state => state.user,
    showFooter: state => state.showFooter
  },
  mutations: {
    SET_FOOTER(state, show) {
      state.showFooter = show
    }
  }
})

export default store
