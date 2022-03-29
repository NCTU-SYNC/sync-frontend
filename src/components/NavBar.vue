<template>
  <b-navbar ref="navbar" fixed="top" class="navbar--container" type="light" variant="faded">
    <b-navbar-nav class="navbar--item item-left">
      <b-nav-item class="post px-0" to="/post">
        <icon icon="edit" />
      </b-nav-item>
    </b-navbar-nav>
    <b-navbar-brand id="brand" to="/" class="navbar--item item-center"><Logo /></b-navbar-brand>

    <!-- Show when screen width is larger than md -->
    <b-navbar-nav class="navbar--item item-right d-none d-md-flex align-items-center h-100">
      <div class="search-bar">
        <b-button variant="link" class="search-bar--submit"><icon icon="search" /></b-button>
        <b-form-input
          id="search-bar--inputid"
          class="search-bar--input"
          placeholder="搜尋文章"
          type="search"
        />
      </div>

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
    <!-- Show when screen width is smaller than md -->
    <b-navbar-nav class="navbar--item item-right d-flex d-md-none align-items-center">
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
  </b-navbar>
</template>

<script>
import firebase from '@/utils/firebase'
import Logo from '@/components/Logo.vue'
import moment from 'moment'

export default {
  name: 'NavBar',
  components: { Logo },
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

<style scoped lang="scss">
.navbar {
  &--container {
    height: 4rem;
    background-color: $white;
    border-bottom: 1px solid $gray-light;
    display: flex;
    align-items: center;
    width: 100%;
  }

  &--item {
    flex: 1;
  }
  .item-left {
    display: flex;
    justify-content: begin;
  }
  .item-right {
    display: flex;
    justify-content: end;
  }
  .item-center {
      margin: 0 !important;
      // background: lime;
      display: flex;
      justify-content: center;
  }
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

.search-bar {
  --size: 40px;

  height: 40px;
  width: var(--size);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: width 300ms cubic-bezier(0.18, 0.89, 0.32, 1.28);

  &--input {
    height: 40px;
    opacity: 0;
    cursor: pointer;
    position: absolute;
    &:active, &:focus {
      border: 1px solid $blue !important;
    }
    &::placeholder{
      color: $text-4;
    }
  }

  &--submit {
    padding: 0;
    margin-right: auto;
  }

  &:focus-within {
    width: 400px;

    .search-bar--input {
      border: 1px solid $gray-4 !important;
      border-radius: 4px;
      opacity: 1;
      cursor: initial;
      transition: opacity 150ms ease-in-out;
      width: calc(100% - var(--size));
    }

  }
}
</style>

<style lang="scss">
.btn-wrap {
  white-space: normal !important;
  word-wrap: break-word !important;
}
</style>
