<template>
  <b-card class="border-0 pt-3">
    <div class="w-100 d-flex justify-content-start">
      <div class="search-news-container mr-2 flex-grow-1">
        <b-form-input
          id="search-news"
          v-model="searchKeyword"
          class="border-0"
          placeholder="搜尋新聞"
          @keyup.enter="getNews"
        />
        <div />
        <b-button
          class="mr-1"
          variant="link"
          :disabled="searchKeyword.length === 0 || isLoading"
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
        <div class="divider" />
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
            {{ mediaSourceText }}
          </template>
          <slot v-for="mediaSource in mediaSourceQueries">
            <b-dropdown-item @click="onMeidaDropdownClicked(mediaSource)">{{ mediaSource }}</b-dropdown-item>
          </slot>
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
      queryTimeSelected: 'qdr:a',
      mediaSelected: '',
      timeQueries: [
        ['qdr:a', '不限時間'],
        ['qdr:h', '過去 1 小時'],
        ['qdr:d', '過去 24 小時'],
        ['qdr:w', '過去 1 週'],
        ['qdr:m', '過去 1 個月'],
        ['qdr:y', '過去 1 年']
      ],
      mediaSourceQueries: ['不限新聞來源', '中時', '中央社', '華視', '東森', 'ettoday', '台灣事實查核中心', '自由時報', '風傳媒', '聯合', '三立'],
      isLoading: false
    }
  },
  computed: {
    timeQueryText() {
      return this.queryTimeSelected.length > 0 ? this.timeQueries.find(e => e[0] === this.queryTimeSelected)[1] : '時間'
    },
    mediaSourceText() {
      return this.mediaSelected.length > 0 ? this.mediaSelected : '不限新聞來源'
    }
  },
  methods: {
    emitToEditPage(content) {
      this.$emit('importNews', content)
    },
    async getNews() {
      this.newsList = []
      if (this.searchKeyword) {
        try {
          this.isLoading = true
          const { data } = await getNews(
            {
              q: this.searchKeyword,
              page: this.pageNumber,
              tbs: this.queryTimeSelected,
              media: this.mediaSelected
            }
          )
          const type = data.type
          const payload = data.data
          if (type === 'success') {
            this.newsList = payload
          } else {
            throw new Error(data.message)
          }
        } catch (error) {
          console.error(error.message)
          this.$bvModal.msgBoxOk(error.message)
        } finally {
          this.isLoading = false
        }
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
      this.queryTimeSelected = timeString
      this.getNews()
    },
    onMeidaDropdownClicked(mediaString) {
      this.mediaSelected = mediaString
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

  .divider {
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
