<template>
  <b-navbar ref="navbar" fixed="top" class="navbar--container" type="light" variant="faded">
    <div class="navbar--item item-left">
      <router-link to="/">
        <Logo class="sync-icon" />
      </router-link>
      <div class="dropdown">
        <sync-button variant="nav" class="topic-btn dropdown-btn">探索主題 <icon icon="arrow-down" size="sm" class="arrow-down-icon" /></sync-button>
        <div class="dropdown-content">
          <div class="blank-element" />
          <div class="dropdown-content--list">
            <router-link v-for="(category, index) in categoryList" :key="index" :to="{path:'/', query: { category: category }}">
              {{ category }}
            </router-link>
          </div>

        </div>
      </div>

      <sync-button variant="nav">熱門時事</sync-button>
      <sync-button variant="nav">最新編輯</sync-button>
    </div>

    <div class="navbar--item item-right d-flex align-items-center">
      <form class="search-bar" @submit.prevent="submitSearch">
        <icon icon="news-panel-search" class="search-bar--icon" size="md" />
        <input v-model="keyword" type="search" class="search-bar--input" placeholder="搜尋懶人包文章">
      </form>
      <sync-button to="/login" variant="tertiary" class="login-btn">登入</sync-button>
      <sync-button to="/login" variant="primary" pill class="start-edit-btn">開始編輯</sync-button>

      <b-modal
        v-model="modalShow"
        no-close-on-backdrop
        no-close-on-esc
        hide-header
        hide-footer
        body-class="p-0"
        dialog-class="h-100 w-100"
        content-class="login-modal"
      >
        <transition
          name="fade"
          mode="out-in"
          :duration="200"
        >
          <component :is="modalComponent" />
        </transition>
      </b-modal>
    </div></b-navbar>
</template>

<script>
import firebase from '@/utils/firebase'
import Logo from '@/components/Logo.vue'
import moment from 'moment'

export default {
  name: 'NavBar',
  components: { Logo },

  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: 'login'
    }
  },
  data() {
    return {
      keyword: '',
      categoryList: ['政經', '國際', '社會', '科技', '環境', '生活', '運動']
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
      if (this.modalType === 'login') {
        return () => import('@/components/Account/Login.vue')
      } else {
        return () => import('@/components/Account/SignUp.vue')
      }
    }
  },
  watch: {
    '$route.query'() {
      this.keyword = this.$route.query.q
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
    },
    submitSearch() {
      if (!this.keyword) return
      if (this.keyword === this.$route.query.q) return
      this.$router.push({ path: '/search', query: { q: this.keyword }})
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
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .item-left {
    display: flex;
    justify-content: begin;
    align-items: center;
  }
  .item-right {
    display: flex;
    justify-content: flex-end;
  }

  .sync-icon {
    height: 32px;
  }

  .login-btn {
    margin-left: 4px;
    margin-right: 4px;
  }
  .start-edit-btn {
    margin-left: 4px;
  }

  .topic-btn {
    display: flex;
    align-items: center;
  }
  .arrow-down-icon {
    padding: 0;
    margin-left: 4px;
  }
}

.dropdown {
  position: relative;
}

.dropdown-content {

  display: none;
  position: absolute;

  // style box
  &--list {
    width: 122px;
    background-color: white;
    z-index: 1;
    border-top: 1px solid white;
    border-bottom: 1px solid $gray-2;
    border-left: 1px solid $gray-2;
    border-right: 1px solid $gray-2;
  }

  // hack to retain hover state
  .blank-element {
    height: 11px;
  }

  // list element
  a {
    color: black;
    padding: 8px 16px;
    font-weight: bold;
    text-decoration: none;
    display: block;
    &:hover {
      color: $blue-4;
    }
  }
}

.dropdown:hover .dropdown-content, .dropdown:focus-within , .dropdown-btn:focus + .dropdown-content {
  display: block;
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
  height: 40px;
  position: relative;
  margin-left: 4px;
  margin-right: 4px;

  // input bar
  &--input {
    width: 240px;
    height: 40px;
    border-radius: 20px;
    background-color: $gray-2;
    padding-left: 42px;

    &::placeholder {
      color: $text-3;
      font-size: 14px;
    }
    &:focus-within {
      box-shadow: 0px 0px 0px 4px $gray-4 !important;
    }
  }

  &--icon {
    position: absolute;
    width: 18px !important;
    height: 18px !important;
    left: 13px;
    top: 11px;
  }
}

input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  height: 1em;
  width: 1em;
  border-radius: 50em;
  background: url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg) no-repeat 50% 50%;
  background-size: contain;
  opacity: 0;
  pointer-events: none;
}

input[type="search"]:focus::-webkit-search-cancel-button {
  opacity: .3;
  pointer-events: all;
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

</style>

<style lang="scss">

.btn-wrap {
  white-space: normal !important;
  word-wrap: break-word !important;
}

.login-modal {
  height: 720px;
  width: 960px !important;
  top: calc(50% - 720px / 2);
  left: calc(50% - 960px / 2);
  overflow: hidden;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
  border-radius: 16px !important;
}

</style>
