import { getProfile, addViewArticleById, subscribeArticleById } from '@/api/user'

const getDefaultState = () => {
  return {
    editedList: [],
    subscribedList: [],
    viewedList: []
  }
}

const state = getDefaultState()

const getters = {
  editedList: state => state.editedList,
  subscribedList: state => state.subscribedList,
  viewedList: state => state.viewedList
}

const mutations = {
  ADD_SUBSCRIBE(state, articleId) {
    state.subscribedList = [...state.subscribedList, articleId]
  },
  REMOVE_SUBSCRIBE(state, articleId) {
    state.subscribedList = state.subscribedList.filter(elementId => elementId !== articleId)
  },
  SET_PROFILE(state, profile) {
    state.editedList = profile.edited || []
    state.subscribedList = profile.subscribed || []
    state.viewedList = profile.viewed || []
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
    if (!rootGetters.isInitialized) {
      setTimeout(() => {
        dispatch('INITIALIZE')
      }, 100)
      return
    }
    if (rootGetters.isLogin) {
      try {
        const { data } = await getProfile({ token: rootGetters.token })
        commit('SET_PROFILE', data.data)
        return Promise.resolve(data.data)
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      }
    } else {
      return Promise.resolve({})
    }
  },
  async SUBSCRIBE({ commit, rootGetters }, articleId) {
    const token = rootGetters.token
    const requestData = {
      articleId, token, subscribe: true
    }
    try {
      const { data } = await subscribeArticleById(requestData)
      commit('ADD_SUBSCRIBE', articleId)
      return Promise.resolve(data)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  },
  async UNSUBSCRIBE({ commit, rootGetters }, articleId) {
    const token = rootGetters.token
    const requestData = {
      articleId, token, subscribe: false
    }
    try {
      const { data } = await subscribeArticleById(requestData)
      commit('REMOVE_SUBSCRIBE', articleId)
      return Promise.resolve(data)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  },
  async VIEW({ commit, dispatch, rootGetters }, articleId) {
    if (!rootGetters.isInitialized) {
      console.log('VIEW is waiting for initialized')
      setTimeout(() => {
        dispatch('VIEW', articleId)
      }, 50)
      return
    }
    const token = rootGetters.token
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
