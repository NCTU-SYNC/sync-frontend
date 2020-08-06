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
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-show="!isLogin" to="signup">註冊</b-nav-item>
        <b-nav-item v-show="!isLogin" to="login">登入</b-nav-item>
        <b-nav-item v-show="isLogin" to="profile">個人頁面</b-nav-item>
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
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      isLogin: false
    }
  },
  created() {
    console.log('NavBar loaded')
    this.isLogin = this.$firebaseAuth.isLogin
    // TO DO: Fix asynchronous behavior when isLogin state change (invoke order issue)
  }
}
</script>

<style scoped lang="scss">
.header-navbar {
  margin: 2rem
}

.centered-block {
    left: 50%;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    position: absolute;
}
</style>
