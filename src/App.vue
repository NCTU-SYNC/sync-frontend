<template>
  <div id="app">
    <Navbar />
    <transition
      name="fade"
      mode="out-in"
      :duration="500"
    >
      <router-view />
    </transition>
    <Footer v-if="showFooter" />
  </div>
</template>

<script>
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Navbar, Footer
  },
  computed: {
    ...mapGetters({ showFooter: 'showFooter' })
  },
  watch: {
    '$route': function(newRoute) {
      const routerName = newRoute.name
      const pagesHideFooter = ['SignUp', 'Login', 'Post', 'EditComparison']
      console.log(newRoute, pagesHideFooter.indexOf(routerName) === -1)
      this.$store.commit('SET_FOOTER', pagesHideFooter.indexOf(routerName) === -1)
      console.log('showFooter', this.showFooter)
    }
  },
  mounted() {
    this.$store.dispatch('article/INITIALIZE')
  }
}
</script>
