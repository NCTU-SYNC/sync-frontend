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
          :disabled="searchKeyword.length === 0"
          @click="getNews"
        >
          <b-icon icon="search" />
        </b-button>
      </div>
      <div class="search-news-container">
        <b-button
          variant="link"
          :disabled="newsList.length === 0 || pageNumber === 0"
          @click="onPreviousPageClicked"
        >
          <b-icon icon="chevron-left" />
        </b-button>
        <div />
        <b-button
          variant="link"
          :disabled="newsList.length === 0"
          @click="onNextPageClicked"
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
            {{ timeQueryText }}
          </template>
          <slot v-for="timeQuery in timeQueries">
            <b-dropdown-item @click="onTimeDropdownClicked(timeQuery[0])">{{ timeQuery[1] }}</b-dropdown-item>
          </slot>
        </b-dropdown>
        <b-dropdown
          class="ml-2"
          variant="outline-primary"
          toggle-class="badge-pill px-4"
        >
          <template v-slot:button-content>
            新聞來源
          </template>
          <b-dropdown-item disabled>聯合</b-dropdown-item>
          <b-dropdown-item disabled>中時</b-dropdown-item>
          <b-dropdown-item disabled>ettoday</b-dropdown-item>
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
        :source="news.media"
        :datetime="news.modified_date"
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
  data() {
    return {
      searchKeyword: '',
      newsList: [],
      pageNumber: 0,
      queryDateRange: 'qdr:a',
      timeQueries: [
        ['qdr:a', '不限時間'],
        ['qdr:h', '過去 1 小時'],
        ['qdr:d', '過去 24 小時'],
        ['qdr:w', '過去 1 週'],
        ['qdr:m', '過去 1 個月'],
        ['qdr:y', '過去 1 年']
      ]
    }
  },
  computed: {
    timeQueryText() {
      return this.queryDateRange.length > 0 ? this.timeQueries.find(e => e[0] === this.queryDateRange)[1] : '時間'
    }
  },
  methods: {
    emitToEditPage(content) {
      this.$emit('importNews', content)
    },
    getNews() {
      this.newsList = []
      if (this.searchKeyword) {
        getNews({ q: this.searchKeyword, page: this.pageNumber, tbs: this.queryDateRange }).then(
          (response) => {
            this.newsList = response.data.data
            console.log(response.data)
          }
        )
      }
    },
    getNewsOutline(newsContent) {
      if (newsContent) {
        let str = ''
        newsContent.forEach(
          (text, i) => {
            // if (i === 0) { return }
            str += text + ' '
          })
        return str.substring(0, 120) + ' ...'
      }
    },
    onPreviousPageClicked() {
      if (this.pageNumber === 0) return
      this.pageNumber -= 1
      this.getNews()
    },
    onNextPageClicked() {
      this.pageNumber += 1
      this.getNews()
    },
    onTimeDropdownClicked(timeString) {
      this.queryDateRange = timeString
      this.getNews()
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
