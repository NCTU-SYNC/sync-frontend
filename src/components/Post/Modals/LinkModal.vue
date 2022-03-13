<template>
  <b-modal
    id="link-modal"
    visible
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
    <b-form ref="link-form" @submit.stop.prevent="handleSubmit">
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
        <b-form-input
          id="url-input"
          v-model="url"
          class="input-form"
          placeholder="請輸入來源網址 URL"
          :state="urlState"
          type="url"
          autocomplete="off"
        />
        <b-form-invalid-feedback :state="urlState">
          請輸入合法的 URL，e.g. https://www.google.com
        </b-form-invalid-feedback>
      </b-form-group>
    </b-form></b-modal>
</template>

<script>
import { Utils } from '@/utils'
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
      url: '',
      urlStartValidation: null
    }
  },
  computed: {
    urlState() {
      return this.urlStartValidation && Utils.isValidUrl(this.url)
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
    checkFormValidity() {
      this.urlStartValidation = true
      return this.urlState
    },
    handleConfirm(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return
      }
      const data = {
        content: this.content,
        url: this.url
      }
      this.$store.commit('post/SET_EDITOR_LINK', data)

      this.$nextTick(() => {
        this.$bvModal.hide('link-modal')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/post/main.scss';

::v-deep .was-validated .form-control:invalid {
  border-color: red;
}
</style>
