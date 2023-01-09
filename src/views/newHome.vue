<template>
  <div class="main-container">
    <div class="section_title">
      焦點內容
    </div>
    <!-- <HomeBanner
      :title="articleBanner.title"
      :tags="articleBanner.tags.slice(0, 4)"
      :last-updated-at="articleBanner.lastUpdatedAt"
      :blocks="articleBanner.blocks"
      :news-id="articleBanner._id"
    /> -->
    <div class="gallery">
      <ArticleCard
        v-for="(article, index) in articlesLatest"
        :key="index"
        :category="article.category"
        :title="article.title"
        :views-count="article.viewsCount"
        :tags="article.tags.slice(0, 2)"
        :last-updated-at="article.editedCount"
        :blocks="article.blocks"
        :article-id="article._id"
        :lg="lg"
      />
    </div>
    <div class="section_title">等待編輯</div>
    <div
      class="gallery"
      :class="{ 'gallery__wider': lg }"
    >
      <AwaitEditCard
        v-for="(article, index) in articlesLatest"
        :key="index"
        :category="article.category"
        :title="article.title"
        :views-count="article.viewsCount"
        :tags="article.tags.slice(0, 2)"
        :last-updated-at="article.editedCount"
        :blocks="article.blocks"
        :article-id="article._id"
        :lg="lg"
      />
    </div>
    <div class="section_title">熱門內容</div>
    <div class="gallery">
      <ArticleCard
        v-for="(article, index) in articlesHot"
        :key="index"
        :category="article.category"
        :title="article.title"
        :views-count="article.viewsCount"
        :tags="article.tags.slice(0, 2)"
        :last-updated-at="article.editedCount"
        :blocks="article.blocks"
        :article-id="article._id"
        :lg="lg"
      />
    </div>
  </div>
</template>

<script>
import articleAPI from '@/api/article'
import ArticleCard from '@/components/ArticleCard.vue'
import AwaitEditCard from '@/components/AwaitEditCard.vue'
import HomeBanner from '@/components/HomeBanner.vue'

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
  name: 'newHome',
  components: {
    ArticleCard,
    AwaitEditCard,
    HomeBanner
  },
  data() {
    return {
      articleBanner: makeArticle(),
      articlesLatest: [],
      articlesHot: [],
      windowWidth: window.innerWidth
    }
  },
  created() {
    this.getArticle()
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth
        console.log('size changed')
      })
    })
  },
  computed: {
    lg() {
      return this.windowWidth >= 1280
    }
  },
  methods: {
    async getArticle() {
      await articleAPI.get().then((response) => {
        const { data } = response

        if (data.code !== 200) return

        const articleSortedLatest = data.data[0].sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
        this.articlesLatest = articleSortedLatest.slice(0, 6).map((article) => makeArticle(article))

        const articleSortedHot = data.data[1].sort((a, b) => b.viewsCount - a.viewsCount)
        this.articlesHot = articleSortedHot.slice(1, 7).map((article) => makeArticle(article))

        this.articleBanner = makeArticle(articleSortedHot[0])
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/news.scss';

.main-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 1.25rem;
  box-sizing: content-box;
}

.section {
  &_title {
    font-size: 2rem;
    font-weight: 700;
    line-height: 2.5rem;
    letter-spacing: 2px;
    margin: 2rem 0;
  }
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 0 auto;

  &__wider {
    width: 1444px;
  }
}
</style>
