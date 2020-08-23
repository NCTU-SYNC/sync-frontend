<template>
  <div id="app">
    <b-sidebar
      id="sidebar"
      title="SYNC"
      backdrop-variant="dark"
      backdrop
      shadow
    >
      <div class="p-3">
        <b-nav vertical>
          <b-nav-item
            to="/post"
            :prefetch="true"
          >
            建立新聞
          </b-nav-item>
        </b-nav>
      </div>
    </b-sidebar>
    <Navbar />
    <transition
      name="fade"
      mode="out-in"
      :duration="500"
    >
      <Nuxt />
    </transition>
  </div>
</template>

<script>
import Navbar from '@/components/NavBar.vue'

export default {
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
