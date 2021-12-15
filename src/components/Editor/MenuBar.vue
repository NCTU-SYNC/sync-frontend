<template>
  <div>
    <div class="menu-bar">
      <div class="text-options">
        <div v-for="item, index in items" :key="index" v-bind="item">
          <div v-if="item.icon==='divider'" class="divider" />
          <menu-item v-else v-bind="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'

export default {
  components: {
    MenuItem
  },

  props: {
    editor: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      items: [
        {
          icon: 'bold',
          title: 'Bold',
          tooltip: '粗體',
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive('bold')
        },
        {
          icon: 'underline',
          title: 'Underline',
          tooltip: '底線',
          action: () => this.editor.chain().focus().toggleUnderline().run(),
          isActive: () => this.editor.isActive('underline')
        },
        {
          icon: 'quote',
          title: 'Blockquote',
          tooltip: '引用',
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive('blockquote')
        },
        {
          icon: 'list',
          title: 'Bullet List',
          tooltip: '項目符號清單',
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive('bulletList')
        },
        {
          icon: 'divider'
        },
        {
          icon: 'annotation',
          title: 'Annotation',
          tooltip: '編輯附註',
          action: () => {
            this.$emit('showModal', 'citation-modal')
          },
          isActive: () => this.editor.isActive('annotation')
        },
        {
          icon: 'link',
          title: 'Link',
          tooltip: '超連結',
          action: () => {
            this.$emit('showModal', 'link-modal')
          },
          isActive: () => this.editor.isActive('link')
        },
        {
          icon: 'image',
          title: 'Image',
          tooltip: '圖片',
          action: () => {
            this.$emit('showModal', 'upload-image-modal')
          },
          isActive: () => this.editor.isActive('image')
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-bar {
  display: flex;
  align-items: center;
  max-width: 289px;
  height: 36px;
  background-color: $white;
  border-radius: 0.25rem;

  .text-options {
    flex-grow: 4;
    display: flex;
    justify-content: space-evenly;
    .divider::after {
      content: '';
      display: inline-block;
      vertical-align: middle;
      line-height: normal;
      height: 24px;
      border-right: 1px solid $gray-4;
    }
  }
}

</style>
