<template>
  <b-container fluid class="no-gutters pl-0 pr-0">
    <b-row>
      <div class="sidebar">
        <b-container class="personal-status">
          <b-avatar size="5rem" :src="photoURL" class="float-left" />
          <b-row align-v="stretch" class="personal-status-name">
            <b-col class="text-lg font-weight-bold text-truncate">
              {{ displayName }}
            </b-col>
          </b-row>
          <b-row align-v="stretch" class="personal-status-text">
            <b-col cols="6" class="text-sm text-gray pr-0">貢獻值</b-col>
            <b-col class="text-sm text-blue pl-0 pr-0">{{ points }}</b-col>
          </b-row>
          <b-row align-v="stretch" class="personal-status-text">
            <b-col cols="6" class="text-sm text-gray pr-0">加入日期</b-col>
            <b-col class="text-sm text-gray pl-0 pr-0">{{
              creationDateTime
            }}</b-col>
          </b-row>
        </b-container>

        <ul role="tablist" class="options-nav">
          <li
            :aria-selected="currentShowingIndex === 0"
            role="tab"
            class="option-name"
          >
            <a @click="currentShowingIndex = 0">
              <span aria-hidden focusable="false" class="option-icon">
                <icon icon="edited" />
              </span>
              <span class="option-text">編輯過的文章</span>
            </a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 1"
            role="tab"
            class="option-name"
          >
            <a @click="currentShowingIndex = 1">
              <span aria-hidden focusable="false" class="option-icon">
                <icon icon="history" />
              </span>
              <span class="option-text">瀏覽紀錄</span>
            </a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 2"
            role="tab"
            class="option-name"
          >
            <a @click="currentShowingIndex = 2">
              <span aria-hidden focusable="false" class="option-icon">
                <icon icon="bookmark" />
              </span>
              <span class="option-text">收藏的文章</span>
            </a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 3"
            role="tab"
            class="option-name"
          >
            <a @click="currentShowingIndex = 3">
              <span aria-hidden focusable="false" class="option-icon">
                <icon icon="settings" />
              </span>
              <span class="option-text">個人設定</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="tab-content">
        <h2 class="mb-4">
          {{ contentTitle }}
        </h2>
        <slot v-if="currentShowingIndex === 3">
          <Setting />
        </slot>
        <slot v-for="article in showingArticles" v-else>
          <ArticleCard
            :title="article.title"
            :view-count="article.viewCount"
            :category="article.category"
            :last-updated-at="article.lastUpdatedAt"
            :edited-count="article.editedCount"
            :blocks="article.blocks"
            :article-id="article._id"
            full
            class="p-0"
          />
        </slot>
      </div>
      <div class="m-4" />
    </b-row>
  </b-container>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue'
import Setting from '@/components/Profile/Setting.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getArticlesInfo } from '@/api/user'

export default {
  name: 'Profile',
  components: {
    ArticleCard,
    Setting
  },
  data() {
    return {
      articles: {
        edited: [],
        viewed: [],
        subscribed: []
      },
      showingArticles: [],
      currentShowingIndex: 0,
      contentTitle: '',
      points: 0
    }
  },
  computed: {
    ...mapGetters(['photoURL', 'displayName', 'uid', 'isLogin', 'user']),
    ...mapGetters({ createAt: 'user/createAt', email: 'user/email' }),
    creationDateTime() {
      return this.createAt
        ? moment(parseInt(this.createAt)).format('YYYY.MM.DD')
        : ''
    }
  },
  watch: {
    isLogin(newValue) {
      if (newValue) {
        this.init()
      }
    },
    currentShowingIndex() {
      this.updateList()
    }
  },
  mounted() {
    if (this.isLogin) {
      try {
        this.init()
      } catch (e) {
        console.error('Profile Initialization Error:', e)
      }
    }
  },
  methods: {
    async init() {
      const { data } = await getArticlesInfo({
        token: this.$store.getters.token
      })
      if (data.code === 200) {
        const payload = data.data
        this.articles = payload
        this.points = payload.points
        this.updateList()
      } else if (data.code === 500) {
        // refetch data if 500
        setTimeout(() => {
          this.init()
        }, 100)
      }
    },
    updateList() {
      switch (this.currentShowingIndex) {
        case 3:
          this.contentTitle = '個人設定'
          break
        case 2:
          this.contentTitle = '收藏的文章'
          this.showingArticles = [...this.articles.subscribed].reverse()
          break
        case 1:
          this.contentTitle = '瀏覽紀錄'
          this.showingArticles = [...this.articles.viewed].reverse()
          break
        case 0:
        default:
          this.contentTitle = '編輯過的文章'
          this.showingArticles = [...this.articles.edited].sort(
            (a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)
          )
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none !important;
}

.sidebar {
  position: sticky;
  top: 0;
  left: 0;
  width: 300px;
  padding-top: 1.5rem;
  border-right: 1px solid $gray-400;
}

.avatar {
  border-radius: 50%;
  width: 100%;
  height: auto;
  max-width: 150px;
  max-height: 150px;
}

/*
  options nav
*/
.options-nav {
  margin-top: 1.5rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  list-style: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $gray-400;
  }

  a {
    cursor: pointer;
    display: flex;
    height: 100%;
    width: 100%;
  }

  .option-name {
    display: flex;
    height: 4rem;

    &[aria-selected='true'] {
      border-left: 3px solid $blue;
      background-color: #f6f6f8;
    }

    .option-text {
      font-size: 1.125rem;
      letter-spacing: 0.25rem;
      text-indent: 0.25rem;
      padding-left: 1rem;
      margin: auto 0;
    }

    .option-icon {
      display: flex;
      height: 36px;
      width: 36px;
      margin: auto 0 auto 2rem; /* vertical align icon center */
      align-items: center; /* align item in container */
      justify-content: center; /* align item in container */
    }
  }
}

.profile-title {
  margin: 1rem 0;
  color: rgb(49, 87, 211);
}

.personal-status {
  height: 5rem;
  padding-left: 1.75rem;
  padding-right: 1.75rem;

  &-name {
    height: 2rem;
  }

  &-text {
    height: 1.5rem;

    :first-child {
      width: 8rem;
    }
  }

  // align all texts to center
  & * {
    margin: auto 0;
  }
}

.blank-row {
  height: 0.875rem !important;
}

/*
  tab content
*/
.tab-content {
  padding: 3rem 4rem;
  box-sizing: content-box;
}

/*
  custom typography
  (can be merged into main.scss)
*/
.text {
  &-lg {
    font-size: 1.125rem;
  }

  &-gray {
    color: rgba(0, 0, 0, 0.45);
  }

  &-blue {
    color: $blue;
  }
}
</style>
