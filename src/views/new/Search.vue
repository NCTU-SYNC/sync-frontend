<template>
  <div class="search-page--container">
    <b-container fluid="xl" class="search-bar-container">
      <b-form
        class="d-flex justify-content-center"
        @submit.prevent="submitHandler"
      >
        <div id="search-form">
          <div class="search-row d-flex align-items-center">
            <icon icon="news-panel-search" class="search-icon" size="md" />
            <b-form-input
              id="search-articles"
              :value="keyword"
              class="search-bar"
              placeholder="搜尋文章"
              :readonly="isLoading"
              type="search"
              @input="setUnsentKeyword"
            />
          </div>
          <div
            v-if="keyword != ''"
            class="result-option-row d-flex justify-content-between"
          >
            <div class="result-detail">
              有關“{{ keyword }}”的 {{ resultSize }} 項搜尋結果
            </div>
            <div class="search-options">
              新聞時間：
              <b-button-group>
                <b-button
                  variant="link"
                  class="time-btn"
                  :pressed="timeQuery === getTimeQuery('week')"
                  @click="searchFilter('week')"
                >上禮拜</b-button>
                <b-button
                  variant="link"
                  class="time-btn"
                  :pressed="timeQuery === getTimeQuery('month')"
                  @click="searchFilter('month')"
                >上個月</b-button>
                <b-button
                  variant="link"
                  class="time-btn"
                  :pressed="timeQuery === getTimeQuery('all')"
                  @click="searchFilter('all')"
                >不限</b-button>
              </b-button-group>
            </div>
          </div>
        </div>
      </b-form>
    </b-container>
    <transition name="fade" mode="out-in" :duration="1000">
      <b-container v-if="!isLoading" fluid="xl">
        <div class="d-flex justify-content-center cards-container">
          <b-row
            cols="1"
            :cols-md="Math.min(2, resultSize)"
            :cols-lg="Math.min(3, resultSize)"
            style="max-width: 1024px"
          >
            <ArticleCard
              v-for="(news, newsIndex) in result"
              :key="newsIndex"
              :category="news.category"
              :title="news.title"
              :views-count="news.viewsCount"
              :tags="news.tags.slice(0, 2)"
              :last-updated-at="news.lastUpdatedAt"
              :edited-count="news.editedCount"
              :blocks="news.blocks"
              :article-id="news._id"
            />
          </b-row>
        </div>
      </b-container>
      <div v-else class="loading-animation--container">
        <b-img
          src="src/assets/images/search-animation.svg"
          class="loading-animation"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'
import { getTimeQuery } from '@/api/article'
import ArticleCard from '@/components/ArticleCard.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Search',
  components: {
    ArticleCard
  },
  props: {
    query: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      unsentKeyword: '',
      sentKeyword: '',
      resultCount: 0,
      newsArr: [],
      queryTimeSelected: 'qdr:a',
      prevQueryTime: null,
      categorySelected: '',
      categoryQueries: [
        '不限主題',
        '政經',
        '社會',
        '環境',
        '運動',
        '國際',
        '科技',
        '生活'
      ]
    }
  },
  computed: {
    ...mapGetters({
      keyword: 'search/keyword',
      timeQuery: 'search/timeQuery',
      category: 'search/category',
      isLoading: 'search/isLoading',
      result: 'search/result'
    }),
    resultSize() {
      return _.size(this.result)
    }
  },
  created() {
    this.setQuery(this.$props.query)
  },
  methods: {
    ...mapActions({
      setQuery: 'search/setQuery',
      updateKeyword: 'search/updateKeyword',
      updateTimeQuery: 'search/updateTimeQuery'
    }),

    setUnsentKeyword(keyword) {
      this.unsentKeyword = keyword
    },

    submitHandler() {
      this.updateKeyword(this.unsentKeyword)
    },

    getTimeQuery(time) {
      return getTimeQuery(time)
    },

    handleArticleRoute(_id) {
      if (!_id) return
      this.$router.push({ path: `/article/${_id}` })
    },

    searchFilter(filterRange = 'all') {
      if (getTimeQuery(filterRange) === this.queryTimeSelected) return
      this.queryTimeSelected = getTimeQuery(filterRange)
      this.updateTimeQuery(this.queryTimeSelected)
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
@import '@/assets/scss/news.scss';
.search-page--container {
  min-height: 740px;
}
.search-bar-container {
  margin-top: 3rem;
  width: 100%;
}

#search-form {
  width: 55%;
}
.search-row {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 13px;
  width: 18px;
  height: 18px;
}
.search-bar {
  height: 40px;
  border: 1px solid $gray-4 !important;
  border-radius: 4px;
  padding-left: 42px;
  &:active,
  &:focus {
    border: 1px solid $blue !important;
  }
  &::placeholder {
    color: $text-4;
  }
}
.cards-container {
  margin: 48px 0;
}
.result-option-row {
  margin-top: 12px;
  .result-detail {
    color: $text-3;
    font-size: 12px;
  }
  .search-options {
    font-size: 14px;
    .time-btn {
      position: relative;
      font-size: 14px;
      padding: 0;
      &:not(:last-child) {
        margin: 0 8px;
        &::before {
          content: '';
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
