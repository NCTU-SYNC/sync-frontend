const citationManagerPlugin = (store) => {
  store.subscribe((mutation, state) => {
    // if mutation type is not 'PUSH_CITATION' or 'REMOVE_CITATION',
    // then skip
    if (
      !(
        mutation.type === 'post/PUSH_CITATION' ||
        mutation.type === 'post/REMOVE_CITATION'
      )
    ) {
      return
    }
    const citations = state.post.citations
    const blocks = state.post.blocks.map((b) => b.id)

    // create an object with key of editor ids
    const bucket = blocks.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {})

    // put citation into bucket groupped by editorId
    for (const c of citations) {
      bucket[c.editorId].push(c)
    }

    // sort by position in editor block
    for (const [k, v] of Object.entries(bucket)) {
      bucket[k] = v.sort((a, b) => a.node.getPos() > b.node.getPos())
    }

    // set sorted list in vuex
    const list = Object.values(bucket).flatMap((b) => b)
    store.commit('post/SET_CITATION_LIST', list)
  })
}

export default citationManagerPlugin
