<template>
  <NavBarLg v-if="lg" :modal-show="modalShow" :modal-type="modalType" @reloadData="reloadData" />
  <NavBarMd v-else :modal-show="modalShow" :modal-type="modalType" @reloadData="reloadData" />
</template>

<script>
import NavBarLg from './NavBarLg'
import NavBarMd from './NavBarMd'
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  components: { NavBarLg, NavBarMd },

  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: 'login'
    }
  },

  computed: {
    ...mapGetters(['windowWidth']),
    lg() {
      return this.windowWidth > 1023
    }
  },

  methods: {
    reloadData() {
      this.$emit('reloadData')
    }
  }
}
</script>
