import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from 'vuex/dist/vuex.common' // Why this: `Render()` in Testing Library uses common js
import user from './user'
import post from './post'
import article from './article'
import search from './search'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    showFooter: true
  }
}

const state = getDefaultState()

const store = new Vuex.Store({
  modules: {
    user,
    post,
    article,
    search
  },
  state,
  getters: {
    isInitialized: (state) => state.user.isInitialized,
    isLogin: (state) => state.user.authenticated,
    displayName: (state) => state.user.displayName,
    photoURL: (state) => state.user.photoURL,
    uid: (state) => state.user.uid,
    post: (state) => state.post,
    user: (state) => state.user,
    showFooter: (state) => state.showFooter,
    notifications: (state) => state.user.notifications
  },
  mutations: {
    SET_FOOTER(state, show) {
      state.showFooter = show
    }
  }
})

export default store
