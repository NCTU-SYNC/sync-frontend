<template>
  <div>
    <b-container fluid="xl" class="search-bar-field d-flex flex-column justify-content-center">
      <b-row align-h="center">
        <b-col cols="8" class="d-flex justify-content-between search-bar px-1">
          <b-form-input
            v-model="keyword"
            type="text"
            placeholder="搜尋..."
            class="pl-1"
            @keyup.enter="searchArticles"
          />
          <!-- @input="handleSearch" -->
          <b-button
            variant="link"
            :disabled="keyword.length === 0 || isLoading"
            @click="searchArticles"
          >
            <img :src="require('@/assets/images/search-icon.svg').default">
          </b-button>
        </b-col>
      </b-row>
      <b-row class="mt-3" align-h="center">
        <b-col cols="8" class="d-flex justify-content-between">
          <div>
            <b-dropdown
              id="dropdown-time"
              variant="outline-primary"
              toggle-class="rounded-pill px-4"
            >
              <template v-slot:button-content>
                {{ timeQueryText }}
              </template>
              <slot v-for="timeQuery in timeQueries">
                <b-dropdown-item @click="onTimeDropdownClicked(timeQuery[0])">{{ timeQuery[1] }}</b-dropdown-item>
              </slot>
            </b-dropdown>
            <b-dropdown
              id="dropdown-category"
              class="ml-2"
              variant="outline-primary"
              toggle-class="rounded-pill px-4"
            >
              <template v-slot:button-content>
                {{ categoryText }}
              </template>
              <slot v-for="categoryQuery in categoryQueries">
                <b-dropdown-item @click="onCategoryDropdownClicked(categoryQuery)">{{ categoryQuery }}</b-dropdown-item>
              </slot>
            </b-dropdown>
          </div>
          <!-- edit -->
          <b-dropdown id="dropdown-sort" variant="outline-primary" text="排列方式" class="mr-4" toggle-class="rounded-pill">
            <b-dropdown-item>最相關</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item>最熱門</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item>最新的</b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid="xl">
      <div class="p-3 news-grid">
        <b-link
          v-for="(news, newsIndex) in items"
          :key="newsIndex"
        >
          <div
            class="pb-4"
            @click="handleArticleRoute(news._id)"
          >
            <p class="news-category">
              {{ news.category }}
            </p>
            <p class="news-title">
              {{ news.title }}
            </p>
            <div class="news-info">
              <span class="mr-3">{{ `更新於 ${formatLastUpdate(news.lastUpdatedAt)} 前` }}</span>
              <b-icon
                icon="eye-fill"
                class="mr-1"
              /><span>{{ news.viewsCount }} 次觀看</span>
            </div>
          </div>
        </b-link>
      </div>
    </b-container>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="center"
      hide-goto-end-buttons
      @change="handleChange"
    />
    <!-- <Footer /> -->
  </div>
</template>

<script>
import moment from 'moment'
import { searchArticles } from '@/api/article'
export default {
  name: 'Search',
  components: {
  },
  data() {
    return {
      keyword: '',
      perPage: 12,
      currentPage: 1,
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
    handleSearch() {
      this.filteredNewsArr = this.newsArr
      if (this.keyword === '') return
      this.filteredNewsArr = this.newsArr.filter(news => news.title.includes(this.keyword))
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
              const { category, _id, title, lastUpdatedAt, viewsCount } = article
              this.newsArr.push({
                _id, category, title, lastUpdatedAt, viewsCount
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

.search-bar-field {
  height: 20vh;
  background: #F3F3F3;
  .search-bar {
    border-bottom: 1px solid $gray;
  }
}
input, input:focus {
  border: 0px !important;
  background: transparent;
  font-size: 1.8em;
  font-family: 'Noto Sans CJK TC';
  font-weight: medium;
}
</style>
