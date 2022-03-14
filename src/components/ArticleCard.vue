<template>
  <b-col class="d-flex justify-content-center">
    <b-card
      no-body
      :style="size"
      class="card my-3 justify-content-center"
      footer-tag="footer"
      footer-bg-variant="white"
      footer-border-variant="white"
      footer-class="p-0 article-footer"
    >
      <button v-b-tooltip.hover.bottom.v-secondary="bookmarkTooltip" class="subscribe-btn" @click="handleClickBookmark()">
        <icon v-if="!isSubscribed" icon="save" />
        <icon v-else icon="saved" />
      </button>
      <b-card-body class="d-flex flex-column p-0">
        <b-link :to="`/article/${articleId}`">
          <div class="d-flex justify-content-between">
            <div class="article-category">
              {{ getCategory(category) }}
            </div>
          </div>
          <div>
            <b-card-title class="heading">
              <h4>
                {{ getTitle(title) }}
              </h4>
            </b-card-title>
          </div>

          <b-card-text class="article-excerpt">
            {{ getArticleContent(blocks, excerptCount) }}
          </b-card-text>
        </b-link>
      </b-card-body>
      <template #footer>
        <div class="d-flex justify-content-between">
          <div>
            {{ getDateTime(lastUpdatedAt) }}
          </div>
          <div>觀看數：{{ viewsCount }} | 編輯數：{{ editedCount }}</div>
        </div>
      </template>
    </b-card>
  </b-col>
</template>

<script>
import moment from 'moment'
import { Utils } from '@/utils'
export default {
  name: 'ArticleCard',
  props: {
    title: {
      type: String,
      default: 'title'
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: '未分類'
    },
    lastUpdatedAt: {
      type: String,
      default: '2021.04.26'
    },
    editedCount: {
      type: Number,
      default: 0
    },
    blocks: {
      type: Array,
      default: null
    },
    articleId: {
      type: String,
      default: ''
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLogin: false,
      isSubscribed: false
    }
  },
  computed: {
    subscribedList() {
      return this.$store.getters['article/subscribedList']
    },
    bookmarkTooltip() {
      return this.isSubscribed ? '取消收藏文章' : '收藏文章'
    },
    cols() {
      return this.full ? 12 : 4
    },
    size() {
      return {
        'max-width': this.full ? '800px' : '320px',
        height: this.full ? '276px' : '380px'
      }
    },
    excerptCount() {
      return this.lg ? 190 : 140
    }
  },
  watch: {
    subscribedList(newList) {
      if (newList) {
        this.isSubscribed =
          newList.findIndex(s => s.articleId === this.articleId) >= 0
        return
      }
      this.isSubscribed = false
    }
  },
  created() {
    // check if user logged in
    this.isLogin = !!this.$store.getters.isLogin
    if (this.isLogin) {
      this.isSubscribed =
        this.subscribedList.findIndex(s => s.articleId === this.articleId) >= 0
    }
  },
  methods: {
    getTitle(title) {
      if (title && title.length > 30) {
        return title.slice(0, 30) + ' ..'
      }
      return title
    },
    getCategory(newsCategory) {
      if (typeof newsCategory === 'string') {
        if (newsCategory.length === 0) {
          return '未分類'
        } else return newsCategory
      } else { return '未分類' }
    },
    getDateTime(lastUpdatedAt) {
      const datetime = moment(lastUpdatedAt)
      if (datetime.isValid()) {
        return datetime.format('YYYY.MM.DD HH:MM')
      }
      return ''
    },
    async handleClickBookmark() {
      try {
        if (!this.isSubscribed) {
          await this.$store.dispatch('article/SUBSCRIBE', this.articleId)
        } else {
          this.$store.dispatch('article/UNSUBSCRIBE', this.articleId)
        }
      } catch (error) {
        if (!this.isLogin) {
          this.$bvModal.msgBoxOk(`尚未登入！追蹤文章失敗`, {
            title: '追蹤文章',
            okVariant: 'danger',
            okTitle: '確定',
            footerClass: 'modal-footer-confirm',
            centered: true
          })
        } else {
          this.$bvModal.msgBoxOk(
            `${this.isSubscribed ? '取消' : ''}追蹤文章失敗`,
            {
              title: '追蹤文章',
              okVariant: 'danger',
              okTitle: '確定',
              footerClass: 'modal-footer-confirm',
              centered: true
            }
          )
        }
      }
    },
    getArticleContent: Utils.getArticleContent
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/news.scss';

.card {
  padding: 15.2px;
}
.heading {
  // font-size: 22px;
  line-height: 1.5em;
  max-height: 3em;
  overflow: hidden;
  h4 {
    margin: 0;
  }
  box-sizing: border-box;
  text-align: justify;
  margin-top: 26px;
  margin-bottom: 29px;
}

.article-excerpt {
  line-height: 1.5em;
  overflow: hidden;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
}

.subscribe-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
}
</style>
