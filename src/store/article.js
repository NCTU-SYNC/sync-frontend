import { getProfile, addViewArticleById, subscribeArticleById } from '@/api/user'

const getDefaultState = () => {
  return {
    editedList: [],
    subscribedList: [],
    viewedList: [],
    isProfileReady: false
  }
}

const state = getDefaultState()

const getters = {
  editedList: state => state.editedList,
  subscribedList: state => state.subscribedList,
  viewedList: state => state.viewedList,
  isProfileReady: state => state.isProfileReady
}

const mutations = {
  ADD_SUBSCRIBE(state, articleId) {
    state.subscribedList = [...state.subscribedList, { articleId, timeStamp: Date.now() }]
  },
  REMOVE_SUBSCRIBE(state, articleId) {
    state.subscribedList = state.subscribedList.filter(element => element.articleId !== articleId)
  },
  SET_SUBSCRIBE(state, subscribedList) {
    state.subscribedList = subscribedList || []
  },
  SET_PROFILE(state, profile) {
    state.editedList = profile.edited || []
    state.subscribedList = profile.subscribed || []
    state.viewedList = profile.viewed || []
    state.isProfileReady = true
  },
  RESET(state) {
    state = getDefaultState()
  },
  ADD_VIEW(state, articleId) {
    state.viewedList.push(articleId)
  }
}

const actions = {
  async INITIALIZE({ commit, dispatch, rootGetters }) {
    // set token
    if (rootGetters.isLogin) {
      try {
        const token = await dispatch('user/getToken', null, { root: true })
        const { data } = await getProfile({ token })
        commit('SET_PROFILE', data.data.articles || {})
        return Promise.resolve(data.data)
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      } finally {
        setTimeout(() => {
          dispatch('INITIALIZE')
        }, 1000 * 60 * 5)
      }
    } else {
      return Promise.resolve({ articles: getDefaultState(), notifications: [] })
    }
  },
  async SUBSCRIBE({ commit, dispatch }, articleId) {
    const token = await dispatch('user/getToken', null, { root: true })
    const requestData = {
      articleId, token, subscribe: true
    }
    try {
      const { data } = await subscribeArticleById(requestData)
      const payload = data.data
      commit('SET_SUBSCRIBE', payload)
      // commit('ADD_SUBSCRIBE', articleId)
      return Promise.resolve(data)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  },
  async UNSUBSCRIBE({ commit, dispatch }, articleId) {
    const token = await dispatch('user/getToken', null, { root: true })
    const requestData = {
      articleId, token, subscribe: false
    }
    try {
      const { data } = await subscribeArticleById(requestData)
      const payload = data.data
      commit('SET_SUBSCRIBE', payload)
      // Remove legacy structure
      // commit('REMOVE_SUBSCRIBE', articleId)
      return Promise.resolve(data)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  },
  async VIEW({ commit, dispatch, rootGetters }, articleId) {
    if (!rootGetters.isInitialized || !state.isProfileReady) {
      setTimeout(() => {
        dispatch('VIEW', articleId)
      }, 100)
      return
    }
    const token = await dispatch('user/getToken', null, { root: true })
    const requestData = {
      articleId, token
    }
    try {
      const { data } = await addViewArticleById(requestData)
      commit('ADD_VIEW', articleId)
      return Promise.resolve(data)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
