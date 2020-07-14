<template>
  <b-container>
    <b-card-group deck>
      <b-link
        v-for="article in articles"
        :key="article.lastUpdatedAt"
        class="mx-auto pt-5"
        :to="{ name: 'Article', params: { ArticleID: article._id }}"
      >
        <b-card
          no-body
          :title="article.title"
          img-src="https://picsum.photos/600/300/?image=25"
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
    </b-card-group>
  </b-container>
</template>

<script>
import { getArticles } from '@/api/article'

export default {
  name: 'Home',
  data() {
    return {
      articles: [

      ]
    }
  },
  created() {
    getArticles().then(response => {
      console.log(response)
      if (response.data.code === 200) {
        this.articles = response.data.data
        console.log(this.articles)
        this.articles.sort((a, b) => new Date(a.lastUpdatedAt) - new Date(b.lastUpdatedAt))
      }
    }).catch(err => console.error(err))
  }
}
</script>

<style scoped>
  a {
    color: gray;
    text-decoration: none;
  }
</style>
