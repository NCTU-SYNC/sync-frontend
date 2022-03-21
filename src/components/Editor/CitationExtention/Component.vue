<template>
  <node-view-wrapper
    as="span"
    role="button"
    class="citation__node-wrapper"
    contenteditable="false"
  >
    <sup>{{ info.index + 1 }}</sup>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-2'

export default {
  components: {
    NodeViewWrapper
  },
  props: nodeViewProps,
  data() {
    return {
      citation: {
        info: { index: -1 }
      },
      editorId: ''
    }
  },
  computed: {
    info() {
      return this.citation.info
    }
  },
  watch: {
    info(newInfo) {
      this.node.attrs.title = newInfo.title
      this.node.attrs.url = newInfo.url
    }
  },
  async beforeMount() {
    const title = this.node.attrs.title
    const url = this.node.attrs.url

    this.citation = await this.$store.dispatch(
      'post/ADD_EDITOR_CITATION_NODE',
      {
        title: title,
        url: url,
        node: this
      }
    )
  },
  mounted() {
    // ! cannot bind event listener on node-view-wrapper in template
    // ! therfore we bind it here
    this.$el.onclick = this.editCitation
  },
  beforeDestroy() {
    this.$store.dispatch(
      'post/REMOVE_EDITOR_CITATION_NODE',
      this.citation,
      this
    )
  },
  methods: {
    editCitation() {
      const context = { citation: this.citation }
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
