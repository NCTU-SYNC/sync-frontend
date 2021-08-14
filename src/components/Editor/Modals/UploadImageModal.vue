<template>
  <b-modal id="upload-image-modal" title="BootstrapVue">
    <b-navbar toggleable="sm">
      <b-navbar-nav>
        <b-nav-item href="#" @click="toggleFile">By File</b-nav-item>
        <b-nav-item href="#" @click="toggleLink">By Link</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <div v-if="isFile" class="field" @drop.prevent="dropImage" @dragenter.prevent @dragover.prevent>drag and drop here</div>
    <div v-else><input v-model="url" type="text" placeholder="enter url"></div>
  </b-modal>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      isFile: true,
      url: ''
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
    toggleFile() {
      this.isFile = true
    },
    toggleLink() {
      this.isFile = false
    }
  }
}
</script>

<style lang="scss" scoped>
.field {
  height: 300px;
  width: 400px;
  background: #F8F8F8;
  border-radius: 4px;
}
</style>
