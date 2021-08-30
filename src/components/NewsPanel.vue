<template>
  <div class="d-flex flex-column h-100">
    <div class="w-100 d-flex flex-column justify-content-start header">
      <div class="result-number-container" />
      <div class="w-100 d-flex justify-content-start">
        <div class="search-bar mr-1 flex-grow-1">
          <b-button
            class="search-btn"
            variant="link"
            :disabled="searchKeyword.length === 0 || isLoading"
            @click="getNews"
          >
            <!-- <b-icon icon="search" font-scale="1" /> -->
            <icon icon="news-panel-search" size="md" />
          </b-button>
          <b-form-input
            id="search-news"
            v-model="searchKeyword"
            class="border-0"
            placeholder="搜尋"
            @keydown.enter="searchOnEnter"
          />
          <div />
        </div>
        <div class="d-flex align-items-center">
          <b-button
            :disabled="newsList.length === 0 || pageNumber === 0"
            class="nav-btn"
            @click="onPreviousPageClicked"
          >
            <b-icon icon="chevron-left" />
          </b-button>
          <!-- <div class="divider" /> -->
          <b-button
            :disabled="newsList.length === 0"
            class="nav-btn"
            @click="onNextPageClicked"
          >
            <b-icon icon="chevron-right" />
          </b-button>
        </div>
      </div>
    </div>
    <!-- <b-row>
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
    </b-row> -->
    <!-- <hr> -->
    <div class="search-results-container">
      <div v-if="newsList.length===0" class="default-content-container">輸入關鍵字以搜索相關新聞</div>
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
    </div>
  </div>
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
    async searchOnEnter(event) {
      if (event.isComposing) return
      await this.getNews()
    },
    getNewsOutline(newsContent) {
      if (newsContent) {
        let str = ''
        newsContent.forEach(
          (text, i) => {
            // if (i === 0) { return }
            str += text + ' '
          })
        return str.substring(0, 90) + ' ...'
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
.header {
  background: $nature-2;
  padding: 1rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #DBDCE1;
}
.result-number-container {
  font-size: 12px;
  height: 1.5rem;
  color: $text-3;
}
.search-bar {
  display: inline-flex;
  border-radius: 8px;
  background: #fff;
  align-items: center;

  button {
    display: inline-flex;
    align-items: center;
  }
  .search-btn {
    border: none;
    border-right: 1px solid #DBDCE1;
    border-radius: 0;
    padding: 0px 10px 0px 0px;
    margin: 8px 0px 8px 8px;
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

.search-results-container {
  overflow-y: auto;
  min-height: 0px;
  flex: 1;
  padding: 1.5rem;
  padding-top: 0.25rem;
  padding-right: 9px;
  /* width */
  &::-webkit-scrollbar {
    width: 15px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    // background: #f1f1f1;
    // padding-right: 8px;
    background-color: white;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #DBDCE1;
    border: 6px solid white;
    height: 200px;
    border-radius: 100px;
    background-clip: padding-box;
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    border-radius: 100px;
    background: #555;
  }
  .default-content-container {
    margin-top: 0.75rem;
    font-size: 18px;
    color: $text-3;
  }
}

.nav-btn {
  background: #ededf0;
  color: #212124;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  height: 40px;
  &:enabled:hover {
    background: #DBDCE1;
    cursor: pointer;
  }
}
</style>
