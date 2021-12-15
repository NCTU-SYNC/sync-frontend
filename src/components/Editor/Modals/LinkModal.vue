<template>
  <b-modal
    id="link-modal"
    v-model="visible"
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
      <!-- <b-row>
        <b-col cols="2" class="ml-3">顯示文字：</b-col>
        <b-col><input v-model="content" class="input" type="text" placeholder="請輸入或選取連結顯示的文字"></b-col>
      </b-row>
      <b-row>
        <b-col cols="2" class="ml-3">來源網址：</b-col>
        <b-col><input v-model="url" class="input" type="text" placeholder="請輸入來源網址 URL"></b-col>
      </b-row>
    </div> -->
      <b-form-group
        label-cols="auto"
        label="顯示文字："
        label-for="link-text"
      >
        <b-form-input id="link-text" v-model="content" class="input-form" placeholder="請輸入或選取連結顯示的文字" />
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
  },
  data() {
    return {
      content: '',
      url: '',
      visible: false
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
      this.$emit('addLink', data)
      this.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/post/main.scss';

</style>
