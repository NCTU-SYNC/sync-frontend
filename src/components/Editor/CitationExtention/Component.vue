<template inline-template>
  <node-view-wrapper as="span" role="button">
    <sup @click="editCitation">{{ index + 1 }}</sup>
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
        node: this
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
  beforeDestroy() {
    this.post.citations.splice(this.index, 1)
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

<style></style>
