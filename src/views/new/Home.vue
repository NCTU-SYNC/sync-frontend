<template>
  <b-container fluid="xl">
    <b-row class="sync-category-navbar">
      <b-col>
        <b-nav
          align="center"
        >
          <b-nav-item
            v-for="(category, index) in categoryList"
            :key="index"
            class="px-2 text-black"
            @click="handleCategoryRoute(category)"
          >
            {{ category }}
          </b-nav-item>
        </b-nav>
      </b-col>
    </b-row>
    <b-row class="sync-row py-3">
      <b-col class="d-flex justify-content-center">
        <b-row>
          <b-col
            cols="9"
            class="d-flex flex-grow-1 p-3"
          >
            <b-col cols="6">
              <h4>即時熱編</h4>
              <h2>台灣每日新增新官肺炎總表</h2>
              <span class="text-muted">更新於3小時前 </span>
              <span class="text-muted">32個人正在閱讀</span>
              <p class="mt-3">
                中央流行疫情指揮中心7日由發言人莊人祥公布國內新增1例境外移入新冠肺炎（武漢肺炎）病例，為本國籍20多歲男性（案494），今年2月至尼泊爾參加宗教活動，3日與友人一同返國，並在7日確診。
              </p>
            </b-col>
            <b-col
              cols="6"
              class="sync-hot-news-img ml-2"
            >
              <b-aspect
                aspect="4:3"
                style="overflow: hidden;"
              >
                <b-img-lazy
                  fluid
                  src="http://fakeimg.pl/800x600?text=圖片&font=noto"
                  alt="Image"
                />
              </b-aspect>
            </b-col>
          </b-col>
          <b-col
            cols="3"
            class="sync-hot-tags px-4 py-3"
          >
            <h4>熱門標籤</h4>
            <div class="d-flex flex-column align-items-start">
              <b-button
                v-for="(tag, index) in hotTags"
                :key="index"
                class="mt-3"
                variant="outline-secondary"
                pill
              >
                # {{ tag }}
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row
      v-for="(newsBlock, newsBlockIndex) in newsList"
      :key="newsBlockIndex"
      class="sync-row mt-3 py-2 d-flex flex-column"
    >
      <h2 class="category-title">
        {{ newsBlock.title }}
      </h2>
      <div class="p-3 news-grid">
        <b-link
          v-for="(news, newsIndex) in newsBlock.content"
          :key="newsIndex"
        >
          <div
            class="pb-4"
            @click="handleArticleRoute(news._id)"
          >
            <p class="news-category">
              {{ getCategory(news) }}
            </p>
            <p class="news-title">
              {{ news.title }}
            </p>
            <div class="news-info">
              <span class="mr-3">{{ `更新於 ${formatLastUpdate(news.lastUpdatedAt)} 前` }}</span>
              <b-icon
                icon="eye-fill"
                class="mr-1"
              />
              <span>{{ news.viewsCount }} 次觀看</span>
            </div>
          </div>
        </b-link>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment'
import { getArticles, searchArticles } from '@/api/article'
export default {
  name: 'Home',
  data() {
    return {
      categoryList: ['即時', '政經', '國際', '社會', '科技', '環境', '生活', '運動'],
      hotTags: ['台海危機', '美國大選', '振興三倍券', '新冠病毒', '美國豬牛', '黃鴻升'],
      newsList: []
    }
  },
  watch: {
    '$route.query.category'() {
      this.getCategoryArticles(this.$route.query.category)
    }
  },
  created() {
    getArticles().then(response => {
      const { data } = response
      if (data.code === 200) {
        const articles = data.data[0].sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
        const realNews = {
          title: '未分類新聞',
          content: []
        }
        articles.forEach(article => {
          const { category, _id, title, lastUpdatedAt, viewsCount } = article
          realNews.content.push({
            _id, category, title, lastUpdatedAt, viewsCount
          })
        })
        this.newsList = [{
          title: '最新新聞',
          content: data.data[1]
        },
        {
          title: '熱門新聞',
          content: data.data[1]
        },
        {
          title: '推薦您的新聞',
          content: data.data[1]
        }, realNews]
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
    getCategory(news) {
      const { category } = news
      if (typeof category === 'string') {
        return category
      } else if (Array.isArray(category)) {
        if (category.length === 0) { return '未分類' } else return category.join(', ')
      }
    },
    handleCategoryRoute(categoryParam) {
      if (this.$route.query.category !== categoryParam) {
        this.$router.push({ query: { category: categoryParam }})
      } else {
        this.getCategoryArticles(categoryParam)
      }
    },
    async getCategoryArticles(param) {
      if (param) {
        try {
          const categoricNews = []
          const { data } = await searchArticles(
            {
              category: param
            }
          )
          const type = data.type
          if (type === 'success') {
            const articles = data.data.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
            articles.forEach(article => {
              const { category, _id, title, lastUpdatedAt, viewsCount } = article
              categoricNews.push({
                _id, category, title, lastUpdatedAt, viewsCount
              })
            })
            this.newsList = [{
              title: param,
              content: categoricNews
            }]
          } else {
            throw new Error(data.message)
          }
        } catch (error) {
          console.error(error.message)
          this.$bvModal.msgBoxOk(error.message)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/news.scss';

.sync-category-navbar {
  border-bottom: 1px solid $gray-900;
  a {
    font-weight: bold;
    font-size: 1.5rem;
  }
}

.sync-hot-news-img {
  display: flex;
  align-items: center;
}

.sync-hot-tags {
  border-left: 1px solid $gray-500;
}

.tag-link {
  border-radius: 1.5rem;
  border: 1px solid $gray-900;
}

.category-title {
  color: $black;
  text-align: center;
  letter-spacing: 1rem;
  padding: 1.5rem;
}
</style>
