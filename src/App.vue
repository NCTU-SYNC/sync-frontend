<template>
  <div id="app">
    <transition
      name="fade"
      mode="out-in"
      :duration="300"
    >
      <NavBarPost v-if="isPost" @reloadData="reloadData" />
      <NavBar v-else @reloadData="reloadData" />
    </transition>

    <div id="wrapper">
      <transition
        name="fade"
        mode="out-in"
        :duration="500"
      >
        <router-view ref="router-view" />
      </transition>
    </div>
    <Footer v-if="showFooter" />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue'
import NavBarPost from '@/components/Post/NavBarPost.vue'
import Footer from '@/components/Footer.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar, Footer, NavBarPost
  },
  computed: {
    ...mapGetters({ showFooter: 'showFooter' }),
    isPost() {
      return this.$route.path.includes('post')
    }
  },
  watch: {
    '$route': function(newRoute) {
      const routerName = newRoute.name
      const pagesHideFooter = ['SignUp', 'Login', 'Post', 'EditComparison', 'Article']
      if (newRoute.path.includes('post')) {
        this.$store.commit('SET_FOOTER', false)
        return
      }
      this.$store.commit('SET_FOOTER', pagesHideFooter.indexOf(routerName) === -1)
    }
  },
  mounted() {
    this.getInitializeInfo()
  },
  methods: {
    async getInitializeInfo() {
      if (!this.$store.getters.isInitialized) {
        setTimeout(() => {
          this.getInitializeInfo()
        }, 100)
        return
      }
      const { notifications } = await this.$store.dispatch('article/INITIALIZE')
      if (notifications) {
        this.$store.commit('user/SET_NOTIFICATIONS', notifications.reverse())
      }
    },
    reloadData() {
      if (this.$refs['router-view']) {
        this.$refs['router-view'].$emit('reloadData')
      }
    }
  }
}
</script>
