<template>
  <b-container>
    <b-card-group deck>
      <div
        v-for="article in articles"
        :key="article.lastUpdatedAt"
        class="mx-auto pt-5"
      >
        <b-link
          v-if="article._id"
          :to="{ name: 'Article', params: { ArticleID: article._id }}"
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
      const { data } = response
      console.log(data)
      if (data.code === 200) {
        this.articles = data.data
        this.articles.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
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
