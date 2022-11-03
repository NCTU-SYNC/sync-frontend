<template>
  <div class="hashtag-page--container">
    <b-container
      fluid="xl"
      class="hashtag-bar-container"
    >
      <div class="d-flex justify-content-center">
        <div id="hashtag-form">
          <h1 class="hashtag-row">
            #{{ hashtagText }}
          </h1>
          <div class="hashtag-options">
            新聞時間：
            <b-button-group>
              <b-button
                variant="link"
                class="time-btn"
                :pressed="queryTimeSelected === 'qdr:w'"
                @click="searchFilter('week')"
              >上禮拜</b-button>
              <b-button
                variant="link"
                class="time-btn"
                :pressed="queryTimeSelected === 'qdr:m'"
                @click="searchFilter('month')"
              >上個月</b-button>
              <b-button
                variant="link"
                class="time-btn"
                :pressed="queryTimeSelected === 'qdr:a'"
                @click="searchFilter('all')"
              >不限</b-button>
            </b-button-group>
          </div>
        </div>
      </div>
    </b-container>
    <transition
      name="fade"
      mode="out-in"
      :duration="1000"
    >
      <b-container
        v-if="!isLoading"
        fluid="xl"
      >
        <div class="d-flex flex-column justify-content-center cards-container">
          <ArticleCard
            v-for="(news, newsIndex) in newsArr"
            :key="newsIndex"
            full
            :category="news.category"
            :title="news.title"
            :views-count="news.viewsCount"
            :tags="news.tags.slice(0,2)"
            :last-updated-at="news.lastUpdatedAt"
            :edited-count="news.editedCount"
            :blocks="news.blocks"
            :article-id="news._id"
          />
        </div>
      </b-container>
      <div
        v-else
        class="loading-animation--container"
      >
        <b-img
          src="src/assets/images/search-animation.svg"
          class="loading-animation"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import ArticleAPI from '@/api/article'
import ArticleCard from '@/components/ArticleCard.vue'

export default {
  name: 'Hashtag',
  components: {
    ArticleCard
  },
  data() {
    return {
      isCardFull: true,
      hashtag: '',
      sentHashtag: '',
      resultCount: 0,
      newsArr: [],
      queryTimeSelected: 'qdr:a',
      prevQueryTime: null,
      categorySelected: '',
      timeQueries: new Map([
        ['all', 'qdr:a'],
        ['hour', 'qdr:h'],
        ['day', 'qdr:d'],
        ['week', 'qdr:w'],
        ['month', 'qdr:m'],
        ['year', 'qdr:y']
      ]),
      categoryQueries: [
        '不限主題',
        '政經',
        '社會',
        '環境',
        '運動',
        '國際',
        '科技',
        '生活'
      ],
      isLoading: false,
      hashtagText: this.$route.query.q
    }
  },
  watch: {
    async '$route.query'() {
      await this.routerQuerySearch()
    }
  },
  created() {
    this.routerQuerySearch()
  },
  methods: {
    handleSearch() {
      const routerQuery = this.$route.query
      if (
        this.hashtag === '' ||
        (routerQuery.q === this.hashtag &&
          routerQuery.tbs === this.queryTimeSelected)
      ) {
        return
      }
      this.$router.push({
        path: 'hashtag',
        query: { q: this.hashtag, tbs: this.queryTimeSelected }
      })
    },
    handleArticleRoute(_id) {
      if (!_id) return
      this.$router.push({ path: `/article/${_id}` })
    },
    async searchArticles() {
      // Search for news
      this.newsArr = []
      if (this.hashtag) {
        try {
          this.isLoading = true
          const { data } = await ArticleAPI.search(
            undefined,
            this.queryTimeSelected,
            this.categorySelected,
            this.hashtag
          )
          const type = data.type
          // const payload = data.data
          if (type === 'success') {
            // need to change
            const articles = data.data.sort(
              (a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)
            )
            articles.forEach((article) => {
              const {
                category,
                _id,
                title,
                viewsCount,
                tags,
                lastUpdatedAt,
                editedCount,
                blocks
              } = article
              this.newsArr.push({
                category,
                _id,
                title,
                viewsCount,
                tags,
                lastUpdatedAt,
                editedCount,
                blocks
              })
            })
          } else {
            throw new Error(data.message)
          }
        } catch (error) {
          console.error(error.message)
          this.$bvModal.msgBoxOk(error.message)
        } finally {
          this.isLoading = false
        }
      }
    },
    searchFilter(filterRange = 'all') {
      if (this.timeQueries.get(filterRange) === this.queryTimeSelected) return
      this.queryTimeSelected = this.timeQueries.get(filterRange)
      this.handleSearch()
    },
    async routerQuerySearch() {
      // Check if query string is empty
      if (this.$route.query.q) {
        // get query params from router
        const routerQuery = { q: '', tbs: 'qdr:a', ...this.$route.query }
        this.hashtag = routerQuery.q
        this.queryTimeSelected = routerQuery.tbs
        // if did not change, return
        if (
          routerQuery.q === '' ||
          (routerQuery.q === this.sentHashtag &&
            routerQuery.tbs === this.prevQueryTime)
        ) {
          return
        }

        await this.searchArticles()
        this.sentHashtag = this.hashtag
        this.prevQueryTime = this.queryTimeSelected
        this.resultCount = this.newsArr.length
      }
    },
    onTimeDropdownClicked(timeString) {
      this.queryTimeSelected = timeString
      this.searchArticles()
    },
    onCategoryDropdownClicked(categoryString) {
      this.categorySelected = categoryString
      this.searchArticles()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/news.scss";
.hashtag-page--container {
  min-height: 740px;
}
.hashtag-bar-container {
  margin-top: 3rem;
  width: 100%;
}

#hashtag-form {
  width: 55%;
}
.hashtag-row {
  margin: 12px 0;
  position: relative;
  text-align: center;
}

.cards-container {
  margin: 48px 0;
}

.hashtag-options {
  font-size: 14px;
  text-align: center;
  .time-btn {
    position: relative;
    font-size: 14px;
    padding: 0;
    &:not(:last-child) {
      margin: 0 8px;
      &::before {
        content: "";
        position: absolute;
        display: block;
        right: -9px;
        top: -1px;
        border-right: 1px solid $gray-4;
        height: 24px;
      }
    }
    &:last-child {
      margin-left: 8px;
    }
    &.active,
    &:active,
    &:focus {
      color: $blue !important;
      font-weight: bold !important;
    }
  }
}

.loading-animation--container {
  display: flex;
  justify-content: center;
  margin-top: 230px;
  .loading-animation {
    width: 60px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
