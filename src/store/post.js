const getDefaultState = () => {
  return {
    citations: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_CITATION(state, { index, citation }) {
    state.citations[index] = citation
  },
  PUSH_CITATION(state, citation) {
    state.citations.push(citation)
  },
  RESET_POST(state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  SUBMIT_CITATION_FORM({ commit, state }, citation) {
    const findIndex = state.citations.findIndex(c => c.url === citation.url)
    if (findIndex === -1) {
      commit('PUSH_CITATION', citation)
      return 'push'
    } else {
      commit('SET_CITATION', { index: findIndex, citation })
      return 'replace'
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
