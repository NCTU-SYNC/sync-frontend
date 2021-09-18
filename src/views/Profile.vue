<template>
  <b-container fluid class="no-gutters pl-0 pr-0">
    <b-row>
      <div class="sidebar">
        <table class="personal-status">
          <tr>
            <td>
              <b-avatar size="4rem" :src="photoURL" />
            </td>
            <td>
              <span
                class="d-block w-auto text-lg font-weight-bold text-truncate"
              >{{ displayName }}</span>
              <span class="d-block w-auto text-sm text-gray text-truncate">{{
                email
              }}</span>
            </td>
          </tr>
          <tr class="blank-row">
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td class="text-sm">加入日期</td>
            <td class="text-sm text-light-gray">{{ creationDateTime }}</td>
          </tr>
          <tr>
            <td class="text-sm">貢獻值</td>
            <td class="text-sm">{{ points }}</td>
          </tr>
        </table>

        <ul role="tablist" class="options-nav">
          <li
            :aria-selected="currentShowingIndex === 0"
            role="tab"
            class="option-name"
          >
            <a
              @click="currentShowingIndex = 0"
            ><span class="option-text edited-article">編輯過的文章</span></a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 1"
            role="tab"
            class="option-name"
          >
            <a
              @click="currentShowingIndex = 1"
            ><span class="option-text history">瀏覽紀錄</span></a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 2"
            role="tab"
            class="option-name"
          >
            <a
              @click="currentShowingIndex = 2"
            ><span class="option-text collection">收藏的文章</span></a>
          </li>
          <li
            :aria-selected="currentShowingIndex === 3"
            role="tab"
            class="option-name"
          >
            <a
              @click="currentShowingIndex = 3"
            ><span class="option-text setting">個人設定</span></a>
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
            lg
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
      articles: {},
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
        ? moment(parseInt(this.createAt)).format('YYYY年M月D日 HH:mm')
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
      this.init()
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
      display: inline-block;
      font-size: 1.125rem;
      letter-spacing: 0.25rem;
      text-indent: 0.25rem;
      vertical-align: middle;
      padding-left: 4rem;
      margin: auto 0;
    }
  }
}

.edited-article {
  background: left 2rem top 50% url('../assets/icons/ic-edited.svg') no-repeat;
  padding-left: 4.5rem;
}

.history {
  background: left 2rem top 50% url('../assets/icons/ic-history.svg') no-repeat;
  padding-left: 4.5rem;
}

.collection {
  background: left 2rem top 50% url('../assets/icons/ic-bookmark.svg') no-repeat;
  padding-left: 4.5rem;
}

.setting {
  background: left 2rem top 50% url('../assets/icons/ic-settings.svg') no-repeat;
  padding-left: 4.5rem;
}

.profile-title {
  margin: 1rem 0;
  color: rgb(49, 87, 211);
}

.personal-status {
  table-layout: fixed;
  margin-left: 2rem;
  width: calc(300px - 2rem);

  &:first-child > tr td:first-of-type {
    box-sizing: content-box;
    width: 4rem;
  }

  td {
    padding: 0.625rem 1.5rem 0 0;
  }

  tr:first-of-type td {
    padding-top: 0;
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
  width: 32.5rem;
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
}
</style>
