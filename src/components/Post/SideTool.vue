<template>
  <div class="tools-container">
    <b-button variant="light" class="btn-tool" @click="handleAddBlock">
      <SyncIcon icon="add-circle" size="sm" />
    </b-button>
    <b-button variant="transparent" class="btn-tool" @click="handleDuplicateBlock">
      <SyncIcon icon="copy" size="sm" />
    </b-button>
    <b-button variant="transparent" class="btn-tool" @click="handleDeleteBlock">
      <SyncIcon icon="delete" size="sm" />
    </b-button>
  </div>
</template>

<script>
import { Utils } from '@/utils'
import { mapGetters } from 'vuex/dist/vuex.common'

const focusBlock = (editor) => {
  setTimeout(() => editor.view.dom.focus())
}

export default {
  props: {
    blockIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters({ post: 'post' })
  },
  methods: {
    handleAddBlock() {
      const currentBlockCount = this.post.blocks.length
      const blockObj = {
        id: `${Utils.getRandomString()}-${(currentBlockCount + 1).toString()}`,
        blockTitle: '',
        blockDateTime: '',
        content: null,
        timeEnable: false
      }
      this.$store.commit('post/ADD_BLOCK', {
        index: this.$props.blockIndex,
        block: blockObj
      })
      this.$nextTick(() => {
        const editor = this.$store.getters['post/GET_EDITOR_BY_ID'](blockObj.id)
        this.$store.commit('post/FOCUS_EDITOR', editor)
        focusBlock(editor)
      })
    },

    handleDuplicateBlock() {
      const index = this.$props.blockIndex
      const block = this.post.blocks[index]
      const currentBlockCount = this.post.blocks.length

      const newBlock = structuredClone(block)

      newBlock.id = `${Utils.getRandomString()}-${(currentBlockCount + 1).toString()}`
      this.$store.commit('post/ADD_BLOCK', {
        index,
        block: newBlock
      })

      this.$nextTick(() => {
        const editor = this.$store.getters['post/GET_EDITOR_BY_ID'](newBlock.id)
        this.$store.commit('post/FOCUS_EDITOR', editor)
        focusBlock(editor)
      })
    },

    handleDeleteBlock() {
      const index = this.$props.blockIndex

      if (this.post.blocks.length === 1) {
        this.$bvModal.msgBoxOk('文章必須至少含有一個段落，故無法刪除。')
        return
      }
      const title = this.post.blocks[index].blockTitle || '無標題'
      this.$bvModal
        .msgBoxConfirm(`是否刪除段落：${title}？`, {
          title: '刪除段落',
          okVariant: 'danger',
          okTitle: '刪除',
          cancelTitle: '取消',
          cancelVariant: 'outline-primary',
          footerClass: 'modal-footer-confirm',
          centered: true
        })
        .then((value) => {
          if (value) {
            this.$store.commit('post/DELETE_BLOCK', index)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.tools-container {
  display: flex;
  flex-direction: column;

  gap: 10px;
  padding: 6px;

  background-color: $white;
  box-shadow: 0 2px 16px rgb(0 0 0 / 0.08);
  border-radius: 0.5rem;

  button {
    // clear bootstrap style
    border: 0;
    padding: 0;
    line-height: 0;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

.btn-tool {
  background-color: $white;
  padding: 2px;

  &:hover {
    background-color: $gray-2;
  }
}
</style>
