const getDefaultState = () => {
  return {
    articleId: undefined,
    isNewPost: false,
    isAnonymous: false,
    data: {},
    postAuthors: [],
    postTitle: '',
    postTags: [],
    blocks: [],
    citations: [],
    categorySelected: '',
    currentEditingEditor: null,
    showAddPointsAlert: false
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
  SET_TITLE(state, title) {
    state.postTitle = title
  },
  PUSH_TAG(state, newTag) {
    state.postTags.push(newTag)
  },
  REMOVE_TAG(state, index) {
    state.postTags.splice(index, 1)
  },
  SHOW_ADDPOINTS_ALERT(state, val) {
    state.showAddPointsAlert = val
  },
  SET_ANONYMOUS(state, val) {
    state.isAnonymous = val
  },
  SET_ARTICLEID(state, articleId) {
    state.articleId = articleId
  },
  SET_CATEGORY(state, category) {
    state.categorySelected = category
  },
  SET_NEW_POST(state, status) {
    state.isNewPost = status
  },
  FOCUS_EDITOR(state, editor) {
    state.currentEditingEditor = editor
  },
  INIT_POST(state, payload) {
    const data = payload.data
    state.data = data
    state.postAuthors = data.authors
    state.postTitle = data.title
    state.postTags = data.tags || []
    state.blocks = data.blocks || []
    state.categorySelected = data.category || ''
    state.citations = data.citations || []
  }
}

const getters = {
  GET_BLOCK_DATETIME: (state) => (id) => {
    const block = state.blocks.find(block => block.id === id)
    if (block) {
      return block.blockDateTime
    }
    return ''
  },
  GET_PUBLISH_DATA: (state) => {
    return {
      ...state.data,
      title: state.postTitle,
      tags: state.postTags,
      authors: state.postAuthors,
      blocks: state.blocks,
      citations: state.citations,
      isAnonymous: state.isAnonymous,
      category: state.categorySelected
    }
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
