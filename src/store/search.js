import _ from 'lodash'
import articleAPI, { TIME_QUERY } from '@/api/article'
import router from '@/router'

const state = {
  query: {
    q: '',
    tbs: TIME_QUERY.ALL,
    category: ''
  },
  result: null,
  isLoading: false,
  needReload: false
}

export const getters = {
  keyword: (state) => state.query.q,
  timeQuery: (state) => state.query.tbs,
  category: (state) => state.query.category,
  result: (state) => state.result ?? [],
  isLoading: (state) => state.isLoading
}

export const mutations = {
  SET_Q: (state, q) => {
    if (state.query.q === q) return

    state.needReload = true
    state.query.q = q ?? ''
  },

  SET_TBS: (state, tbs) => {
    if (state.query.tbs === tbs) return

    state.needReload = true
    // if tbs is not defined, set to default value
    state.query.tbs = _.includes(_.values(TIME_QUERY), tbs) ? tbs : TIME_QUERY.ALL
  },

  SET_CATEGORY: (state, category) => {
    if (state.query.category === category) return

    state.needReload = true
    state.query.category = category ?? ''
  },

  SET_RESULT: (state, result) => {
    state.result = result.sort(
      (cur, next) => new Date(next.lastUpdatedAt) - new Date(cur.lastUpdatedAt)
    )
  },

  LOADING: (state, isLoading) => {
    state.isLoading = isLoading
  }
}

export const actions = {
  async setQuery({ commit, dispatch }, { q, tbs, category }) {
    commit('SET_Q', q)
    commit('SET_TBS', tbs)
    commit('SET_CATEGORY', category)

    dispatch('search')
  },

  updateQuery({ state, dispatch }) {
    const query = {}

    if (state.q) query.q = state.q
    if (state.tbs) query.tbs = state.tbs
    if (state.category) query.category = state.category

    dispatch('search')
  },

  updateKeyword({ commit, dispatch }, keyword) {
    commit('SET_Q', keyword)

    dispatch('updateQuery')
  },

  updateTimeQuery({ commit, dispatch }, timeQuery) {
    commit('SET_TBS', timeQuery)

    dispatch('updateQuery')
  },

  updateCategory({ commit, dispatch }, category) {
    commit('SET_CATEGORY', category)

    dispatch('updateQuery')
  },

  updateRouterQuery({ state }) {
    const query = _.omitBy(state.query, _.isEmpty)

    router.push({ path: 'search', query })
      .catch(() => {}) // to supress 'NavigationDuplicated' error
  },

  async search({ commit, state, dispatch }) {
    if (!state.needReload) return
    if (state.isLoading) return

    state.needReload = false
    state.isLoading = true

    const { q, tbs, category } = state.query

    const res = await articleAPI.search(q, tbs, category)

    commit('SET_RESULT', res.data.data)
    state.isLoading = false

    dispatch('updateRouterQuery')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
