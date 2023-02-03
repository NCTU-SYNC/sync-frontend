<template>
  <b-navbar ref="navbar" fixed="top" class="navbar--container" type="light" variant="faded">
    <div class="item-left">
      <sync-icon v-b-toggle.nav-sidebar icon="hamburger" />
      <sync-icon v-if="sm" icon="sync-logo" />
    </div>
    <b-sidebar id="nav-sidebar" :width="sm ? '100%' : '360px'" :right="sm" :no-slide="sm">
      <template #header-close>
        <b-icon icon="x" font-scale="1.25" />
      </template>
      <div class="nav-sidebar">
        <form class="search-bar" @submit.prevent="submitSearch">
          <SyncIcon icon="news-panel-search" class="search-bar--icon" size="md" />
          <input v-model="keyword" type="search" class="search-bar--input" placeholder="搜尋懶人包文章">
        </form>

        <sync-button v-b-toggle.accordion variant="nav" class="topic-btn dropdown-btn">
          探索主題 <SyncIcon icon="arrow-down" size="sm" class="arrow-down-icon" />
        </sync-button>
        <b-collapse id="accordion" visible>
          <div class="dropdown-content">
            <router-link v-for="(category, index) in categoryList" :key="index" :to="{path:'/', query: { category: category }}">
              {{ category }}
            </router-link>
          </div>
        </b-collapse>
        <sync-button variant="nav" class="topic-btn">熱門時事</sync-button>
        <sync-button variant="nav" class="topic-btn">最新編輯</sync-button>
      </div>
    </b-sidebar>

    <router-link v-if="!sm" to="/">
      <Logo class="sync-icon" />
    </router-link>

    <div class="navbar--item item-right">
      <template v-if="!isLogin">
        <sync-button to="/login" variant="nav" class="login-btn">登入</sync-button>
      </template>
      <template v-else-if="sm">
        <button v-b-toggle.nav-user-sidebar class="avatar-user--btn">
          <img class="avatar-user--img" height="48" width="48" :src="photoURL">
        </button>
        <b-sidebar id="nav-user-sidebar" no-slide right width="100%">
          <template #header-close>
            <b-icon icon="x" font-scale="1.25" />
          </template>
          <div class="nav-sidebar">
            <router-link class="dropdown-user--profile" :to="{path: '/profile', query: {tab: 'settings'}}" tabindex="0" @click.native="handleClickDropdownItem">
              <img class="profile-avatar" height="48" width="48" :src="photoURL">
              <div class="profile-detail">
                <div class="display-name">{{ displayName }}</div>
                <div class="display-email">{{ email }}</div>
              </div>
            </router-link>
            <div v-b-toggle.nav-notification-sidebar class="dropdown-user--link" tabindex="0">
              通知
            </div>
            <router-link to="/post" class="dropdown-user--link" tabindex="0">
              編輯新文章
            </router-link>
            <router-link :to="{path: '/profile', query: {tab: 'browsing_history'}}" class="dropdown-user--link" tabindex="0" @click.native="handleClickDropdownItem">
              瀏覽紀錄
            </router-link>
            <router-link :to="{path: '/profile', query: {tab: 'edited_articles'}}" class="dropdown-user--link" tabindex="0" @click.native="handleClickDropdownItem">
              編輯過的文章
            </router-link>
            <router-link :to="{path: '/profile', query: {tab: 'bookmarks'}}" class="dropdown-user--link" tabindex="0" @click.native="handleClickDropdownItem">
              收藏的文章
            </router-link>
            <router-link :to="{path: '/profile', query: {tab: 'settings'}}" class="dropdown-user--link" tabindex="0" @click.native="handleClickDropdownItem">
              個人設定
            </router-link>
            <router-link to="/" class="dropdown-user--link" tabindex="0" @click.native="handleLogout">
              登出
            </router-link>
          </div>
          <b-sidebar id="nav-notification-sidebar" width="100%" right>
            <template #header="{ hide }">
              <div class="nav-sidebar__header">
                <button class="border-0 bg-transparent" @click="hide">
                  <b-icon-chevron-left />
                </button>
                <span style="color: black">通知</span>
              </div>
            </template>
            <template v-if="notifications.length === 0">
              <div class="d-flex flex-column">
                <div class="mx-auto">
                  目前沒有新的通知
                </div>
              </div>
            </template>
            <div class="nav-sidebar">
              <router-link v-for="(notification, index) in notifications" :key="index" class="notification-dropdown--slot" :to="`/article/${notification.articleId}`" @click.native="handleClickDropdownItem">
                <div>
                  <SyncIcon icon="avatar" size="md" class-name="avatar-icon" />
                </div>
                <div class="notification-dropdown--text">
                  <div class="description">
                    您發表的 “{{ notification.title }}” 有新的更新
                  </div>
                  <div class="notification-dropdown--date">
                    {{ parseTime(notification.lastUpdatedAt) }}
                  </div>
                </div>

              </router-link>
            </div>
          </b-sidebar>
        </b-sidebar>
      </template>
      <template v-else>
        <div class="notification-dropdown">
          <button class="icon-button notification--btn" @click="safariBtnFocusTweak">
            <SyncIcon icon="notification" class="notification--icon" />
          </button>
          <div class="notification-dropdown--content" :class="{'no-notification': notifications.length === 0}">
            <template v-if="notifications.length === 0">
              目前沒有新的通知
            </template>
            <router-link v-for="(notification, index) in notifications" :key="index" class="notification-dropdown--slot" :to="`/article/${notification.articleId}`" @click.native="handleClickDropdownItem">
              <div>
                <SyncIcon icon="avatar" size="md" class-name="avatar-icon" />
              </div>
              <div class="notification-dropdown--text">
                <div class="description">
                  您發表的 “{{ notification.title }}” 有新的更新
                </div>
                <div class="notification-dropdown--date">
                  {{ parseTime(notification.lastUpdatedAt) }}
                </div>
              </div>

            </router-link>
          </div>
        </div>
        <!-- post page -->
        <div class="dropdown-user">
          <button class="avatar-user--btn" @click="safariBtnFocusTweak">
            <img class="avatar-user--img" height="48" width="48" :src="photoURL">
          </button>
          <div class="dropdown-user--content">
            <router-link class="dropdown-user--profile" :to="{path: '/profile', query: {tab: 'settings'}}" tabindex="0" @click.native="handleClickDropdownItem">
              <img class="profile-avatar" height="48" width="48" :src="photoURL">
              <div class="profile-detail">
                <div class="display-name">{{ displayName }}</div>
                <div class="display-email">{{ email }}</div>
              </div>
            </router-link>
            <router-link to="/post" class="dropdown-user--link" tabindex="0">
              編輯新文章
            </router-link>
            <router-link :to="{path: '/profile', query: {tab: 'browsing_history'}}" class="dropdown-user--link" tabindex="0" @click.native="handleClickDropdownItem">
              瀏覽紀錄
            </router-link>
            <router-link :to="{path: '/profile', query: {tab: 'edited_articles'}}" class="dropdown-user--link" tabindex="0" @click.native="handleClickDropdownItem">
              編輯過的文章
            </router-link>
            <router-link :to="{path: '/profile', query: {tab: 'bookmarks'}}" class="dropdown-user--link" tabindex="0" @click.native="handleClickDropdownItem">
              收藏的文章
            </router-link>
            <router-link :to="{path: '/profile', query: {tab: 'settings'}}" class="dropdown-user--link" tabindex="0" @click.native="handleClickDropdownItem">
              個人設定
            </router-link>
            <router-link to="/" class="dropdown-user--link" tabindex="0" @click.native="handleLogout">
              登出
            </router-link>
          </div>
        </div>
      </template>

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
import { mapGetters } from 'vuex'
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
      categoryList: ['政經', '國際', '社會', '科技', '環境', '生活', '運動'],
      avatarBlur: true
    }
  },
  computed: {
    ...mapGetters(['photoURL', 'displayName', 'uid', 'isLogin', 'user', 'windowWidth']),
    ...mapGetters({ email: 'user/email' }),
    getRedirectPath() {
      // 設置重新導向，若在首頁、註冊、登入頁面做切換不需設置redirect，其他頁面則需要重新導向，若已經設置重新導向頁面，則註冊、登入切換時，並不會互相把自己的頁面給放進重新導向內
      const disableRedirectPaths = ['/', '/signup', '/login']
      return disableRedirectPaths.some(disableRedirectPath => this.$route.path === disableRedirectPath) ? (this.$route.query.redirect === undefined ? null : { redirect: this.$route.query.redirect }) : { redirect: this.$route.path }
    },
    notifications() {
      console.log(this.$store.getters.notifications)
      return this.$store.getters.notifications
    },
    modalComponent() {
      if (this.modalType === 'login') {
        return () => import('@/components/Account/Login.vue')
      } else {
        return () => import('@/components/Account/SignUp.vue')
      }
    },
    sm() {
      return this.windowWidth < 680
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
    handleLogout(event) {
      event.target.blur()
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
    },
    handleClickDropdownItem(event) {
      // Close dropdown when dropdown item clicked
      // This is done by bluring the current target
      event.currentTarget.blur()
    },
    safariBtnFocusTweak(event) {
      // This function is used to fixed the Safari focus problem
      event.target.parentElement.focus()
    },
    parseTime(timeObject) {
      // notification time formats are different
      if (typeof timeObject === 'string') {
        return moment(timeObject).fromNow()
      } else {
        const time = timeObject['_seconds'] * 1000
        return moment(time).fromNow()
      }
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
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
  }
  .item-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .sync-icon {
    height: 32px;
    margin-right: 12px;
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
    padding: 0;
    font-size: 18px;
    line-height: 30px;
    justify-content: space-between;
  }
  .arrow-down-icon {
    padding: 0;
    margin-left: 4px;
  }
}

// dropdown
.dropdown {
  position: relative;
}

.dropdown-content {
  display: flex;
  flex-direction: column;

  // style box
  &--list {
    width: 122px;
    background-color: white;
    z-index: 1;
    box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 8px 0px;
  }

  // list element
  a {
    color: $text-1 !important;
    padding: 0.5rem;
    text-decoration: none;
    display: block;
    &:hover {
      background-color: $gray-2;
    }
  }
}
.dropdown:hover .dropdown-content, .dropdown:focus-within , .dropdown-btn:focus + .dropdown-content {
  display: block;
}

// user dropdown
.dropdown-user {
  position: relative;
  &--profile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding: 8px 16px;
    &:hover, &:focus, &:active {
      background-color: $gray-2;
    }

    @media screen and (max-width: 679px) {
      margin: 0 -1.25rem;
      padding: 0 1.25rem;
    }

    .profile-avatar {
      -webkit-background-size: 48px 48px;
      background-size: 48px 48px;
      -webkit-border-radius: 50%;
      border-radius: 50%;
      display: block;
      margin: 0;
      position: relative;
      height: 48px;
      width: 48px;
      z-index: 1;
      margin-right: 16px;
    }
    .profile-detail {
      flex-grow: 1;
      .display-name {
        font-size: 16px;
        color: $text-1;
        font-weight: 700;
      }
      .display-email {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
        color: $text-3;
        font-weight: 400;
      }
    }
  }
  &--link {
    display: block;
    height: 40px;
    padding: 8px 16px;
    color: $gray-11;
    font-size: 14px;
    font-weight: 400;
    position: relative;
    &:hover, &:focus, &:active {
      background-color: $gray-2;
    }

    @media screen and (max-width: 679px) {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 1.25rem;
      margin: 0 -1.25rem;
      font-size: 16px;
    }
  }
}

.dropdown-user--content {
  display: none;
  position: absolute;
  right: 0;
  top: 40px; // 64 - 12 (avatar height) - 12 offset

  // style box
  width: 300px;
  height: 320px;
  background-color: white;
  z-index: 1;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 8px 0px 8px 0px;
}

.avatar-user {
  &--img {
    -webkit-background-size: 32px 32px;
    background-size: 32px 32px;
    border: 2px solid $gray-12;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    display: block;
    margin: 0;
    position: relative;
    height: 32px;
    width: 32px;
    z-index: 1;
    &:hover {
      opacity: 0.9;
    }
    &:active {
      opacity: 0.5;
    }
  }

  // for hover effect
  &--btn {
    display: flex;
    align-items: center;
    position: relative;
    background-color: none;
    border: none;
    border-radius: 50%;
    padding: 0;
    margin-left: 12px;
    &::before {
      position: absolute;
      display: block;
      content: ' ';
      height: 32px;
      width: 32px;
      border-radius: 50%;
      background-color: $gray-12;
      z-index: 0;
    }
  }
}

.dropdown-user:focus-within .dropdown-user--content,
.avatar-user--btn:focus + .dropdown-user--content {
  display: block;
}

.search-bar {
  height: 40px;
  position: relative;
  margin-bottom: calc(24px - 10px);

  // input bar
  &--input {
    width: 100%;
    height: 40px;
    border-radius: 20px;
    background-color: $gray-2;
    padding-left: 42px;
    caret-color: $blue-4;
    font-size: 14px;

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

// style cancel button in input
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

.nav-sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 2rem;
  font-size: 18px;

  @media screen and (max-width: 679px) {
    padding: 0 1.25rem;
  }

  &__header {
    display: flex;
    gap: 1.5rem;
    align-items: center;

    > span {
      font-size: 18px;
      line-height: 30px;
    }
  }
}

.post {
  &--btn {
    margin: 0px 12px;
  }
  &--icon {
    height: 36px !important;
    width: 36px !important;
  }
}
.notification {
  &--btn {
    margin-right: 7px;
    margin-left: 15px;
  }
  &--icon {
    height: 36px !important;
    width: 36px !important;
  }

  &-dropdown {
    position: relative;
    ::-webkit-scrollbar {
      position: absolute;
      width: 14px;
      padding: 4px 8px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: transparent;
      margin-top: 4px;
      margin-bottom: 4px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: $gray-4;
      // hack to add padding at right
      border: 4px solid transparent;
      background-clip: padding-box;
      border-radius: 9999px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
      // hack to add padding at right
      border: 4px solid transparent;
      background-clip: padding-box;
      border-radius: 9999px;
    }

    &--content {
      padding-top: 8px;
      padding-bottom: 8px;
      display: none;
      position: absolute;
      right: 0;
      top: 42px; // 56 - 8px
      // overlay content under scrollbar
      overflow: overlay !important;

      // style box
      background-color: white;
      z-index: 1;
      box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      width: 300px;
      height: 404px;
    }
    &--slot {
      height: 86px;
      display: flex;
      padding: 8px 16px;
      color: $gray-11;

      @media screen and (max-width: 679px) {
        margin: 0 -1.25rem;
      }

      .description {
        font-size: 14px;
        line-height: 24px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      &:hover {
        background-color: $gray-2;
      }
      .avatar-icon{
        width: 20px;
        margin-right: 8px;
      }
    }
    &--text {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 12px;
    }
    &--date {
      color: $blue;
      font-size: 12px;
    }
  }
}

.notification-dropdown:focus-within .notification-dropdown--content,
.notification-dropdown--content:focus,
.notification--btn:focus + .notification-dropdown--content {
  display: block;
  overflow-y: scroll;
  &.no-notification {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 82px;
      font-size: 14px;
      color: $text-1;
    }
}

.icon-button {
  background-color: transparent;
  border: none;
  padding: 0;
  border-radius: 8px;
  &:hover, &:focus, &:active {
    background-color: $gray-2;
  }
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
