<template>
  <div>
    <MotionBanner v-if="!isLogin" />
    <div v-if="doneInit" class="main-container">
      <div class="container_block">
        <div class="section_title">
          {{ category }}
        </div>
        <HomeBanner
          :title="articleBanner.title"
          :tags="articleBanner.tags.slice(0, 4)"
          :last-updated-at="articleBanner.lastUpdatedAt"
          :blocks="articleBanner.blocks"
          :news-id="articleBanner._id"
        />
        <div class="gallery">
          <ArticleCard
            v-for="(article, index) in articlesLatest"
            :key="index"
            :category="article.category"
            :title="article.title"
            :views-count="article.viewsCount"
            :tags="article.tags.slice(0, 2)"
            :blocks="article.blocks"
            :article-id="article._id"
            :lg="lg"
          />
        </div>
      </div>
    </div>

    <RecommendHashtag />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleCard from '@/components/ArticleCard.vue'
import HomeBanner from '@/components/HomeBanner.vue'
import RecommendHashtag from '@/components/RecommendHashtag.vue'
import MotionBanner from '@/components/MotionBanner.vue'
import articleAPI from '@/api/article'

function makeArticle(article = {}) {
  return {
    _id: article._id ?? '',
    title: article.title ?? '',
    tags: article.tags ?? [],
    lastUpdatedAt: article.lastUpdatedAt ?? '',
    blocks: article.blocks ?? [],
    editedCount: article.editedCount ?? 0,
    category: article.category ?? ''
  }
}

export default {
  name: 'HomeTopic',
  components: {
    ArticleCard,
    HomeBanner,
    RecommendHashtag,
    MotionBanner
  },

  props: {
    category: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      articleBanner: {},
      articlesLatest: [],
      dragPos: { left: 0, x: 0 },
      isDragging: false,
      doneInit: false
    }
  },

  computed: {
    ...mapGetters(['windowWidth', 'isLogin']),
    md() {
      return this.windowWidth < 1280 && this.windowWidth >= 680
    },
    lg() {
      return this.windowWidth >= 1280
    }
  },

  created() {
    this.getArticle()
  },
  methods: {
    async getArticle() {
      try {
        const { data } = await articleAPI.search(undefined, undefined, this.$props.category)

        if (data.code === 404) {
          console.log('no article found')
          this.$root.$bvToast.show('toast-article-not-found')
          this.$router.push('/')
          return
        }

        if (data.code !== 200) return

        const articleSortedLatest = data.data.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
        this.articlesLatest = articleSortedLatest.slice(1, 13).map((article) => makeArticle(article))

        this.articleBanner = makeArticle(articleSortedLatest[0])
      } catch (e) {
        console.error(e)
      } finally {
        this.doneInit = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/news.scss';

.main-container {
  display: flex;
  flex-direction: column;
  max-width: 1240px;
  margin: 4rem auto;
  padding: 0 1.25rem;
  box-sizing: content-box;
  gap: 4rem;

  @media screen and (max-width: 679px) {
    margin-top: 2.5rem;
  }
}

.container_block {
  display: block;
}

.section {
  &_title {
    font-size: 2rem;
    font-weight: 700;
    line-height: 2.5rem;
    letter-spacing: 2px;
    margin-bottom: 2rem;
  }
}

.gallery {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(3, 1fr);
  gap: 2rem;
  margin: 0 auto;
  width: calc(calc(392px * 3) + calc(2rem * 2));

  @media screen and (max-width: 1279px) {
    grid-template: repeat(3, 1fr) / repeat(2, 1fr);
    width: calc(304px + 304px + 2rem);
  }

  @media screen and (max-width: 679px) {
    grid-template-rows: repeat(6, 1fr);
    grid-template-columns: 1fr;
    width: calc(304px);
  }

  &__wider {
    width: 1444px;

    @media screen and (max-width: 1279px) {
      grid-template: 1fr 1fr / 1fr 1fr 1fr;
      width: calc(calc(304px * 3) + calc(2rem * 2));
    }

    @media screen and (max-width: 679px) {
      grid-template-rows: repeat(6, 1fr);
      grid-template-columns: 1fr;
      width: calc(304px);
    }
  }
}

.scrollable {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding: 0 calc(50vw - 50%);
  overflow-x: auto;

  /* un-cuts shadow */
  padding-top: 20px;
  padding-bottom: 20px;
  margin-top: -20px;
  margin-bottom: -20px;

  /* Hide ScrollBar */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
}
</style>
