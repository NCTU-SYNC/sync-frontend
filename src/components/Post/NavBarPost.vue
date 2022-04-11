<template>
  <b-navbar ref="navbar" fixed="top" class="header-navbar" type="light" variant="faded">
    <b-navbar-brand id="brand" to="/"><Logo /></b-navbar-brand>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto d-flex align-items-center h-100">
      <b-form-group class="checkbox">
        <input id="checkbox-title" v-model="isAnonymous" type="checkbox">
        <label for="checkbox-title"><span />匿名發文</label>
      </b-form-group>
      <b-button variant="secondary" class="cancel-btn" @click="cancelPost">取消</b-button>
      <b-button variant="primary" class="publish-btn" :disabled="isLoading" @click="publishArticle">儲存</b-button>
      <b-nav-item-dropdown
        size="lg"
        variant="link"
        toggle-class="notification-btn"
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
      <b-nav-item-dropdown v-show="getLoginStatus" no-caret right toggle-class="p-0">
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
  </b-navbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { createArticle, updateArticleById } from '@/api/article'
import firebase from '@/utils/firebase'
import Logo from '@/components/Logo.vue'
import moment from 'moment'

export default {
  name: 'NavBarPost',
  components: { Logo },
  data() {
    return {
      isLoading: false,
      redirectTimerId: null
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'uid']),
    ...mapGetters({ post: 'post' }),
    showAddPointsAlert: {
      get() {
        return this.post.showAddPointsAlert
      },
      set(newValue) {
        this.$store.commit('post/SHOW_ADDPOINTS_ALERT', newValue)
      }
    },
    isAnonymous: {
      get() {
        return this.post.isAnonymous
      },
      set(newValue) {
        this.$store.commit('post/SET_ANONYMOUS', newValue)
      }
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
  beforeDestroy() {
    if (this.redirectTimerId) {
      clearTimeout(this.redirectTimerId)
    }
  },
  methods: {
    ...mapActions({ getToken: 'user/getToken' }),
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
    async publishArticle() {
      this.isLoading = true
      if (!this.isLogin) {
        await this.$bvModal.msgBoxOk('登入逾時或失效，請重新登入')
        this.isLoading = false
        this.$router.push('/login')
        return
      }
      let noTitle = false
      this.post.blocks.forEach((block) => {
        if (block.blockTitle === '') {
          noTitle = true
        }
      })
      if (noTitle) {
        await this.$bvModal.msgBoxOk('段落標題不得為空白，請輸入段落標題')
        this.isLoading = false
        return
      }

      if (Object.values(this.post.currentEditors).some((editor) => editor.isEmpty)) {
        await this.$bvModal.msgBoxOk('段落內文不得為空白，請輸入段落內文')
        this.isLoading = false
        return
      }

      const articleData = this.$store.getters['post/GET_PUBLISH_DATA']
      // add user credentials
      articleData.uid = this.uid
      articleData.token = await this.getToken()
      if (this.post.isNewPost) {
        try {
          const { data } = await createArticle(articleData)
          this.isLoading = false
          if (data.code === 200) {
            this.removeArticleLocalStorage()
            this.$store.commit('post/SET_ARTICLEID', data.id)
            this.showAddPointsAlertAndRedirect()
          } else {
            this.$bvModal.msgBoxOk(data.message)
          }
        } catch (error) {
          this.$bvModal.msgBoxOk(error.message)
          this.isLoading = true
        }
      } else {
        articleData.id = this.post.articleId
        try {
          const { data } = await updateArticleById(articleData)
          this.isLoading = false
          if (data.code === 200) {
            // show add point alert
            this.showAddPointsAlertAndRedirect()
            this.removeArticleLocalStorage()
          } else {
            this.$bvModal.msgBoxOk(data.message)
          }
        } catch (error) {
          this.$bvModal.msgBoxOk(error.message)
          this.isLoading = false
        }
      }
    },
    showAddPointsAlertAndRedirect() {
      this.showAddPointsAlert = true
      const redirectArticleId = this.post.articleId
      this.redirectTimerId = setTimeout(() => {
        this.$router.push({ name: 'Article', params: { ArticleID: redirectArticleId }})
        this.$store.commit('post/RESET_POST')
      }, 2000)
    },
    cancelPost() {
      const redirectArticleId = this.post.articleId
      this.removeArticleLocalStorage()
      if (redirectArticleId) {
        this.$router.push({ name: 'Article', params: { ArticleID: redirectArticleId }})
        this.$store.commit('post/RESET_POST')
      } else {
        this.$router.push({ name: 'Home' })
        this.$store.commit('post/RESET_POST')
      }
    },
    removeArticleLocalStorage() {
      localStorage.removeItem(this.$store.getters['post/GET_ARTICLEID_STRING'])
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/post/main.scss";
.header-navbar {
  height: 4rem;
  background-color: $white;
  border-bottom: 1px solid $gray-light;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 32px;
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
    height: 32px;
    width: 32px;
    z-index: 0;
}

.notification-container {
  padding: 1rem;
  width: 20rem;
  max-height: calc(100vh - 4rem);
  overflow-x: hidden;
  overflow-y: scroll;
}

.cancel-btn {
  margin-right: 16px;
}

.publish-btn {
  margin-right: 32px;
}

::v-deep .notification-btn.nav-link.dropdown-toggle {
  padding: 0;
  margin-right: 24px;
}

.checkbox {
  margin-bottom: 0;
  margin-right: 24px;
  label {
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  input[type="checkbox"] {
    display:none;
  }

  input[type="checkbox"] + label span {
    display:inline-block;
    width: 16px;
    height: 16px;
    margin: 0 0.5rem 0.25rem 0;
    vertical-align: middle;
    background: url('~@/assets/images/ic-checkbox-inactivated.svg') 0 center no-repeat;
    cursor: pointer;
    border-radius: 2px;
  }

  input[type="checkbox"] + label span:hover {
    background: url('~@/assets/images/ic-checkbox-hover.svg') 0 center no-repeat;
  }

  input[type="checkbox"]:checked + label span {
    background: url('~@/assets/images/ic-checkbox-activated.svg') 0 center no-repeat;
  }

  input[type=checkbox]+ label {
    color: $text-2;
    user-select: none; /* 防止文字被滑鼠選取反白 */
  }
}
</style>

<style lang="scss">
.btn-wrap {
  white-space: normal !important;
  word-wrap: break-word !important;
}
</style>
