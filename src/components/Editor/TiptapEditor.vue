<template>
  <div v-if="editor">
    <bubble-menu
      v-if="false"
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        Bold
      </button>
      <button
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        Italic
      </button>
      <button
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        Strike
      </button>
    </bubble-menu>

    <floating-menu
      v-if="false"
      class="floating-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        Bullet List
      </button>
    </floating-menu>

    <menu-bar
      v-if="editable"
      class="editor__header"
      :editor="editor"
      @showModal="showModal"
    />
    <editor-content
      :editor="editor"
      :class="editable ? 'editor__content__edit' : 'editor__content'"
    />
    <upload-image-modal ref="upload-image-modal" @addImage="addImage" />
    <citation-modal ref="citation-modal" @addCitation="addCitation" />
    <link-modal ref="link-modal" @addLink="addLink" />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import MenuBar from './MenuBar.vue'
import UploadImageModal from './Modals/UploadImageModal.vue'
import CitationModal from './Modals/CitationModal.vue'
import LinkModal from './Modals/LinkModal.vue'
import Citation from './CitationExtention/Citation'

export default {
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    MenuBar,
    UploadImageModal,
    CitationModal,
    LinkModal
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
      editor: null
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
        Highlight,
        Placeholder.configure({
          emptyEditorClass: 'is-editor-empty',
          placeholder: '段落內文'
        }),
        Typography,
        Link,
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
    addImage(data) {
      const { url } = data

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
    showModal(modal) {
      // prevent duplicated modals when there are multiple blocks
      if (!this.$refs[modal].visible) {
        this.$refs[modal].visible = true
      }
    },
    addLink(data) {
      const { content, url } = data
      this.editor.commands.insertContent(`<a href=${url}>${content}</>`)
    },
    async addCitation(data) {
      const { content, title, url } = data
      await this.$store.dispatch('post/SUBMIT_CITATION_FORM', { title, url })
      const { citations } = this.$store.state.post
      this.editor.commands.insertContent(
        `${content}<tiptap-citation to="1">${citations.length}</tiptap-citation>`
      )
      this.editor.chain().focus().toggleSuperscript().run()
      // this.editor.chain().focus().toggleNode('citation').run()
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
</style>
