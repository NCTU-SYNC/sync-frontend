<template>
  <b-modal
    id="link-modal"
    :visible="true"
    centered
    title="新增連結"
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
    <div class="">
      <b-form-group
        label-cols="auto"
        label="顯示文字："
        label-for="link-text"
      >
        <b-form-input id="link-text" v-model="content" autofocus class="input-form" placeholder="請輸入或選取連結顯示的文字" />
      </b-form-group>

      <b-form-group
        label-cols="auto"
        label="來源網址："
        label-for="url-input"
      >
        <b-form-input id="url-input" v-model="url" class="input-form" placeholder="請輸入來源網址 URL" />
      </b-form-group>
    </div></b-modal>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      content: '',
      url: ''
    }
  },
  created() {
    if ('content' in this.context) {
      this.content = this.context['content']
    }
    if ('url' in this.context) {
      this.url = this.context['url']
    }
  },
  methods: {
    reset() {
      this.content = ''
      this.url = ''
    },
    show() {
      this.$bvModal.show('link-modal')
    },
    handleConfirm() {
      const data = {
        content: this.content,
        url: this.url
      }
      this.$store.commit('post/SET_EDITOR_LINK', data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/post/main.scss';

</style>
