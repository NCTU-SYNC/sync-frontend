const getDefaultState = () => {
  return {
    blocks: [],
    citations: [],
    currentEditingEditor: null
  }
}

const state = getDefaultState()

const mutations = {
  PUSH_BLOCK(state, block) {
    state.blocks.push(block)
  },
  ADD_BLOCK(state, { index, block }) {
    console.log('add block!')
    if (index < 0) {
      state.blocks.unshift(block)
    } else {
      const insertPosition = index + 1
      state.blocks.splice(insertPosition, 0, block)
    }
  },
  DELETE_BLOCK(state, index) {
    state.blocks.splice(index, 1)
  },
  UPDATE_BLOCK_CONTENT(state, { id, content }) {
    const block = state.blocks.find(b => b.id === id)
    if (block) {
      block.content = content
    }
  },
  UPDATE_BLOCK_TITLE(state, { id, title }) {
    const block = state.blocks.find(b => b.id === id)
    if (block) {
      block.blockTitle = title
    }
  },
  UPDATE_BLOCK_DATETIME(state, { id, datetime }) {
    const block = state.blocks.find(b => b.id === id)
    if (block) {
      block.blockDateTime = datetime
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
  },
  FOCUS_EDITOR(state, editor) {
    state.currentEditingEditor = editor
  }
}

const getters = {
  GET_BLOCK_DATETIME: (state) => (id) => {
    const block = state.blocks.find(block => block.id === id)
    if (block) {
      return block.blockDateTime
    }
    return ''
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
  getters,
  mutations,
  actions
}
