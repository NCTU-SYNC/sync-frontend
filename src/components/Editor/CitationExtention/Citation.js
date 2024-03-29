import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import Component from './Component.vue'

export default Node.create({
  name: 'citation',
  group: 'inline',
  content: 'inline*',
  atom: true,
  inline: true,
  addAttributes() {
    return {
      title: {
        default: ''
      },
      url: {
        default: ''
      },
      editorId: {
        default: ''
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
