<template inline-template>
  <node-view-wrapper as="span" role="button">
    <sup @click="scrollToCitation">{{ node.attrs.to }}</sup>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-2'

export default {
  components: {
    NodeViewWrapper
  },
  props: nodeViewProps,
  methods: {
    scrollToCitation() {
      console.log(`citation-${this.node.attrs.to}`)
      console.log(this.$parent.$parent.$parent.$parent.$refs.citation)
      const el =
        this.$parent.$parent.$parent.$parent.$refs.citation[
          `${this.node.attrs.to - 1}`
        ]
      el.scrollIntoView({ behavior: 'smooth' })
      /*
      const element = this.$refs[`citation-${this.node.attrs.to}`]
      window.scrollTo(0, element.offsetTop)
      */
    }
  }
}
</script>

<style></style>
