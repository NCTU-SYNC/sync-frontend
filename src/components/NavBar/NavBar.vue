<template>
  <NavBarLg v-if="lg" @reloadData="reloadData" />
  <NavBarMd v-else @reloadData="reloadData" />
</template>

<script>
import NavBarLg from './NavBarLg'
import NavBarMd from './NavBarMd'
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  components: { NavBarLg, NavBarMd },

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
