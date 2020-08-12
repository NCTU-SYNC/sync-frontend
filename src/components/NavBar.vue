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
        <b-nav-item v-show="!isLogin" to="signup">註冊</b-nav-item>
        <b-nav-item v-show="!isLogin" to="login">登入</b-nav-item>
        <b-nav-item-dropdown v-show="isLogin" no-caret right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <b-iconstack font-scale="2.5">
              <b-icon stacked icon="person-fill" scale="0.6" />
              <b-icon stacked icon="circle" />
            </b-iconstack>
          </template>
          <b-dropdown-item to="profile">個人頁面</b-dropdown-item>
          <b-dropdown-item href="#" disabled>登出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
    <b-nav-item
      class="ml-auto d-flex align-items-center d-block d-lg-none"
      :to="isLogin? 'profile': 'login'"
    >
      <span v-if="isLogin">
        <img class="rounded-1 avatar-user" height="32" width="32" alt="@AccountID" :src="$store.getters.photoURL">
      </span>
      <b-iconstack v-else font-scale="2.5">
        <b-icon stacked icon="person-fill" scale="0.6" variant="secondary" />
        <b-icon stacked icon="circle" variant="secondary" />
      </b-iconstack>
    </b-nav-item>
  </b-navbar>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {

    }
  },
  computed: {
    isLogin: {
      get() {
        return this.$store.getters.isLogin
      },
      set(name) {
        return name
      }
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
