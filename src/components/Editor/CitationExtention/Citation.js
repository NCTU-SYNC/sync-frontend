import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './Component.vue'

export default Node.create({
  name: 'citation',
  group: 'inline',
  inline: true,
  addAttributes() {
    return {
      to: {
        default: undefined
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'tiptap-citation'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['tiptap-citation', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  }
})
