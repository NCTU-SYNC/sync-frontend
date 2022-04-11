<template>
  <component :is="modalComponent" :context="context" />
</template>

<script>
import UploadImageModal from './Modals/UploadImageModal.vue'
import CitationModal from './Modals/CitationModal.vue'
import LinkModal from './Modals/LinkModal.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'EditToolModal',
  data() {
    return {
      modalComponent: null,
      componentMap: new Map(
        [
          ['LINK', LinkModal],
          ['UPLOAD_IMAGE', UploadImageModal],
          ['CITATION', CitationModal],
          [null, null]
        ]
      )
    }
  },
  computed: {
    ...mapGetters({ post: 'post' }),
    componentString() {
      return this.post.modalComponent
    },
    context() {
      return this.post.modalContext
    }
  },
  watch: {
    componentString(newComponentString, oldComponentString) {
      this.modalComponent = this.componentMap.get(newComponentString)
    }
  },
  created() {
    this.$root.$on('bv::modal::hidden', () => {
      this.$store.commit('post/SET_MODAL_COMPONENT', { COMPONENT_STRING: null })
    })
  },
  destroyed() {
    this.$root.$off('bv::modal::hidden')
  }
}
</script>

<style scoped lang="scss">

</style>
