<template>
  <div v-if="editor">
    <bubble-menu
      v-if="false"
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
        Bold
      </button>
      <button :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
        Italic
      </button>
      <button :class="{ 'is-active': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
        Strike
      </button>
    </bubble-menu>

    <floating-menu
      v-if="false"
      class="floating-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
        H1
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        H2
      </button>
      <button :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
        Bullet List
      </button>
    </floating-menu>

    <menu-bar v-if="editable" class="editor__header" :editor="editor" @showImageModal="showImageModal" />
    <editor-content :editor="editor" :class="editable ? 'editor__content__edit': 'editor__content'" />
    <upload-image-modal ref="uploadImageModal" />
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import MenuBar from './MenuBar.vue'
import UploadImageModal from './Modals/UploadImageModal.vue'

export default {

  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    MenuBar,
    UploadImageModal
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
        this.$store.commit('post/UPDATE_BLOCK', {
          id: this.id,
          content: editor.getJSON()
        })
      },
      extensions: [
        StarterKit,
        Underline,
        Highlight,
        Typography,
        Link,
        Image
      ],
      editable: this.editable,
      content: this.content
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    addImage() {
      const url = window.prompt('URL')

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
    showImageModal() {
      this.$refs.uploadImageModal.show()
    }
  }
}
</script>

<style lang="scss">

.editor__header {
  margin-top: 0.5rem;
}

.editor__content {
  margin-top: 0.5rem;
}

.editor__content__edit {
  margin-top: 0.5rem;
  background-color: $white;
  border-radius: 0.25rem;
  padding: 1rem;
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
    background: #0D0D0D;
    color: #FFF;
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
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  a {
    color: $blue;
    text-decoration: underline !important;
  }
}

</style>
