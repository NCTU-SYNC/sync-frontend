<template>
  <b-card class="border-0 pt-3">
    <div class="w-100 d-flex justify-content-start">
      <div class="search-news-container mr-2 flex-grow-1">
        <b-form-input
          id="search-news"
          v-model="searchKeyword"
          class="border-0"
          placeholder="搜尋新聞"
        />
        <div />
        <b-button
          class="mr-1"
          variant="link"
          @click="getNews"
        >
          <b-icon icon="search" />
        </b-button>
      </div>
      <div class="search-news-container">
        <b-button
          variant="link"
        >
          <b-icon icon="chevron-left" />
        </b-button>
        <div />
        <b-button
          variant="link"
        >
          <b-icon icon="chevron-right" />
        </b-button>
      </div>
    </div>

    <label
      class="text-secondary"
      for="search-news"
    >
      尋找新聞並加到編輯區（建立連結）
    </label>
    <b-row>
      <b-col>
        <b-dropdown
          variant="outline-primary"
          toggle-class="badge-pill px-4"
        >
          <template v-slot:button-content>
            時間
          </template>
          <b-dropdown-item>過去 1 小時</b-dropdown-item>
          <b-dropdown-item>過去 24 小時</b-dropdown-item>
          <b-dropdown-item>過去 1 週</b-dropdown-item>
          <b-dropdown-item>過去 1 個月</b-dropdown-item>
          <b-dropdown-item>過去 1 年</b-dropdown-item>
        </b-dropdown>
        <b-dropdown
          variant="outline-primary"
          toggle-class="badge-pill px-4"
        >
          <template v-slot:button-content>
            新聞來源
          </template>
          <b-dropdown-item>三立</b-dropdown-item>
          <b-dropdown-item>中天</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <hr>
    <div
      v-for="(news, index) in newsList"
      :key="index"
      style="margin-top: 0.75rem;"
    >
      <NewsCard
        :title="news.title"
        :outline="getNewsOutline(news.content)"
        :content="news.content"
        :url="news.url"
        @importNews="emitToEditPage"
      />
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
  data () {
    return {
      searchKeyword: '',
      newsList: []
    }
  },
  methods: {
    emitToEditPage (content) {
      this.$emit('importNews', content)
    },
    getNews () {
      getNews({ q: this.searchKeyword }).then(
        (response) => {
          this.newsList = response.data.data
          console.log(response.data)
        }
      )
    },
    getNewsOutline (newsContent) {
      let str = ''
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

<style scoped lang="scss">
.search-news-container {
  display: inline-flex;
  border-radius: 3rem;
  border: 1px solid $primary;
  justify-content: flex-end;
  align-items: center;

  input {
    border-radius: 3rem;
  }

  button {
    display: inline-flex;
    align-items: center;
  }

  div {
    padding: 0.25rem 0;
    height: 1.5rem;
    width: 1px;
    border-left: 1px solid $secondary;
  }
}

.search-select {
  background-color: $primary;
  border-radius: 3rem !important;
  margin-right: 1rem;
  border: 1px solid $red;
}

.search-dropdown {
  button {
    border-radius: 3rem !important;
    margin-right: 1rem;
    border: 1px solid $red;
  }
}
</style>
