<template>
  <b-navbar class="header-navbar" toggleable="lg" type="light" variant="faded">
    <b-button v-b-toggle.sidebar class="px-0 px-md-2" title="目錄" variant="transparent">
      <b-icon icon="list" scale="1.5" aria-hidden="true" />
    </b-button>
    <b-navbar-brand id="brand" to="/" class="centered-block">SYNC</b-navbar-brand>
    <b-collapse id="nav-collapse" is-nav>
      <b-nav-form class="mx-2">
        <b-form-input size="md" class="mr-sm-2 rounded-pill form-control" placeholder="搜尋" type="search" />
        <b-button class="border-0 rounded-pill ml-n5 p-2" type="submit" variant="transparent">
          <b-icon icon="search" aria-hidden="true" />
        </b-button>
      </b-nav-form>

      <b-navbar-toggle target="nav-collapse" />
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto d-flex align-items-center">
        <b-nav-item v-show="!getLoginStatus" :to="{ name: 'SignUp', query: getRedirectPath }">註冊</b-nav-item>
        <b-nav-item v-show="!getLoginStatus" :to="{ name: 'Login', query: getRedirectPath}">登入</b-nav-item>
        <b-nav-item-dropdown v-show="getLoginStatus" no-caret right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <span>
              <img class="avatar-user" height="48" width="48" :src="getPhotoURL">
            </span>
          </template>
          <b-dropdown-item to="/profile">個人頁面</b-dropdown-item>
          <b-dropdown-item href="#" @click="handleLogout">登出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-nav class="ml-auto d-block d-lg-none">
      <b-nav-item v-if="getLoginStatus" to="profile">
        <img class="avatar-user" :src="getPhotoURL">
      </b-nav-item>
      <b-nav-item
        v-else
        to="login"
      >
        <b-iconstack font-scale="2.5">
          <b-icon stacked icon="person-fill" scale="0.6" variant="secondary" />
          <b-icon stacked icon="circle" variant="secondary" />
        </b-iconstack>
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import firebase from '@/utils/firebase'

export default {
  name: 'NavBar',
  computed: {
    getRedirectPath() {
      // 設置重新導向，若在首頁、註冊、登入頁面做切換不需設置redirect，其他頁面則需要重新導向，若已經設置重新導向頁面，則註冊、登入切換時，並不會互相把自己的頁面給放進重新導向內
      const disableRedirectPaths = ['/', '/signup', '/login']
      return disableRedirectPaths.some(disableRedirectPath => this.$route.path === disableRedirectPath) ? (this.$route.query.redirect === undefined ? null : { redirect: this.$route.query.redirect }) : { redirect: this.$route.path }
    },
    getPhotoURL() {
      return this.$store.getters.photoURL
    },
    getLoginStatus() {
      return this.$store.getters.isLogin
    }
  },
  methods: {
    handleLogout() {
      firebase.handleLogout()
    }
  }
}
</script>

<style scoped lang="scss">
.header-navbar {
  margin: 1rem
}

.centered-block {
    left: 50%;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    position: absolute;
}

.avatar-user {
    -webkit-background-size: 32px 32px;
    background-size: 32px 32px;
    border: 0;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    display: block;
    margin: 0;
    position: relative;
    height: 36px;
    width: 36px;
    z-index: 0;
}
</style>
