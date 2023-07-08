<template>
  <b-container fluid class="no-gutters pl-0 pr-0">
    <div class="d-flex">
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
            <a @click="setTab('edited_articles')">
              <span aria-hidden focusable="false" class="option-icon">
                <SyncIcon icon="edited" />
              </span>
              <span class="option-text">編輯過的文章</span>
            </a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 1"
            role="tab"
            class="option-name"
          >
            <a @click="setTab('browsing_history')">
              <span aria-hidden focusable="false" class="option-icon">
                <SyncIcon icon="history" />
              </span>
              <span class="option-text">瀏覽紀錄</span>
            </a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 2"
            role="tab"
            class="option-name"
          >
            <a @click="setTab('bookmarks')">
              <span aria-hidden focusable="false" class="option-icon">
                <SyncIcon icon="bookmark" />
              </span>
              <span class="option-text">收藏的文章</span>
            </a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 3"
            role="tab"
            class="option-name"
          >
            <a @click="setTab('settings')">
              <span aria-hidden focusable="false" class="option-icon">
                <SyncIcon icon="settings" />
              </span>
              <span class="option-text">個人設定</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="tab-content">
        <template v-if="currentShowingIndex === 3">
          <slot>
            <Setting />
          </slot>
        </template>
        <template v-else>
          <div v-for="(article, index) in showingArticles" :key="index" class="title-card">
            <div class="d-flex justify-content-between">
              <h1 class="title-text">
                {{ article.title }}
              </h1>
              <a class="bookmark-icon" @click="toggleSubscription(article)">
                <SyncIcon v-if="isSubscribed(article)" icon="bookmark-solid" size="md" />
                <SyncIcon v-else icon="bookmark" size="md" />
              </a>
            </div>
            <div v-if="article.tags.length !== 0" class="hashtag-container">
              <HashtagPill v-for="(tag, idx) in article.tags" :key="idx" :name="tag" />
            </div>
            <div class="author-info">
              編輯者： {{ getAuthorString(article.authors) }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </b-container>
</template>

<script>
import Setting from '@/components/Profile/Setting.vue'
import HashtagPill from '@/components/HashtagPill.vue'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import UserAPI from '@/api/user'

export default {
  name: 'Profile',
  components: {
    Setting,
    HashtagPill
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
      points: 0,
      tabMap: new Map([
        ['edited_articles', 0],
        ['browsing_history', 1],
        ['bookmarks', 2],
        ['settings', 3]
      ])
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
    '$route.query.tab'() {
      const tab = this.$route.query.tab
      if (!this.tabMap.has(tab)) {
        this.currentShowingIndex = 0
      } else {
        this.currentShowingIndex = this.tabMap.get(tab)
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
    // navigate to tab when page loaded
    const tab = this.$route.query.tab
    if (tab && this.tabMap.has(tab)) {
      this.currentShowingIndex = this.tabMap.get(tab)
    }
  },
  methods: {
    ...mapActions({ getToken: 'user/getToken' }),
    async init() {
      const { data } = await UserAPI.getArticleInfo()
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
    },
    setTab(tabName) {
      const currentTab = this.$route.query.tab
      if (tabName === currentTab) return
      const query = {
        tab: tabName
      }
      this.$router.push({ path: 'profile', query })
    },
    getAuthorString(authors) {
      let authorsString = ''
      authorsString = authors
        .slice(0, 3)
        .map((user) => user.name)
        .join(', ')
      if (authors.length > 3) {
        authorsString += ` + ${authors.length - 3} 人`
      }
      return authorsString
    },
    isSubscribed(article) {
      return this.articles.subscribed.map((a) => a._id).includes(article._id)
    },
    async toggleSubscription(article) {
      const { _id } = article
      const isSubscribed = this.isSubscribed(article)
      const response = await UserAPI.subscribeArticle(_id, !isSubscribed)

      if (response.data.type === 'success') {
        if (isSubscribed) {
          const idx = this.articles.subscribed.indexOf(article)
          this.articles.subscribed.splice(idx, 1)
        } else {
          this.articles.subscribed.push(article)
        }
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
  flex-shrink: 0;
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
  margin-top: 4rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-around;
  position: relative;
  list-style: none;

  a {
    cursor: pointer;
    display: flex;
    height: 100%;
    width: 100%;
  }

  .option-name {
    background-color: white;
    border-radius: 16px;
    display: flex;
    height: 4rem;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.04);

    &[aria-selected='true'] {
      color: blue;
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 37.75rem;
  padding: 1.5rem;
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

.title-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 16px;

  .title-text {
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.75rem;
    color: #0e0e0e;
    margin: 0;
  }

  .bookmark-icon {
    :hover {
      cursor: pointer;
    }
  }

  .hashtag-container {
    font-size: 12px;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .author-info {
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem;
    overflow-wrap: anywhere;
  }
}
</style>
