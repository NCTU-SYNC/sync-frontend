<template>
  <b-modal
    id="citation-modal"
    v-model="visible"
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
      label="附註標題："
      label-for="citation-title"
    >
      <b-form-input
        id="citation-title"
        v-model="title"
        class="input-form"
        placeholder="請輸入新聞來源的附註標題"
      />
    </b-form-group>

    <b-form-group label-cols="auto" label="來源網址：" label-for="citation-url">
      <b-form-input
        id="citation-url"
        v-model="url"
        class="input-form"
        placeholder="請輸入新聞來源的網址"
      />
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      title: '',
      url: '',
      visible: false
    }
  },
  methods: {
    reset() {
      this.title = ''
      this.url = ''
      this.visible = false
    },
    show() {
      this.$bvModal.show('citation-modal')
    },
    handleConfirm() {
      const data = {
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
    content: '';
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
      content: '';
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
  padding: 10px;
}
</style>
