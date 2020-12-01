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
        <nav class="mb-3">
          <b-nav vertical>
            <b-nav-item>
              <b-link :to="`/test`">
                測試Tiptap用
              </b-link>
            </b-nav-item>
            <b-nav-item>
              <b-link :to="`/Post`">
                建立新聞
              </b-link>
            </b-nav-item>
            <b-nav-item>
              <b-link :to="`/NewsPanel`">
                測試新聞
              </b-link>
            </b-nav-item>
            <b-nav-item>
              <b-link :to="`/OldArticle`">
                舊版內頁
              </b-link>
            </b-nav-item>
          </b-nav>
        </nav>
      </div>
    </b-sidebar>
    <Navbar />
    <transition
      name="fade"
      mode="out-in"
      :duration="500"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
import Navbar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
