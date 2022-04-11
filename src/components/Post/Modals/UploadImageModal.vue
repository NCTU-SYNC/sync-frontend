<template>
  <b-modal
    id="upload-image-modal"
    visible
    centered
    title="插入圖片"
    size="lg"
    ok-title="插入"
    cancel-title="取消"
    content-class="custom-modal custom-modal-tall"
    body-class="custom-modal-body p-0"
    header-class="custom-modal-header header-border-hide"
    footer-class="custom-modal-footer"
    ok-variant="ok"
    cancel-variant="cancel"
    @ok="handleConfirm"
  >
    <b-tabs
      v-model="tabIndex"
      content-class="mt-3 px-4 py-2 flex-grow-1 d-flex flex-column"
      class="h-100 d-flex flex-column"
      nav-class="pl-3"
      active-nav-item-class="active-nav-item-class"
    >
      <b-tab title="使用網址上傳" title-link-class="nav-item-class" active>
        <b-form-group
          label-cols="auto"
          label="圖片網址："
          label-for="url-input"
        >
          <b-form-input id="url-input" v-model="url" class="input-form" placeholder="請貼上圖片網址" />
        </b-form-group>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      tabIndex: 0,
      url: '',
      visible: false
    }
  },
  methods: {
    show() {
      this.$bvModal.show('upload-image-modal')
    },
    dropImage(e) {
      const file = e.dataTransfer.files[0]
      const extension = file.name.substr((file.name.lastIndexOf('.') + 1))
      if (!/(png|jpg|jpeg)$/ig.test(extension)) {
        alert('Invalid file type: ' + extension + '.  Please use png or jpg.')
        return
      }
    },
    handleConfirm() {
      if (this.tabIndex !== 1) {
        const data = {
          url: this.url
        }
        this.$store.commit('post/SET_EDITOR_IMAGE', data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/post/main.scss';

.field {
  background: #F8F8F8;
  border-radius: 4px;
}
.urlInput {
  width: 100%;
}
::v-deep {
  .nav-tabs {
    border-bottom: 1px solid $gray-4;
  }
  .nav-wrapper {
    border-bottom: 2px solid #f8f8f8;
  }
  .nav-item-class {
    padding-left: 0px;
    padding-right: 0px;
    margin-left: 11px;
    margin-right: 11px;
    color: $text-1;
    // font-size: 14px;
    &:hover {
      border-color: transparent;
      margin: default;
    }
  }
  .header-border-hide {
    border-bottom: transparent;
  }
  .active-nav-item-class {
    border: 0px;
    border-bottom: 2px solid $blue !important;
    color: $blue !important;
  }
  .tab-pane {
    flex-grow: 1;
  }
}
</style>
