import store from '@/store/index'

class CitationOpError extends Error {
  /**
   * Custom error for operation on citation
   * @param {String} msg message of error
   * @param  {...any} params other parameters
   */
  constructor(msg, ...params) {
    super(msg, ...params)

    // Maintains stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CitationOpError)
    }

    this.name = 'CitationOpError'
  }
}

class CitationNode {
  /**
   * constructor of CitationNode
   * @param {Node} node
   */
  constructor(node) {
    this.node = node
  }

  /**
   * get id of the editor that owns this node
   */
  get editorId() {
    return this.node.$props.editor.view.dom.id
  }

  /**
   * get pos of the node in the editor
   */
  get pos() {
    return this.node.getPos()
  }
}

class CitationInfo {
  /**
   * constructor
   * @param {String} title : title of citation
   * @param {String} url : url of citation
   */
  constructor(title, url) {
    new URL(url)

    if (title.length === 0) {
      throw new CitationOpError('Citation.info: title should not be empty')
    }

    this.info = { title, url, index: -1 }
    this.nodes = []
  }

  /**
   * connect node with citation
   *
   * @param {CitationNode} node node to be connected
   */
  addNode(node) {
    const editorId = store.state.post.currentEditingEditor.view.dom.id
    const citationNode = new CitationNode(node, editorId)

    this.nodes.push(citationNode)
    this.sortNodesArray()
  }

  /**
   *
   * @param {CitationNode} node node to be removed
   * @returns Boolean true if list of node is empty after removing
   */
  async removeNode(node) {
    this.nodes.splice(this.nodes.indexOf(node), 1)

    if (this.nodes.length === 0) return true
    return false
  }

  /**
   * delete all node in next tick
   */
  removeAllNode() {
    for (const node of this.nodes) {
      node.node.$nextTick(() => node.node.deleteNode())
    }
  }

  /**
   * update citation info
   * @param {String} title : new title
   * @param {String} url : new url
   * @throws {TypeError} : if a invalid url passed
   * @throws {CitationOpError} : if an empty title passed
   */
  updateInfo({ title, url }) {
    new URL(url)

    if (title.length === 0) {
      throw new CitationOpError('Citation.info: title should not be empty')
    }

    this.info = Object.assign({}, this.info, { title, url })
  }

  /**
   * update index of this citation
   * @param {Number} index new index of node to be updated
   */
  updateIndex(index) {
    this.info = Object.assign({}, this.info, { index })
  }

  /**
   * sort list of nodes from top to bottom
   */
  async sortNodesArray() {
    const blocks = store.state.post.blocks.map((b) => b.id)

    // create an object with key of editor ids
    const bucket = blocks.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {})

    // put nodes into bucket groupped by editorId
    for (const node of this.nodes) {
      bucket[node.editorId].push(node)
    }

    // sort by position in editor block
    for (const [k, v] of Object.entries(bucket)) {
      bucket[k] = v.sort((a, b) => a.pos > b.pos)
    }

    // set sorted list in nodes
    this.nodes = Object.values(bucket).flatMap((b) => b)
  }

  /**
   * get last node of this citation
   * @returns {CitationNode}
   */
  get lastNode() {
    return this.nodes[this.nodes.length - 1]
  }
}

const CitationInfoHandler = {
  get: (target, prop) => {
    return target[prop]
  },
  /**
   * avoid setting properties directly on the target
   * @param {CitatoinInfo} target
   * @param {String} prop key of target
   * @param {Object} value new value of target[key]
   */
  set: (target, prop, value) => {
    if (prop !== 'info') {
      throw new CitationOpError('Improper operation: No such property')
    } else {
      throw new CitationOpError(
        'Improper operation: Should now set info directly.'
      )
    }
  }
}

class CitationManager {
  /**
   * constructor of CitationManager
   */
  constructor() {
    this.citationList = []
    this.citationMap = new Map()
  }

  /**
   * connect node with citation.
   * if citation not existed, create new one.
   * @param {String} title title of citation
   * @param {String} url url of citation
   * @param {Node} node node to be connected
   * @returns {Proxy} proxy of citationInfo
   */
  registerNode(title, url, node) {
    const key = `${title}-${url}`

    let citationInfo = this.citationMap.get(key)

    // if no citation existed, create one
    if (!citationInfo) {
      citationInfo = new CitationInfo(title, url)
      this.citationList.push(citationInfo)
      this.citationMap.set(key, citationInfo)
    }

    citationInfo.addNode(node)
    this.sortList()

    return new Proxy(citationInfo, CitationInfoHandler)
  }

  /**
   * disconnect node from citation
   * @param {Proxy} citation proxy of citationInfo
   * @param {Node} node citation node in tiptap editor
   */
  unregisterNode(citation, node) {
    const { title, url } = citation.info
    const key = `${title}-${url}`

    const citationInfo = this.citationMap.get(key)

    if (!citationInfo) {
      throw new CitationOpError('CitationManager: Citation not existed')
    }

    const citationNode = new CitationNode(node)
    citationInfo.removeNode(citationNode).then((res) => {
      if (res === true) {
        this.citationList.splice(citationInfo.index, 1)
        this.citationMap.delete(key)
        this.updateCitationIndex()
      }
    })
  }

  /**
   * update citation info
   * @param {Proxy} citation proxy of citationInfo
   * @param {String} title new title
   * @param {String} url new url
   */
  updateCitation(citation, title, url) {
    const { title: oldTitle, url: oldUrl } = citation.info
    const key = `${oldTitle}-${oldUrl}`

    const citationInfo = this.citationMap.get(key)

    if (!citationInfo) {
      throw new CitationOpError('CitationManager: Citation not existed')
    }

    citationInfo.updateInfo({ title, url })

    const newKey = `${title}-${url}`

    this.citationMap.delete(key)
    this.citationMap.set(newKey, citationInfo)
  }

  /**
   * remove citation including all nodes in the post
   * @param {Proxy} citation proxy of citationInfo
   */
  removeCitation(citation) {
    const { title, url } = citation.info
    const key = `${title}-${url}`

    const citationInfo = this.citationMap.get(key)

    if (!citationInfo) {
      throw new CitationOpError('CitationManager: Citation not existed')
    }

    citationInfo.removeAllNode()
  }

  /**
   * @returns {Array<Proxy>} list of proxy of citationInfo
   */
  getList() {
    return this.citationList.map(
      (citationInfo) => new Proxy(citationInfo, CitationInfoHandler)
    )
  }

  /**
   * sort citation list from top to bottom by last node of each citation
   */
  async sortList() {
    const blocks = store.state.post.blocks.map((b) => b.id)

    // create an object with key of editor ids
    const bucket = blocks.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {})

    // put citation into bucket groupped by editorId
    for (const citationInfo of this.citationList) {
      bucket[citationInfo.nodes[0].editorId].push(citationInfo)
    }

    // sort by position in editor block
    for (const [k, v] of Object.entries(bucket)) {
      bucket[k] = v.sort((a, b) => a.nodes[0].pos > b.nodes[0].pos)
    }

    // set sorted list in citationList
    this.citationList = Object.values(bucket).flatMap((b) => b)

    await this.updateCitationIndex()
  }

  /**
   * update index of each citation (usually after sorting)
   */
  async updateCitationIndex() {
    this.citationList.forEach((citation, index) => {
      citation.updateIndex(index)
    })
  }
}

export default CitationManager
