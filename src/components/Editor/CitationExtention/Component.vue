<template inline-template>
  <node-view-wrapper as="span" role="button">
    <sup @click="scrollToCitation">{{ index + 1 }}</sup>
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
    el() {
      return this.$parent.$parent.$parent.$parent.$refs.citation[this.index]
    },
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
    scrollToCitation() {
      this.el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style></style>
