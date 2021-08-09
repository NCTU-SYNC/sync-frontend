<template>
  <b-container fluid="xl">
    <b-row class="category-navbar">
      <b-col>
        <b-nav
          align="center"
        >
          <b-nav-item
            v-for="(category, index) in categoryList"
            :key="index"
            class="px-3"
            link-classes="category-item"
            @click="handleCategoryRoute(category)"
          >
            {{ category }}
          </b-nav-item>
        </b-nav>
      </b-col>
    </b-row>
    <div class="d-flex justify-content-center">
      <b-row v-if="headline.blocks" style="max-width: 1024px" class="flex-md-nowrap">
        <HeadlineCard
          :category="headline.category"
          :title="headline.title"
          :views-count="headline.viewsCount"
          :tags="headline.tags.slice(0,4)"
          :last-updated-at="headline.lastUpdatedAt"
          :edited-count="headline.editedCount"
          :blocks="headline.blocks"
          :news-id="headline._id"
        />
        <b-col class="headline-border px-5 px-md-4">
          <b-row no-gutters class="h-100">
            <b-col class="h-100 pt-5">
              <div class="hot-tags-title mb-3">熱門標籤</div>
              <div v-for="(tag,tagIndex) in tags" :key="tagIndex" class="article-tag mb-3">
                # {{ tag }}
              </div>

            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
    <div v-for="(section,sectionIndex) in allArticles" :key="sectionIndex">
      <b-row class="py-5 heading-bar">
        <b-col class="d-flex justify-content-center align-items-center">
          <icon :icon="section.iconPath" class="mr-3" />
          <h1 class="home-heading">{{ section.title }}</h1>
        </b-col>
      </b-row>
      <div
        class="d-flex justify-content-center"
      >
        <b-row cols-sm="1" cols-md="2" cols-lg="3" style="max-width:1024px;">
          <ArticleCard
            v-for="(news, newsIndex) in section.content"
            :key="newsIndex"
            :category="news.category"
            :title="news.title"
            :views-count="news.viewsCount"
            :tags="news.tags.slice(0,2)"
            :last-updated-at="news.lastUpdatedAt"
            :edited-count="news.editedCount"
            :blocks="news.blocks"
            :news-id="news._id"
          />
        </b-row>
      </div>
      <b-row>
        <b-col class="d-flex justify-content-center mt-4 mb-5" no-gutters>
          <b-button squared variant="outline-blue">閱讀更多</b-button>
        </b-col>
      </b-row>
    </div>

  </b-container>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue'
import HeadlineCard from '@/components/Headline.vue'
import { getArticles, searchArticles } from '@/api/article'
export default {
  name: 'Home',
  components: {
    ArticleCard, HeadlineCard
  },
  data() {
    return {
      categoryList: ['即時', '政經', '國際', '社會', '科技', '環境', '生活', '運動'],
      allArticles: [],
      latestList: [],
      exploreList: [],
      hotList: [],
      headline: {},
      iconPaths: ['latest', 'hot', 'explore'],
      tags: ['COVID-19', '疫苗', '比特幣', '國光', '想畢業', '瘋掉']
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
        const latestArticles = {
          content: []
        }
        articles.forEach(article => {
          const { category, _id, title, viewsCount, tags, lastUpdatedAt, editedCount, blocks, newsId } = article
          latestArticles.content.push({
            _id, category, title, viewsCount, tags, lastUpdatedAt, editedCount, blocks, newsId
          })
        })
        const articlesHot = data.data[0].sort((a, b) => b.viewsCount - a.viewsCount)
        this.latestList = latestArticles.content.slice(0, 6)
        this.hotList = articlesHot.slice(0, 6)
        this.exploreList = this.getRandomArticles(latestArticles.content, 6)
        this.headline = this.exploreList[0]
        this.allArticles = [{ title: '最新同步', content: this.latestList, iconPath: this.iconPaths[0] },
          { title: '熱門同步', content: this.hotList, iconPath: this.iconPaths[1] },
          { title: '探索其他', content: this.exploreList, iconPath: this.iconPaths[2] }]
      }
    }).catch(err => console.error(err))
  },
  methods: {
    handleCategoryRoute(categoryParam) {
      if (this.$route.query.category !== categoryParam) {
        this.$router.push({ query: { category: categoryParam }})
      } else {
        this.getCategoryArticles(categoryParam)
      }
    },
    getRandomArticles(arr, n) {
      var result = new Array(n)
      var len = arr.length
      var taken = new Array(len)
      if (n > len) { throw new RangeError('getRandomArticles: more elements taken than available') }
      while (n--) {
        var x = Math.floor(Math.random() * len)
        result[n] = arr[x in taken ? taken[x] : x]
        taken[x] = --len in taken ? taken[len] : len
      }
      return result
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
          console.log(data)
          const type = data.type
          if (type === 'success') {
            const articles = data.data.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
            articles.forEach(article => {
              const { category, _id, title, viewsCount, tags, lastUpdatedAt, editedCount, blocks, newsId } = article
              categoricNews.push({
                category, _id, title, viewsCount, tags, lastUpdatedAt, editedCount, blocks, newsId
              })
            })
            this.allArticles = [{ title: param + '同步', content: categoricNews, iconPath: this.iconPaths[0] }]
            this.headline = this.getRandomArticles(categoricNews, 1)[0]
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

<style lang="scss" scoped>
@import '@/assets/scss/news.scss';
.category-navbar{
  border-bottom: 1px solid $gray-light;
}

.category-item{
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 8px;
  color: #232323;
}

.home-heading{
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 47px;
  letter-spacing: 0.5em;
  color: #000000;
  margin: 0;
}

.btn-outline-blue{
  color: $blue;
  border: 2px solid $blue;
  font-size: 20px;
  width: 130px;
  letter-spacing: 0.2em;
  text-align: center;
  text-indent: 0.2em;
}

.btn-outline-blue:active, .btn-outline-blue:hover{
  color: $white;
  background:$blue;
  border: 2px solid $blue;
  font-size: 20px;
}

.heading-bar{
  border-top: 1px solid $gray-light;
}
.headline-heading{
  font-family: Noto Sans CJK TC;
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 47px;
  letter-spacing: 4px;
  margin-bottom: 0px;
}

.hot-tags-title{
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 4px;
}

.headline-border{
  border-left: 1px solid $gray-light;
}
</style>

