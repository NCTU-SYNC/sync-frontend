<template>
  <node-view-wrapper
    as="span"
    role="button"
    class="citation__node-wrapper"
    contenteditable="false"
  >
    <sup>{{ index + 1 }}</sup>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-2'
import { mapGetters } from 'vuex'

export default {
  components: {
    NodeViewWrapper
  },
  props: nodeViewProps,
  data() {
    return {
      citation: {
        title: this.node.attrs.title,
        url: this.node.attrs.url,
        node: this,
        editorId: this.node.attrs.editorId
      }
    }
  },
  computed: {
    ...mapGetters({ post: 'post' }),
    index() {
      return this.post.citations.indexOf(this.citation)
    }
  },
  async beforeMount() {
    await this.$store.dispatch('post/SUBMIT_CITATION_FORM', this.citation)
  },
  mounted() {
    // ! cannot bind event listener on node-view-wrapper in template
    // ! therfore we bind it here
    this.$el.onclick = this.editCitation
  },
  beforeDestroy() {
    this.$store.dispatch('post/REMOVE_EDITOR_CITATION', this.index)
  },
  methods: {
    editCitation() {
      const citations = this.$store.state.post.citations
      const context = { index: this.index, citation: citations[this.index] }
      this.$store.commit('post/SET_MODAL_CONTEXT', { context })
      this.$store.commit('post/SET_MODAL_COMPONENT', {
        componentString: 'CITATION'
      })
    }
  }
}
</script>

<style lang="scss">
.citation__node-wrapper {
  ::selection {
    color: white;
    background-color: $blue !important;
  }
}
</style>
