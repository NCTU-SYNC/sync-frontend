<template>
  <b-modal
    id="citation-modal"
    visible
    centered
    title="新增新聞來源"
    size="lg"
    ok-title="新增"
    cancel-title="取消"
    content-class="custom-modal"
    body-class="custom-modal-body"
    header-class="custom-modal-header"
    footer-class="custom-modal-footer"
    ok-variant="ok"
    cancel-variant="cancel"
    @ok="handleConfirm"
  >
    <b-form-group
      label-cols="auto"
      label="附註內容："
      label-for="citation-superscript"
    >
      <b-form-input id="citation-superscript" v-model="content" class="input-form" placeholder="請輸入或選取附註的內容文字" />
    </b-form-group>

    <b-form-group
      label-cols="auto"
      label="附註標題："
      label-for="citation-title"
    >
      <b-form-input id="citation-title" v-model="title" class="input-form" placeholder="請輸入新聞來源的附註標題" />
    </b-form-group>

    <b-form-group
      label-cols="auto"
      label="來源網址："
      label-for="citation-url"
    >
      <b-form-input id="citation-url" v-model="url" class="input-form" placeholder="請輸入新聞來源的網址" />
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      title: '',
      url: ''
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
      this.$store.dispatch('post/SET_EDITOR_CITATION', data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/post/main.scss';
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
