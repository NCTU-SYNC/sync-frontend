<template>
  <b-modal
    id="citation-modal"
    :visible="true"
    centered
    :title="modalTitle"
    size="lg"
    :ok-title="okTitle"
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
        :style="titleStyle"
        placeholder="請輸入新聞來源的附註標題"
      />
    </b-form-group>

    <b-form-group label-cols="auto" label="來源網址：" label-for="citation-url">
      <b-form-input
        id="citation-url"
        v-model="url"
        class="input-form"
        :style="urlStyle"
        placeholder="請輸入新聞來源的網址"
      />
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    let citation = {}
    if (!this.context.citation) {
      citation = { title: '', url: '', index: -1 }
    } else {
      citation = { ...this.context.citation.info }
    }

    return { ...citation, titleValid: true, urlValid: true }
  },
  computed: {
    modalTitle() {
      return (this.index === -1 ? '新增' : '修改') + '新聞來源'
    },
    okTitle() {
      return this.index === -1 ? '新增' : '確認'
    },
    titleStyle() {
      return this.titleValid ? '' : 'border-color: #FF601C !important'
    },
    urlStyle() {
      return this.urlValid ? '' : 'border-color: #FF601C !important'
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
    close() {
      this.$bvModal.hide('citation-modal')
    },
    handleConfirm(evt) {
      evt.preventDefault()

      if (this.title.length === 0) this.titleValid = false
      else this.titleValid = true

      try {
        new URL(this.url)
        this.urlValid = true
      } catch (error) {
        this.urlValid = false
      }

      if (!this.titleValid || !this.urlValid) return

      const data = {
        title: this.title,
        url: this.url
      }

      if (this.context.index === -1) {
        this.$store.dispatch('post/ADD_EDITOR_CITATION', data)
      } else {
        this.$store.dispatch('post/UPDATE_EDITOR_CITATION', {
          citation: this.context.citation,
          title: this.title,
          url: this.url
        })
      }

      this.$nextTick(() => this.close())
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
