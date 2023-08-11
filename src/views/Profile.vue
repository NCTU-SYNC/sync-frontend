<template>
  <div class="main">
    <PersonalStatus
      v-if="md"
      :style="{'margin-top': '1rem', 'margin-left': '1rem'}"
      :photo-url="photoURL"
      :display-name="displayName"
      :points="points"
      :creation-date-time="creationDateTime"
    />
    <div class="main-container">
      <div v-if="!sm" class="sidebar">
        <PersonalStatus
          v-if="lg"
          :photo-url="photoURL"
          :display-name="displayName"
          :points="points"
          :creation-date-time="creationDateTime"
        />
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
              <span v-if="!md" class="option-text">編輯過的文章</span>
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
              <span v-if="!md" class="option-text">瀏覽紀錄</span>
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
              <span v-if="!md" class="option-text">收藏的文章</span>
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
              <span v-if="!md" class="option-text">個人設定與貢獻值</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="tab-content">
        <template v-if="currentShowingIndex === 3">
          <b-nav>
            <b-nav-item
              :active="currentSettingIndex === 0"
              @click="currentSettingIndex = 0"
            >
              <h3 class="m-0">個人設定</h3>
            </b-nav-item>
            <b-nav-item
              :active="currentSettingIndex === 1"
              @click="currentSettingIndex = 1"
            >
              <h3 class="m-0">貢獻值</h3>
            </b-nav-item>
          </b-nav>
          <Setting v-if="currentSettingIndex === 0" />
          <ContributionPoint v-if="currentSettingIndex === 1" :points="points" />
        </template>
        <template v-else-if="showingArticles.length > 0">
          <div v-for="(article, index) in showingArticles" :key="index" class="title-card">
            <div class="d-flex justify-content-between">
              <h1 class="title-text" @click="gotoArticle(article._id)">
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
        <template v-else>
          <Logo class="logo-background" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalStatus from '@/components/Profile/PersonalStatus.vue'
import Setting from '@/components/Profile/Setting.vue'
import ContributionPoint from '@/components/Profile/ContributionPoint.vue'
import HashtagPill from '@/components/HashtagPill.vue'
import Logo from '@/components/Logo.vue'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import UserAPI from '@/api/user'

export default {
  name: 'Profile',
  components: {
    PersonalStatus,
    Setting,
    ContributionPoint,
    HashtagPill,
    Logo
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
      currentSettingIndex: 0,
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
    ...mapGetters(['windowWidth']),
    sm() {
      return this.windowWidth < 680
    },
    md() {
      return this.windowWidth < 1024 && this.windowWidth >= 680
    },
    lg() {
      return this.windowWidth >= 1024
    },
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
      this.currentShowingIndex = this.tabMap.get(tab) ?? 0
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
          break
        case 2:
          this.showingArticles = [...this.articles.subscribed].reverse()
          break
        case 1:
          this.showingArticles = [...this.articles.viewed].reverse()
          break
        case 0:
        default:
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
    gotoArticle(articleId) {
      this.$router.push(`article/${articleId}`)
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

      this.updateList()
    }
  }
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none !important;
}

.main {
  @media screen and (max-width: 679px){
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.main-container {
  margin: 0 auto;
  gap: 2rem;
  padding: 2.25rem;

  @media screen and (min-width: 680px){
    display: grid;
    grid-template-columns: repeat(12, 1fr);
  }

  @media screen and (max-width: 1023px){
    padding-top: 1rem;
  }
}

.sidebar {
  grid-column: 1 / 4;
  flex-shrink: 0;

  @media screen and (max-width: 1023px) and (min-width: 680px){
    grid-column: 1 / 2;
  }

  @media screen and ((min-width: 1024px) or (max-width: 679px)){
    width: 280px;
  }
}

.avatar {
  border-radius: 50%;
  width: 100%;
  height: auto;
  max-width: 150px;
  max-height: 150px;
}

.options-nav {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-around;
  position: relative;
  list-style: none;

  @media screen and (max-width: 1023px) and (min-width: 680px){
    width: fit-content;
  }

  @media screen and (min-width: 1024px){
    margin-top: 3rem;
  }

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
      margin: auto 0;
    }

    .option-icon {
      display: flex;
      height: 36px;
      width: 36px;
      margin: auto 1rem; /* vertical align icon center */
      align-items: center; /* align item in container */
      justify-content: center; /* align item in container */
    }
  }
}

.profile-title {
  margin: 1rem 0;
  color: rgb(49, 87, 211);
}

.blank-row {
  height: 0.875rem !important;
}

/*
  tab content
*/
.tab-content {
  grid-column: 4 / -1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media screen and (max-width: 1023px) and (min-width: 680px){
    grid-column-start: 2;
  }

  .nav {
    font-size: 1.5rem;
    font-weight: 700;
    border-bottom: 1px solid gray;

    .active {
      color: black;
      border-bottom: 2px solid #2353FF;
    }
  }
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
  width: auto;
  gap: 1rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 16px;

  @media screen and (min-width: 1023px){
    max-width: 37rem;
  }

  .title-text {
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.75rem;
    color: #0e0e0e;
    margin: 0;

    &:hover {
      cursor: pointer;
    }
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

.logo-background {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: rotate(-30deg) scale(2.5);
  opacity: 0.3;
}

</style>
