<template>
  <b-card>
    <b-input-group class="mt-3" style="margin-bottom: 20px;">
      <b-form-input
        v-model="searchKeyword"
        placeholder="搜尋新聞"
      />
      <b-input-group-append>
        <b-button variant="outline-secondary" @click="getNews">搜尋</b-button>
      </b-input-group-append>
    </b-input-group>
    <b-row align-h="start">
      <b-col sm="3">
        <b-dropdown variant="outline-secondary" text="時間" disabled>
          <b-dropdown-item>2020/7/4</b-dropdown-item>
          <b-dropdown-item>2020/7/5</b-dropdown-item>
        </b-dropdown>
      </b-col>
      <b-col sm="3">
        <b-dropdown variant="outline-secondary" text="新聞來源" disabled>
          <b-dropdown-item>三立</b-dropdown-item>
          <b-dropdown-item>中天</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <div v-for="(news, index) in newsList" :key="index" style="margin-top: 0.75rem;">
      <NewsCard :title="news.title" :outline="getNewsOutline(news.content)" :content="news.content" :url="news.url" @importNews="emitToEditPage" />
    </div>
  </b-card>
</template>

<script>
import { getNews } from '@/api/news'
import NewsCard from '@/components/Post/NewsCard'
export default {
  name: 'NewsPanel',
  components: {
    NewsCard
  },
  data() {
    return {
      searchKeyword: '',
      newsList: []
    }
  },
  methods: {
    emitToEditPage(content) {
      this.$emit('importNews', content)
    },
    getNews() {
      getNews({ q: this.searchKeyword }).then(
        response => {
          this.newsList = response.data.data
          console.log(response.data)
        }
      )
    },
    getNewsOutline(newsContent) {
      var str = ''
      newsContent.forEach(
        (text, i) => {
          if (i === 0) { return }
          str += text + ' '
        })
      return str.substring(0, 120) + ' ...'
    }
  }
}
</script>

<style>

</style>
