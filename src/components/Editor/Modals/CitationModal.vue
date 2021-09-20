<template>
  <b-modal
    id="citation-modal"
    v-model="visible"
    centered
    title="編輯附註"
    size="xl"
    ok-title="儲存"
    cancel-title="取消"
    @ok="handleConfirm"
  >
    <div class="edit-add-block-row edit-row">
      <b-row>
        <b-col cols="2" class="ml-3">附註內容：</b-col>
        <b-col><input v-model="content" class="input" type="text" placeholder="請輸入或選取附註的內容文字"></b-col>
      </b-row>
    </div>
    <div class="edit-add-block-row edit-row">
      <b-row>
        <b-col cols="2" class="ml-3">附註標題：</b-col>
        <b-col><input v-model="title" class="input" type="text" placeholder="請輸入參考來源的附註標題"></b-col>
      </b-row>
      <b-row>
        <b-col cols="2" class="ml-3">來源網址：</b-col>
        <b-col><input v-model="url" class="input" type="text" placeholder="請輸入來源網址 URL"></b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      content: '',
      title: '',
      url: '',
      visible: false
    }
  },
  methods: {
    reset() {
      this.content = ''
      this.title = ''
      this.url = ''
      this.visible = false
    },
    show() {
      this.$bvModal.show('citation-modal')
    },
    handleConfirm() {
      const data = {
        content: this.content,
        title: this.title,
        url: this.url
      }
      this.$emit('addCitation', data)
      this.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
// TODO: duplicated with the style in Post.vue, should be moved to component
.edit-add-block-row {
  position: relative;
  margin: 1rem 0;
  width: 100%;
  // height: 40px;
  padding: 10px 0px;
  background: $light;
  color: rgba(0, 0, 0, 0.85);
  border-radius: 0.25rem;
  border: none;
}
.edit-row {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 4px;
    left: 0px;
    top: 0px;
    bottom: 0px;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    background: #c4c4c4;
  }

  &:focus-within {
    &::before {
      content: "";
      position: absolute;
      width: 4px;
      left: 0px;
      top: 0px;
      bottom: 0px;
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
      background: $blue;
    }
    background: $blue-60 !important;
  }
}

.input {
  width: 90%;
  padding: 10px
}
</style>
