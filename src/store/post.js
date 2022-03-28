import CitationManager from '../components/Editor/CitationManager'

const citationManager = new CitationManager()

const getDefaultState = () => {
  citationManager.reset()
  return {
    articleId: undefined,
    isNewPost: false,
    isAnonymous: false,
    data: {},
    postAuthors: [],
    postTitle: '',
    postTags: [],
    blocks: [],
    citation: citationManager,
    categorySelected: '',
    currentEditingEditor: null,
    showAddPointsAlert: false,
    currentEditors: {},
    modalComponent: null,
    modalContext: {}
  }
}

const state = getDefaultState()

const mutations = {
  PUSH_BLOCK(state, block) {
    state.blocks.push(block)
  },
  ADD_BLOCK(state, { index, block }) {
    if (index < 0) {
      state.blocks.unshift(block)
    } else {
      const insertPosition = index + 1
      state.blocks.splice(insertPosition, 0, block)
    }
  },
  DELETE_BLOCK(state, index) {
    state.blocks.splice(index, 1)
    state.currentEditingEditor = null
  },
  UPDATE_BLOCK_CONTENT(state, { id, content }) {
    const block = findBlockById(state, id)
    if (!block) return
    block.content = content
  },
  UPDATE_BLOCK_TITLE(state, { id, title }) {
    const block = findBlockById(state, id)
    if (!block) return
    block.blockTitle = title
  },
  UPDATE_BLOCK_DATETIME(state, { id, datetime }) {
    const block = findBlockById(state, id)
    if (!block) return
    block.blockDateTime = datetime
  },
  SET_CITATION(state, { index, citation }) {
    state.citations[index] = citation
  },
  SET_CITATION_LIST(state, citations) {
    state.citations = citations
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
  EDIT_TAG(state, { index, newTag }) {
    state.postTags[index] = newTag
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
  REGISTER_EDITOR(state, { id, editor }) {
    state.currentEditors[id] = editor
    editor.view.dom.id = id
  },
  INIT_POST(state, payload) {
    const data = payload.data
    state.data = data
    state.postAuthors = data.authors
    state.postTitle = data.title
    state.postTags = data.tags || []
    state.blocks = data.blocks || []
    state.categorySelected = data.category || '未分類'
    state.citatoin.reset()
    // init blocks, set timeEnable to be true to be compatible with older articles
    for (const block of state.blocks) {
      if (!Object.prototype.hasOwnProperty.call(block, 'timeEnable')) {
        if (block.blockDateTime) {
          block['timeEnable'] = true
        } else {
          block['timeEnable'] = false
        }
      }
    }
  },
  TOGGLE_TIME_ENABLE(state, { id, value }) {
    const block = findBlockById(state, id)
    if (!block) return
    block.timeEnable = value
  },
  SET_MODAL_CONTEXT(state, { context }) {
    state.modalContext = context
  },
  SET_MODAL_COMPONENT(state, { componentString }) {
    state.modalComponent = componentString
  },
  SET_EDITOR_LINK(state, modalContent) {
    const { content, url } = modalContent
    const { caretPosBeg, caretPosEnd } = state.modalContext
    if (caretPosBeg === null || caretPosEnd === null) {
      state.currentEditingEditor
        .chain()
        .insertContent(`<a href="${url}" target="_blank">${content}</a>`)
        .focus()
        .run()
      return
    }
    state.currentEditingEditor
      .chain()
      .insertContentAt(
        { from: caretPosBeg, to: caretPosEnd },
        `<a href="${url}" target="_blank">${content}</a>`
      )
      .focus()
      .run()
  },
  SET_EDITOR_IMAGE(state, imageLink) {
    const { url } = imageLink
    if (url) {
      state.currentEditingEditor.chain().focus().setImage({ src: url }).run()
    }
  },
  REMOVE_CITATION(state, index) {
    state.citations.splice(index, 1)
  }
}

const getters = {
  GET_BLOCK_DATETIME: (state) => (id) => {
    const block = findBlockById(state, id)
    if (!block) return ''
    return block.blockDateTime
  },
  GET_EDITOR_BY_ID: (state) => (id) => {
    let editor = null
    if (id in state.currentEditors) editor = state.currentEditors[id]
    return editor
  },
  GET_PUBLISH_DATA: (state) => {
    return {
      ...state.data,
      title: state.postTitle,
      tags: state.postTags,
      authors: state.postAuthors,
      blocks: state.blocks,
      citations: state.citation.getPublishList(),
      isAnonymous: state.isAnonymous,
      category: state.categorySelected ? state.categorySelected : '未分類'
    }
  }
}

const actions = {
  SUBMIT_CITATION_FORM({ commit, state }, citation) {
    const findIndex = state.citations.findIndex((c) => c.url === citation.url)
    if (findIndex === -1) {
      commit('PUSH_CITATION', citation)
    } else {
      commit('SET_CITATION', { index: findIndex, citation })
    }
  },
  ADD_EDITOR_CITATION({ state }, citation) {
    const { title, url } = citation
    const id = state.currentEditingEditor.view.dom.id
    state.currentEditingEditor.commands.insertContent(
      `<tiptap-citation title=${title} url=${url} editorId=${id} />`
    )
  },
  UPDATE_EDITOR_CITATION({ state }, { citation, title, url }) {
    state.citation.updateCitation(citation, title, url)
  },
  REMOVE_EDITOR_CITATION({ state }, citation) {
    state.citation.removeCitation(citation)
  },
  ADD_EDITOR_CITATION_NODE({ state }, { title, url, node }) {
    return state.citation.registerNode(title, url, node)
  },
  REMOVE_EDITOR_CITATION_NODE({ state }, citation, node) {
    state.citation.unregisterNode(citation, node)
  }
}

// Helper functions

function findBlockById(state, id) {
  return state.blocks.find((block) => block.id === id)
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
