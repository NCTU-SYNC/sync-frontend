<template>
  <b-col>
    <b-card
      no-body
      :style="size"
      class="card mx-auto my-3 justify-content-center"
    >
      <button class="subscribe-btn" @click="handleClickBookmark()">
        <img
          v-if="!isSubscribed"
          width="32px"
          src="@/assets/icons/ic-save.svg"
          alt="save-icon"
        >
        <img
          v-else
          width="32px"
          src="@/assets/icons/ic-saved.svg"
          alt="saved-icon"
          srcset=""
        >
      </button>
      <b-link :to="`/article/${articleId}`">
        <b-card-body class="d-flex flex-column p-0">
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
          <div class="d-flex justify-content-between article-footer">
            <div>
              {{ getDateTime(lastUpdatedAt) }}
            </div>
            <div>觀看數：{{ viewsCount }} | 編輯數：{{ editedCount }}</div>
          </div>
        </b-card-body>
      </b-link>
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
    size() {
      return {
        width: this.lg ? '800px' : '320px',
        height: this.lg ? '276px' : '380px'
      }
    },
    excerptCount() {
      return this.lg ? 180 : 140
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
    this.isLogin = !!this.$store.getters.token
    if (this.isLogin) {
      this.isSubscribed =
        this.subscribedList.findIndex(s => s.articleId === this.articleId) >= 0
    }
  },
  methods: {
    getTitle(title) {
      if (title.length > 30) {
        return title.slice(0, 30) + ' ..'
      }
      return title
    },
    getCategory(newsCategory) {
      if (typeof newsCategory === 'string') {
        if (newsCategory.length === 0) {
          return '未分類'
        } else return newsCategory
      } else return '未分類'
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
  width: 320px;
  height: 386px;
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

.article-footer {
  margin-top: auto;
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
