const getDefaultState = () => {
  return {
    blocks: [],
    citations: []
  }
}

const state = getDefaultState()

const mutations = {
  PUSH_BLOCK(state, block) {
    state.blocks.push(block)
  },
  UPDATE_BLOCK(state, { id, content }) {
    const block = state.blocks.find(b => b.id === id)
    if (block) {
      block.content = content
    }
  },
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
