<template>
  <div>
    <b-container fluid="xl" class="search-bar-container">
      <b-form
        class="d-flex justify-content-center"
        @submit.prevent="handleSearch"
      >
        <div
          id="search-form"
        >
          <div class="search-row d-flex align-items-center">
            <icon icon="news-panel-search" class="search-icon" size="md" />
            <b-form-input
              id="search-articles"
              v-model="keyword"
              class="search-bar"
              placeholder="搜尋文章"
              :readonly="isLoading"
              type="search"
            />
          </div>
          <div v-if="sentKeyword!=''" class="result-option-row d-flex justify-content-between">
            <div class="result-detail">
              有關“{{ sentKeyword }}”的 {{ resultCount }} 項搜尋結果
            </div>
            <div class="search-options">
              新聞時間：
              <b-button-group>
                <b-button variant="link" class="time-btn" :pressed="queryTimeSelected === 'qdr:w'">上禮拜</b-button>
                <b-button variant="link" class="time-btn" :pressed="queryTimeSelected === 'qdr:m'">上個月</b-button>
                <b-button variant="link" class="time-btn" :pressed="queryTimeSelected === 'qdr:a'">不限</b-button>
              </b-button-group>
            </div>
          </div>
        </div>
      </b-form>
    </b-container>
    <b-container fluid="xl">
      <div
        class="d-flex justify-content-center cards-container"
      >
        <b-row cols-sm="1" :cols-md="Math.min(2,filteredNewsArr.length)" :cols-lg="Math.min(3,filteredNewsArr.length)" style="max-width:1024px;">
          <ArticleCard
            v-for="(news, newsIndex) in filteredNewsArr"
            :key="newsIndex"
            :category="news.category"
            :title="news.title"
            :views-count="news.viewsCount"
            :tags="news.tags.slice(0,2)"
            :last-updated-at="news.lastUpdatedAt"
            :edited-count="news.editedCount"
            :blocks="news.blocks"
            :article-id="news._id"
          />
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import moment from 'moment'
import { searchArticles } from '@/api/article'
import ArticleCard from '@/components/ArticleCard.vue'
export default {
  name: 'Search',
  components: {
    ArticleCard
  },
  data() {
    return {
      keyword: '',
      sentKeyword: '',
      resultCount: 0,
      newsArr: [],
      filteredNewsArr: [],
      queryTimeSelected: 'qdr:a',
      categorySelected: '',
      timeQueries: [
        ['qdr:a', '發布時間'],
        ['qdr:h', '過去 1 小時'],
        ['qdr:d', '過去 24 小時'],
        ['qdr:w', '過去 1 週'],
        ['qdr:m', '過去 1 個月'],
        ['qdr:y', '過去 1 年']
      ],
      categoryQueries: ['不限主題', '政經', '社會', '環境', '運動', '國際', '科技', '生活'],
      isLoading: false
    }
  },
  computed: {
    items() {
      return this.filteredNewsArr.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      )
    },
    rows() {
      return this.filteredNewsArr.length
    },
    timeQueryText() {
      return this.queryTimeSelected.length > 0 ? this.timeQueries.find(e => e[0] === this.queryTimeSelected)[1] : '時間'
    },
    categoryText() {
      return this.categorySelected.length > 0 ? this.categorySelected : '主題分類'
    }
  },
  methods: {
    async handleSearch() {
      this.filteredNewsArr = this.newsArr
      if (this.keyword === '') return
      await this.searchArticles()
      this.filteredNewsArr = this.newsArr
      this.sentKeyword = this.keyword
      this.resultCount = this.filteredNewsArr.length
    },
    handleArticleRoute(_id) {
      if (!_id) return
      this.$router.push({ path: `/article/${_id}` })
    },
    formatLastUpdate(lastUpdatedAt) {
      if (!lastUpdatedAt) return '3小時'
      else return moment(lastUpdatedAt).toNow(true)
    },
    handleChange(page) {
      if (page !== this.currentPage) {
        window.scrollTo(0, 0)
      }
    },
    async searchArticles() {
      // Search for news
      this.newsArr = []
      if (this.keyword) {
        try {
          this.isLoading = true
          const { data } = await searchArticles(
            {
              q: this.keyword,
              tbs: this.queryTimeSelected,
              category: this.categorySelected
            }
          )
          const type = data.type
          // const payload = data.data
          if (type === 'success') {
            // need to change
            const articles = data.data.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
            articles.forEach(article => {
              const { category, _id, title, viewsCount, tags, lastUpdatedAt, editedCount, blocks } = article
              this.newsArr.push({
                category, _id, title, viewsCount, tags, lastUpdatedAt, editedCount, blocks
              })
            })
            this.filteredNewsArr = this.newsArr
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
  &:active, &:focus {
    border: 1px solid $blue !important;
  }
  &::placeholder{
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
      &:active {
        color: $blue !important;
      }
    }
  }

}

</style>
