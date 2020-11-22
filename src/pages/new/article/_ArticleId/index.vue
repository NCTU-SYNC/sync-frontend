<template>
  <b-container fluid="xl">
    <b-row>
      <b-col cols="2">
        <div class="sync-blank-container d-flex flex-column pr-3">
          <div class="sync-timeline">
            <div class="sync-timeline-title" />
          </div>
          <div class="sync-timeline">
            <div class="sync-timeline-time">
              2020.10.02
            </div>
            <div class="sync-timeline-title">
              <p>川普染疫確診川普染疫確診</p>
            </div>
          </div>
          <div class="sync-timeline">
            <div class="sync-timeline-time">
              2020.10.02
            </div>
            <div class="sync-timeline-title">
              <p>川普染疫確診</p>
            </div>
          </div>
          <div class="sync-timeline">
            <div class="sync-timeline-time">
              2020.10.02
            </div>
            <div class="sync-timeline-title">
              <p>川普染疫確診</p>
            </div>
          </div>
          <div class="sync-timeline">
            <div class="sync-timeline-time">
              2020.10.02
            </div>
            <div class="sync-timeline-title pl-2 pt-2">
              <p>川普染疫確診</p>
            </div>
          </div>
        </div>
      </b-col>
      <b-col cols="8">
        <b-row>
          <b-col>
            <p>[2020 美國總統大選] 這邊不知道是要填什麼資料</p>
            <h2>
              {{ news.title }}
            </h2>
            <hr class="my-2">
            <div class="text-center text-secondary">
              <b-icon icon="clock" />
              最後更新時間 {{ formatTime(news.lastUpdatedAt) }}
            </div>
            <div class="d-flex justify-content-between py-3">
              <div>
                <b-button
                  v-for="(tag, tagIndex) in news.tags"
                  :key="tagIndex"
                  variant="outline-primary"
                  :class="['m-1', 'flex-shrink-0', 'shadow-sm']"
                  pill
                >
                  {{ tag }}
                </b-button>
              </div>
              <div class="d-flex flex-grow-1 justify-content-end">
                <b-button
                  variant="outline-primary"
                  class="shadow-sm btn-icon mx-2 mt-1"
                  @click="handleEditPostRoute(`${$route.path}/post`)"
                >
                  <b-icon icon="pencil-square" />
                </b-button>
                <b-button
                  variant="outline-primary"
                  class="shadow-sm btn-icon mx-2 mt-1"
                >
                  <b-icon icon="clock-history" />
                </b-button>
                <b-button
                  variant="outline-primary"
                  class="shadow-sm btn-icon ml-2 mt-1"
                >
                  <b-icon icon="bookmark" />
                </b-button>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row
          v-for="(block, index) in news.blocks"
          :key="index"
          class="py-3"
        >
          <b-col>
            <div class="d-flex justify-content-between">
              <h3 class="text-primary">
                {{ block.blockTitle }}
              </h3>
              <b-link class="text-gray">
                {{ formatTime(block.blockDateTime) }}
              </b-link>
            </div>
            <p
              v-for="(content,contentIndex) in block.content.content"
              :key="contentIndex"
            >
              {{ content.content ? content.content[0].text : '' }}
            </p>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="2">
        <div class="sync-blank-container" />
        <div class="sync-time-container py-2">
          <p>{{ time.year() }}</p>
          <span
            id="month"
            class="mb-2"
          >{{ time.month() + 1 }} 月</span>
          <span
            id="date"
            class="mb-2"
          >{{ time.date() }} 日</span>
          <p class="mt-4 mb-0">
            {{ time.format('hh:mm a') }}
          </p>
        </div>
        <div class="sync-authors-container py-2">
          <p class="mb-1">
            編輯者：
          </p>
          <b-link>吳先生</b-link>, <b-link>吳先生</b-link>, <b-link>吳先生</b-link>, <b-link>吳先生</b-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// test id:  5f5113349779a26bd0444b26
import moment from 'moment'
import { getArticleById } from '@/api/article'
export default {
  name: 'Article',
  async asyncData ({ route, store }) {
    const { ArticleId } = route.params
    const { data } = await getArticleById(ArticleId)
    if (data.code === 200) {
      const responseData = data.data
      const { title, tags, author, createdAt, blocks, lastUpdatedAt } = responseData
      return {
        news: {
          title,
          tags,
          lastUpdatedAt,
          blocks
        },
        author,
        createdAt,
        blocks,
        editors: [],
        editableBlocks: [],
        isLogin: store.getters.isLogin
      }
    } else {
      return {
        isLogin: store.getters.isLogin
      }
    }
  },
  data () {
    return {
      tagName: '美國總統大選',
      order: 'time',
      news: { category: '國際', title: '', viewCount: 32, tags: [] },
      timeId: null,
      time: moment()
    }
  },
  computed: {
    getYear () {
      return this.time.getFullYear()
    },
    getMonth () {
      return this.time.getMonth()
    }
  },
  created () {
    this.timeId = setInterval(() => {
      this.time = moment()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeId)
    this.time = null
  },
  methods: {
    handleEditPostRoute (route) {
      if (this.isLogin) { this.$router.push(route) } else { this.$bvModal.msgBoxOk('Please Login First') }
    },
    formatTime (timeString) {
      return moment(timeString).format('YYYY-MM-DD HH:mm')
    }
  }

}
</script>

<style scoped lang="scss">
@import '@/assets/scss/news.scss';

p {
  letter-spacing: 0.25rem;
}

.btn-icon {
  height: 3rem !important;
  width: 3rem !important;
  padding-top: 0.25rem;
  border-radius: 0.75rem;
}

.sync-blank-container {
  padding-top: 9rem;
}

.sync-timeline {
  .sync-timeline-time {
    width: 8rem;
    border: 1px solid $secondary;
    color: $secondary;
    text-align: center;
  }
  .sync-timeline-title {
    flex-grow: 1;
    margin-left: 1rem;
    padding: 0.5rem 0rem 0rem 0.5rem;
    border-left: 1px solid $black;
    min-width: 100%;
    height: 100%;
    min-height: 3rem;
  }
  display: flex;
  flex-direction: column;
  min-width: 100%;
  min-height: 3rem;
}

.sync-time-container {
  padding-top: 9rem;
  border-top: 1px solid $black;
  border-bottom: 1px solid $black;
}

.sync-authors-container {
  border-bottom: 1px solid $black;
}

#month {
  font-size: 2rem;
}

#date {
  font-size: 1.5rem;
}
</style>
