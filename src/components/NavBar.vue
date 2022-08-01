<template>
  <b-navbar ref="navbar" fixed="top" class="header-navbar" type="light" variant="faded">
    <b-button class="px-0 px-md-2" variant="transparent" to="/post">
      <icon icon="edit" />
    </b-button>
    <b-navbar-brand id="brand" to="/" class="centered-block"><Logo /></b-navbar-brand>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto d-none d-md-flex align-items-center h-100">
      <b-nav-item :to="{ name: 'Search', query: getRedirectPath }"><icon icon="search" /></b-nav-item>

      <b-nav-item-dropdown
        size="lg"
        variant="link"
        toggle-class="text-decoration-none"
        no-caret
        no-flip
        right
        menu-class="p-0"
      >
        <template v-slot:button-content>
          <icon icon="notification" />
        </template>
        <div class="notification-container">
          <h3>通知</h3>
          <slot v-for="(notification, notificationIndex) in notifications">
            <b-dropdown-item-button
              v-if="notification.type = 'update'"
              button-class="btn-wrap"
              @click="routeToArticle(notification.articleId)"
            >{{ notification.title || notification.articleId }} 文章有更新唷！
              <p class="text-secondary m-0">{{ getDateString(notification.lastUpdatedAt) }}</p></b-dropdown-item-button>
            <b-dropdown-divider v-if="notificationIndex < notifications.length - 1" />
          </slot>

        </div>

      </b-nav-item-dropdown>
      <b-nav-item v-show="!getLoginStatus" @click="modalShow = true; isModalLogin = false">註冊</b-nav-item>
      <b-nav-item v-show="!getLoginStatus" @click="modalShow = true; isModalLogin = true">登入</b-nav-item>
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
    <b-navbar-nav class="ml-auto d-flex d-md-none align-items-center">
      <b-nav-item :to="{ name: 'Search', query: getRedirectPath }"><icon icon="search" /></b-nav-item>
      <b-button variant="link"><icon icon="notification" /></b-button>
      <b-nav-item v-if="getLoginStatus" to="/profile">
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

    <b-modal
      v-model="modalShow"
      hide-header
      hide-footer
      body-class="p-0"
      dialog-class="h-100 w-100"
      content-class="login-modal"
    > <component
      :is="modalComponent"
      @showLogin="isModalLogin=true"
      @showSignUp="isModalLogin=false"
    />
    </b-modal>
  </b-navbar>
</template>

<script>
import firebase from '@/utils/firebase'
import Logo from '@/components/Logo.vue'
import moment from 'moment'

export default {
  name: 'NavBar',
  components: { Logo },
  data: function() {
    return {
      modalShow: false,
      isModalLogin: true
    }
  },
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
    },
    notifications() {
      return this.$store.getters.notifications
    },
    modalComponent() {
      if (this.isModalLogin) {
        return () => import('@/components/Account/Login.vue')
      } else {
        return () => import('@/components/Account/SignUp.vue')
      }
    }
  },
  methods: {
    routeToArticle(articleId) {
      if (this.$route.params.ArticleID === articleId) {
        this.$emit('reloadData')
      } else {
        this.$router.push(`/article/${articleId}`)
      }
    },
    handleLogout() {
      firebase.handleLogout()
      this.$store.commit('article/RESET')
    },
    getDateString(timeStamp) {
      if (timeStamp._seconds) {
        return moment(timeStamp._seconds * 1000).format('YYYY/MM/DD HH:mm')
      }
      return moment(timeStamp).format('YYYY/MM/DD HH:mm')
    }
  }
}
</script>

<style lang="scss">

.login-modal {
  height: 720px;
  width: 960px !important;
  top: calc(50% - 720px / 2);
  left: calc(50% - 960px / 2);
  overflow: hidden;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
  border-radius: 16px !important;
}

.header-navbar {
  height: 4rem;
  background-color: $white;
  border-bottom: 1px solid $gray-light;
  display: flex;
  align-items: center;
  width: 100%;
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

.notification-container {
  padding: 1rem;
  width: 20rem;
  max-height: calc(100vh - 4rem);
  overflow-x: hidden;
  overflow-y: scroll;
}

</style>

<style lang="scss">
.btn-wrap {
  white-space: normal !important;
  word-wrap: break-word !important;
}
</style>
