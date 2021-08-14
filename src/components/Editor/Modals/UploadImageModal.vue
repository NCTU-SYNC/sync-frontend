<template>
  <div>
    <b-modal id="upload-image-modal" title="BootstrapVue">
      <p class="my-4">Hello from modal!</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
  },
  methods: {
    show() {
      this.$bvModal.show('upload-image-modal')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
