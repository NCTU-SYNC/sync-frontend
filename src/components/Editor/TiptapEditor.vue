<template>
  <div v-if="editor">
    <bubble-menu
      v-if="editable"
      class="floating-menu-link"
      :tippy-options="bubbleMenuOptions"
      :editor="editor"
      :should-show="shouldShow"
    >
      <icon icon="link" size="md" class="link-icon" />
      <div class="url">
        <a :href="editor.getAttributes('link').href" target="_blank">{{ editor.getAttributes('link').href }}</a>
      </div>
      <b-button variant="link" class="text-nowrap menu-btn" @click="menuEditLink()">
        編輯
      </b-button>
      <b-button variant="link" class="text-nowrap menu-btn" @click="menuRemoveLink()">
        刪除
      </b-button>
    </bubble-menu>

    <menu-bar
      v-if="editable"
      class="editor__header"
      :editor="editor"
      @showModal="showModal"
    />
    <editor-content :editor="editor" :class="editable ? 'editor__content__edit': 'editor__content'" />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import MenuBar from './MenuBar.vue'
import Citation from './CitationExtention/Citation'

export default {
  components: {
    EditorContent,
    BubbleMenu,
    MenuBar
  },
  props: {
    id: {
      type: String,
      default: null
    },
    content: {
      type: Object,
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      editor: null,
      caretPosBeg: null,
      caretPosEnd: null,
      selectedText: '',
      bubbleMenuOptions: { duration: 100, placement: 'bottom-start', zIndex: 100, popperOptions: { modifiers: [
        {
          name: 'preventOverflow',
          options: {
            boundary: document.querySelector('.main-editor-area')
          }
        }
      ] }}
    }
  },

  mounted() {
    this.editor = new Editor({
      onUpdate: ({ editor }) => {
        this.$store.commit('post/UPDATE_BLOCK_CONTENT', {
          id: this.id,
          content: editor.getJSON()
        })
      },
      onFocus: ({ editor }) => {
        this.$store.commit('post/FOCUS_EDITOR', editor)
      },
      extensions: [
        StarterKit,
        Underline,
        Highlight.configure({
          multicolor: true
        }),
        Placeholder.configure({
          emptyEditorClass: 'is-editor-empty',
          placeholder: '段落內文'
        }),
        Typography,
        Link.configure({
          openOnClick: false
        }),
        Image,
        Superscript,
        Citation
      ],
      editable: this.editable,
      content: this.content
    })
    this.$store.commit('post/REGISTER_EDITOR', {
      id: this.id,
      editor: this.editor
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    showModal(modal) {
      const { from, to } = this.editor.state.selection
      this.text = this.editor.state.doc.textBetween(from, to, ' ')
      const context = {
        caretPosBeg: from,
        caretPosEnd: to
      }
      if (modal === 'link-modal') {
        if (this.editor.isActive('link')) {
          context['url'] = this.editor.getAttributes('link').href
        }
        context['content'] = this.text
        this.$store.commit('post/SET_MODAL_CONTEXT', { context })
        this.$store.commit('post/SET_MODAL_COMPONENT', { componentString: 'LINK' })
      } else if (modal === 'citation-modal') {
        this.$store.commit('post/SET_MODAL_CONTEXT', { context: { index: -1 }})
        this.$store.commit('post/SET_MODAL_COMPONENT', {
          componentString: 'CITATION'
        })
      } else if (modal === 'upload-image-modal') {
        this.$store.commit('post/SET_MODAL_COMPONENT', { componentString: 'UPLOAD_IMAGE' })
      }
    },
    shouldShow({ editor, view, state, oldState }) {
      return editor.isActive('link')
    },
    menuRemoveLink() {
      this.editor.chain().unsetLink().focus().run()
    },
    menuEditLink() {
      this.editor.commands.extendMarkRange('link')
      this.showModal('link-modal')
    }
  }
}
</script>

<style lang="scss">
// .editor__header {
//   margin-top: 0.5rem;
// }

.editor__content {
  margin-top: 0.5rem;
  p {
    font-size: 18px;
    line-height: 30px;
    color: $black;
  }
  sup {
    background-color: $gray-light;
    padding: 0px 3px;
    font-size: 9px;
    line-height: 13px;
    vertical-align: text-top;
  }
  .ProseMirror {
    ul,
    ol {
      padding-left: 2rem;
    }
    blockquote {
      margin-left: 1rem;
      padding-left: 1rem;
      border-left: 4px solid rgba(35, 35, 35, 1);
      margin-top: 18px;
      margin-bottom: 18px;
    }
  }
  &__comparison {
    p {
      font-size: 16px;
      line-height: 24px;
    }
  }
}

.editor__content__edit {
  margin-top: 0.5rem;
  background-color: $white;
  border-radius: 0.25rem;
  padding: 1rem;

  color: #000;
  font-size: 1.125rem;
  line-height: 1.875rem;
  min-height: 148px;
}

/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  a {
    color: $blue;
    text-decoration: underline !important;
  }

  p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: rgba(0, 0, 0, 0.2);
    pointer-events: none;
    height: 0;
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

.floating-menu-link {
  display: flex;
  align-items: center;
  .link-icon {
    flex-shrink: 0;
  }
  .url {
    font-size: 10px;
    overflow: hidden;
    white-space: nowrap;
    max-width: 221px;
    text-overflow: ellipsis;
    color: $blue-4;
    text-decoration: underline $blue solid !important;
    padding-right: 8px;
    padding-left: 14px;
    a {
      font-size: 12px;
      color: $blue-4;
    }
  }
  max-width: 387px;
  height: 36px;
  padding: 6px 16px;
  background: $white;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  button {
    position: relative;
    color: $text-2;
    font-size: 14px;
    padding: 0;
    padding-left: 9px;
    padding-right: 8px;
    &::before {
      content: '';
      position: absolute;
      border-left: 1px solid $gray-2;
      height: 24px;
      left: 0;
    }
    &:last-child{
      padding-right: 0px;
    }
  }
}
</style>
