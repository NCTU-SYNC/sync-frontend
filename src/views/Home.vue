<template>
  <b-container fluid>
    <category-bar />
    <div class="d-flex justify-content-center">
      <div
        v-if="headline.length > 0"
        style="width: 1024px"
        class="flex-md-nowrap"
      >
        <HeadlineCard
          :category="headline[pickedHeadline].category"
          :title="headline[pickedHeadline].title"
          :views-count="headline[pickedHeadline].viewsCount"
          :tags="headline[pickedHeadline].tags.slice(0, 4)"
          :last-updated-at="headline[pickedHeadline].lastUpdatedAt"
          :edited-count="headline[pickedHeadline].editedCount"
          :blocks="headline[pickedHeadline].blocks"
          :news-id="headline[pickedHeadline]._id"
        />
        <div class="headline-pages">
          <input
            v-for="(article, articleIndex) in headline.length"
            :key="articleIndex"
            v-model="pickedHeadline"
            class="headline-page-button"
            :value="articleIndex"
            type="radio"
            @click="resetTimer()"
          >
        </div>
      </div>
    </div>
    <div v-for="(section, sectionIndex) in allArticles" :key="sectionIndex">
      <b-row class="py-5 heading-bar">
        <b-col class="d-flex justify-content-center align-items-center">
          <icon :icon="section.iconPath" class="mr-3" />
          <h1 class="home-heading">{{ section.title }}</h1>
        </b-col>
      </b-row>
      <div class="d-flex justify-content-center">
        <b-row
          cols="1"
          :cols-md="Math.min(2, section.content.length)"
          :cols-lg="Math.min(3, section.content.length)"
          style="max-width: 1024px"
        >
          <ArticleCard
            v-for="(news, newsIndex) in section.content"
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
      <b-row>
        <b-col class="d-flex justify-content-center mt-4 mb-5" no-gutters>
          <b-button squared variant="outline-blue">閱讀更多</b-button>
        </b-col>
      </b-row>
    </div>
    <RecommendHashtag />

  </b-container>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue'
import HeadlineCard from '@/components/Headline.vue'
import CategoryBar from '@/components/CategoryBar.vue'
import RecommendHashtag from '@/components/RecommendHashtag.vue'
import articleAPI from '@/api/article'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    ArticleCard,
    HeadlineCard,
    CategoryBar,
    RecommendHashtag
  },
  data() {
    return {
      categoryList: ['政經', '國際', '社會', '科技', '環境', '生活', '運動'],
      allArticles: [],
      latestList: [],
      exploreList: [],
      hotList: [],
      headline: [],
      iconPaths: ['latest', 'hot', 'explore'],
      pickedHeadline: 0,
      headlineTimer: null,
      HEADLINEINTERVAL: 5000
    }
  },
  computed: {
    ...mapGetters([
      'isLogin'
    ])
  },
  watch: {
    '$route.query.category'() {
      if (this.$route.query.category) {
        this.getCategoryArticles(this.$route.query.category)
      } else this.initializeHomepage()
    }
  },
  created() {
    if (this.$route.query.category) {
      this.getCategoryArticles(this.$route.query.category)
    } else this.initializeHomepage()
  },
  beforeDestroy() {
    clearInterval(this.headlineTimer)
  },
  methods: {
    async initializeHomepage() {
      await articleAPI
        .get()
        .then((response) => {
          const { data } = response
          if (data.code === 200) {
            const articles = data.data[0].sort(
              (a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)
            )
            const latestArticles = {
              content: []
            }
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
              latestArticles.content.push({
                _id,
                category,
                title,
                viewsCount,
                tags,
                lastUpdatedAt,
                editedCount,
                blocks
              })
            })
            const articlesHot = data.data[0].sort(
              (a, b) => b.viewsCount - a.viewsCount
            )
            this.latestList = latestArticles.content.slice(0, 6)
            this.hotList = articlesHot.slice(0, 6)
            this.exploreList = this.getRandomArticles(
              latestArticles.content,
              Math.min(6, latestArticles.content.length)
            )
            this.headline = this.exploreList.slice(0, 5)
            this.allArticles = [
              {
                title: '最新同步',
                content: this.latestList,
                iconPath: this.iconPaths[0]
              },
              {
                title: '熱門同步',
                content: this.hotList,
                iconPath: this.iconPaths[1]
              },
              {
                title: '探索其他',
                content: this.exploreList,
                iconPath: this.iconPaths[2]
              }
            ]
          }
        })
        .catch((err) => console.error(err))
      this.resetTimer()
    },
    getRandomArticles(arr, n) {
      var result = new Array(n)
      var len = arr.length
      var taken = new Array(len)
      if (n > len) {
        throw new RangeError(
          'getRandomArticles: more elements taken than available'
        )
      }
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
          const { data } = await articleAPI.search(undefined, undefined, param)
          const type = data.type
          if (type === 'success') {
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
              categoricNews.push({
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
            this.allArticles = [
              {
                title: param + '同步',
                content: categoricNews,
                iconPath: this.iconPaths[0]
              }
            ]
            this.headline = this.getRandomArticles(
              categoricNews,
              Math.min(5, categoricNews.length)
            )
            this.resetTimer()
          } else {
            throw new Error(data.message)
          }
        } catch (error) {
          console.error(error.message)
          this.$bvModal.msgBoxOk(error.message)
          this.$router.push({ path: '/' })
        }
      }
    },
    resetTimer() {
      if (this.headlineTimer !== null) clearInterval(this.headlineTimer)
      this.headlineTimer = setInterval(() => {
        this.pickedHeadline += 1
        this.pickedHeadline %= Math.min(this.headline.length, 5)
      }, this.HEADLINEINTERVAL)
      this.pickedHeadline = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/news.scss';
// .category-navbar{
//   border-bottom: 1px solid $gray-light;
// }

// .category-item{
//   font-size: 20px;
//   line-height: 30px;
//   letter-spacing: 8px;
//   color: #232323;
//   &:hover{
//     color: $blue !important;
//   }
// }

.home-heading {
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 47px;
  letter-spacing: 0.5em;
  color: #000000;
  margin: 0;
}

.btn-outline-blue {
  color: $blue;
  border: 2px solid $blue;
  font-size: 20px;
  width: 130px;
  letter-spacing: 0.2em;
  text-align: center;
  text-indent: 0.2em;
}

.btn-outline-blue:active,
.btn-outline-blue:hover {
  color: $white;
  background: $blue;
  border: 2px solid $blue;
  font-size: 20px;
}

.heading-bar {
  border-top: 1px solid $gray-light;
}

.headline-pages {
  text-align: center;
  margin-top: 38px;
  margin-bottom: 64px;
}

.headline-page-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  background-color: $gray-light;
  border: none !important;
  height: 12px;
  width: 12px;
  margin: 0 8px;
  cursor: pointer;
}

.headline-page-button:checked {
  background-color: $red;
}

.hot-tags-title {
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 4px;
}

.headline-border {
  border-left: 1px solid $gray-light;
}

.topic-recommend {
  position: relative;
  height: 424px;
  margin: 0 -15px;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.4;
    background-image: url('../../src/assets/images/TopicRecommendBG.svg');
  }

  .title{
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 2px;
  }

  .content{
    margin: 32px 0;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
  }
}

</style>
