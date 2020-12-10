<template>
  <div>
    <b-container fluid="xl" class="search-bar-field d-flex flex-column justify-content-center">
      <b-row align-h="center">
        <b-col cols="8" class="d-flex justify-content-between search-bar px-1">
          <b-form-input type="text" placeholder="搜尋..." debounce="300" class="pl-1" />
          <img src="@/assets/images/search-icon.svg">
        </b-col>
      </b-row>
      <b-row class="mt-3" align-h="center">
        <b-col cols="8" class="d-flex justify-content-between">
          <div>
            <b-dropdown id="dropdown-time" variant="outline-primary" text="發布時間" class="mr-3" toggle-class="rounded-pill">
              <b-dropdown-item>昨天</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>前一週</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>前一個月</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>前半年</b-dropdown-item>
            </b-dropdown>
            <b-dropdown id="dropdown-source" variant="outline-primary" text="新聞來源" class="mr-3" toggle-class="rounded-pill">
              <b-dropdown-item>蘋果日報</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>中天新聞</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>中央社</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>報導者</b-dropdown-item>
            </b-dropdown>
            <b-dropdown id="dropdown-category" variant="outline-primary" text="主題分類" class="mr-3" toggle-class="rounded-pill">
              <b-dropdown-item>財經</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>國際</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>社會</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>科技</b-dropdown-item>
            </b-dropdown>
          </div>
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
              /><span>{{ news.viewCount }} 個人正在閱讀</span>
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
      @change="handleChange"
    />
    <Footer />
  </div>
</template>

<script>
import moment from 'moment'
import Footer from '@/components/Footer'
import { getArticles } from '@/api/article'
export default {
  name: 'Search',
  components: {
    Footer
  },
  data() {
    return {
      perPage: 12,
      currentPage: 1,
      newsArr: []
    }
  },
  computed: {
    items() {
      return this.newsArr.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      )
    },
    rows() {
      return this.newsArr.length
    }
  },
  created() {
    getArticles().then(response => {
      const { data } = response
      if (data.code === 200) {
        const articles = data.data.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
        articles.forEach(article => {
          const { category, _id, title, lastUpdatedAt } = article
          this.newsArr.push({
            _id, category, title, lastUpdatedAt, viewCount: 32
          })
        })
      }
    }).catch(err => console.error(err))
  },
  methods: {
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
