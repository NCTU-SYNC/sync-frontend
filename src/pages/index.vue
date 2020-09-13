<template>
  <b-container>
    <b-card-group
      v-if="articles.length !== 0"
      deck
    >
      <div
        v-for="article in articles"
        :key="article.lastUpdatedAt"
        class="mx-auto pt-5"
      >
        <b-link
          v-if="article._id"
          :to="{ name: 'article-ArticleID', params: { ArticleID: article._id }}"
          :prefetch="true"
        >
          <b-card
            no-body
            :title="article.title"
            img-src="http://fakeimg.pl/600x300?text=圖片&font=noto"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            border-variant="light"
            class="mx-auto"
          >
            <b-card-body>
              <b-card-text>
                {{ article.title }}
              </b-card-text>
            </b-card-body>
            <b-card-footer>編輯次數：{{ article.editedCount }}</b-card-footer>
          </b-card>
        </b-link>
      </div>
    </b-card-group>
    <h1 v-else>
      暫時無文章
    </h1>
  </b-container>
</template>

<script>
import { getArticles } from '@/api/article'

export default {
  name: 'Home',
  async asyncData () {
    const { data } = await getArticles()
    const articles = data.data
    return {
      articles: articles.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
    }
  },
  data () {
    return {
      articles: []
    }
  }
}
</script>

<style scoped lang="scss">
  a {
    color: gray !important;
    text-decoration: none !important;
  }

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
