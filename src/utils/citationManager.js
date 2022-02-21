const citaionManagerPlugin = (store) => {
  store.subscribe((mutation, state) => {
    if (mutation.type !== 'post/PUSH_CITATION') return
    console.log('mutation:', mutation)
    console.log(state.post.citations)
  })
}

export default citaionManagerPlugin
