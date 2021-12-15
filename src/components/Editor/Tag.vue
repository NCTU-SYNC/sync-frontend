<template>
  <div class="input-tag" :class="{ 'input-tag-new': newTag }">
    <template v-if="!newTag">
      <span ref="tag-content" contenteditable @keydown.enter.prevent="handleEnter" @blur="handleBlur">{{ post.postTags[tagIndex] }}</span>
      <b-button variant="link" class="remove-tag" @click="handleRemoveClk"><b-icon icon="x" font-scale="1.5" /></b-button>
    </template>
    <template v-else>
      <b-form-input v-model="addTagText" placeholder="新增關鍵字" @keyup.enter="submitTag" @blur="submitTag" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Tag',
  props: {
    tagIndex: {
      type: Number,
      default: 0
    },
    newTag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      notBlur: false,
      addTagText: ''
    }
  },
  computed: {
    ...mapGetters({ post: 'post' })
  },
  updated() {
    if (!this.newTag) { this.$refs['tag-content'].textContent = this.post.postTags[this.tagIndex] }
  },
  methods: {
    handleEnter(event) {
      this.notBlur = true
      event.target.blur()
      const tagContent = event.target.textContent
      this.editTag(tagContent)
      this.notBlur = false
    },
    handleBlur(event) {
      if (!this.notBlur) {
        const tagContent = event.target.textContent
        this.editTag(tagContent)
      }
    },
    handleRemoveClk(event) {
      this.notBlur = true
      event.currentTarget.blur()
      this.notBlur = false
      this.removeTag()
    },
    editTag(tagContent) {
      if (tagContent !== '' && tagContent !== this.post.postTags[this.tagIndex]) {
        this.$store.commit('post/EDIT_TAG', { index: this.tagIndex, newTag: tagContent })
      }
      if (tagContent.length === 0) {
        this.removeTag()
      }
    },
    removeTag() {
      this.$store.commit('post/REMOVE_TAG', this.tagIndex)
    },
    submitTag() {
      if (this.addTagText === '') return
      this.$store.commit('post/PUSH_TAG', this.addTagText)
      this.addTagText = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.input-tag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    margin-left: 4px;
    caret-color: $blue;
    word-break: keep-all;
  }
  &:focus-within {
    border: 1px solid $blue;
  }
  .remove-tag {
    display: none;
  }
  &:hover, &:focus-within {
    .remove-tag {
      display: inline-block;
      padding-left: 0;
      padding-right: 0;
      color: $nature-8;
      &:hover {
        color: black;
      }
    }
  }
  margin-right: 0.5rem;
  padding: 0 1rem 0 1.5rem;
  height: 36px;
  background: $white;
  border-radius: 1.5rem;
  margin-bottom: 0.5rem;
  &::before {
    position: relative;
    content: '#';
    font-size: 16px;
    margin-left: -10px;
  }
  &-new {
    color: $text-4;
    &:focus-within, &:active {
      color: $text-1;
    }
    input {
      margin-left: 4px;
      background: transparent;
      padding: 0;
      max-width: 5.2rem;
      height: 32px;
      &::placeholder {
        color: $text-4;
      }
    }
  }
}
</style>
