<template>
  <div class="input-tag" :class="{ 'input-tag-new': newTag }">
    <template v-if="!newTag">
      <span ref="tag-content" contenteditable @keydown.enter.prevent="handleEnter" @blur="handleBlur">{{ post.postTags[tagIndex] }}</span>
      <b-button variant="link" class="remove-tag" @click="handleRemoveClk"><b-icon icon="x" /></b-button>
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
  background-color: $gray-1;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  font-size: 14px;
  line-height: 24px;
  width: fit-content;

  border-radius: 1rem;
  padding: 4px 10px 4px 22px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;

  input {
    font-size: inherit;
    line-height: inherit;
  }

  span {
    margin-left: 4px;
    caret-color: $blue;
    word-break: keep-all;
  }
  &:focus-within {
    border: 1px solid $blue;

    &::before {
      color: $blue-4;
    }
  }
  .remove-tag {
    display: none;
  }

  &:hover, &:focus-within {
    .remove-tag {
      display: inline-block;
      padding: 0;
      color: $nature-8;
      height: 24px;
      &:hover {
        color: black;
      }
    }
  }

  &::before {
    position: relative;
    content: '#';
    font-size: 14px;
    line-height: 24px;
    margin-left: -10px;
  }
  &-new {
    color: $text-3;
    &:focus-within, &:active {
      color: $text-1;
    }
    input {
      margin-left: 4px;
      background: transparent;
      padding: 0;
      height: 24px;

      &::placeholder {
        color: $text-3;
      }
    }
  }
}
</style>
