import _ from 'lodash'
import articleAPI, { TIME_QUERY } from '@/api/article'

const state = {
  q: '',
  tbs: TIME_QUERY.ALL,
  category: '',
  result: null,
  isLoading: false
}

export const getters = {
  keyword: (state) => state.q,
  timeQuery: (state) => state.tbs,
  category: (state) => state.category
}

export const mutations = {
  SET_Q: (state, q) => {
    state.q = q ?? ''
  },

  SET_TBS: (state, tbs) => {
    // if tbs is not defined, set to default value
    state.tbs = _.includes(_.values(TIME_QUERY), tbs) ? tbs : TIME_QUERY.ALL
  },

  SET_CATEGORY: (state, category) => {
    state.category = category ?? ''
  },

  SET_RESULT: (state, result) => {
    state.result = result
  },

  LOADING: (state, isLoading) => {
    state.isLoading = isLoading
  }
}

export const actions = {
  async search({ commit, state }, query) {
    commit('SET_Q', query.q)
    commit('SET_TBS', query.tbs)
    commit('SET_CATEGORY', query.category)

    const res = await articleAPI.search({
      q: state.q,
      tbs: state.tbs,
      category: state.category
    })

    commit('SET_RESULT', res.data.data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
