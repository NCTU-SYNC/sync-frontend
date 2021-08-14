<template>
  <b-modal id="citation-modal" title="編輯附註" @ok="handleConfirm">
    <div><input v-model="content" type="text" placeholder="請輸入或選取附註的內容文字"></div>
    <div><input v-model="title" type="text" placeholder="請輸入參考來源的附註標題"></div>
    <div><input v-model="url" type="text" placeholder="請輸入來源網址 URL"></div>
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
      url: ''
    }
  },
  mounted() {
  },
  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
