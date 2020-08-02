<template>
  <div id="app">
    <b-sidebar
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
    <b-navbar class="header-navbar" toggleable="lg" type="light" variant="faded">
      <b-navbar-brand id="brand" to="/">SYNC</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <b-link :to="`/test`">
              測試Tiptap用
            </b-link>
          </b-nav-item>
          <b-nav-item>
            <b-link :to="`/post`">
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
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search" />
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="submit"
            >Search</b-button>
          </b-nav-form>
          <Auth />
          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to="signup">註冊</b-nav-item>
          <b-nav-item to="login">登入</b-nav-item>
          <b-nav-item to="profile">個人頁面</b-nav-item>
          <b-nav-item-dropdown right>

            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              選項
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
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
import Auth from './components/auth'

export default {
  name: 'App',
  components: {
    Auth
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/styles.scss";

.header-navbar {
  margin: 2em
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
