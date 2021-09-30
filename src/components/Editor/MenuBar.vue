<template>
  <div>
    <div class="menu-bar">
      <template v-for="(item, index) in items">
        <div v-if="item.type === 'divider'" :key="index" class="divider" />
        <menu-item v-else :key="index" v-bind="item" />
      </template>
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
          icon: 'list',
          title: 'Bullet List',
          tooltip: '項目符號清單',
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive('bulletList')
        },
        {
          type: 'divider'
        },
        {
          icon: 'quote',
          title: 'Blockquote',
          tooltip: '引用',
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive('blockquote')
        },
        {
          type: 'divider'
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
  justify-content: flex-start;
  align-items: center;

  height: 2.25rem;

  background-color: $white;
  border-radius: 0.25rem;
}

.divider {
  width: 2px;
  height: 1.25rem;
  background-color: rgba($black, 0.1);
  margin-left: 0.5rem;
  margin-right: 0rem;
}
</style>
