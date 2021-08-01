<template>
  <b-col>
    <b-card
      no-body
      class="card mx-auto my-3 justify-content-center"
    >
      <b-card-body class="card-body-style d-flex flex-column">
        <div class="d-flex justify-content-between">
          <div class="article-category">
            {{ getCategory(category) }}
          </div>
          <button class="subscribe-btn" @click="handleClickBookmark()">
            <img v-if="!isSubscribed" width="32px" src="@/assets/icons/ic-save.svg" alt="save-icon">
            <img v-else width="32px" src="@/assets/icons/ic-saved.svg" alt="saved-icon" srcset="">
          </button>
        </div>
        <div>

          <b-card-title class="heading">
            <b-link :to="`/article/${articleId}`" exact>
              <h4>{{ getTitle(title) }}</h4>
            </b-link>
          </b-card-title>

        </div>

        <b-card-text class="article-excerpt"> {{ getArticleContent(blocks, 140) }} </b-card-text>
        <div class="d-flex justify-content-between article-footer">
          <div>
            {{ getDateTime(lastUpdatedAt) }}
          </div>
          <div>
            觀看數：{{ viewsCount }} | 編輯數：{{ editedCount }}
          </div>
        </div>
      </b-card-body>
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
    tags: {
      type: Array,
      default: null
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
    }
  },
  watch: {
    subscribedList(newList) {
      if (newList) {
        this.isSubscribed = newList.findIndex(s => s.articleId === this.articleId) >= 0
        return
      }
      this.isSubscribed = false
    }
  },
  created() {
    // check if user logged in
    this.isLogin = !!this.$store.getters.token
    if (this.isLogin) {
      this.isSubscribed = this.subscribedList.findIndex(s => s.articleId === this.articleId) >= 0
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
        if (newsCategory.length === 0) { return '未分類' } else return newsCategory
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
          this.$bvModal.msgBoxOk(`${this.isSubscribed ? '取消' : ''}追蹤文章失敗`, {
            title: '追蹤文章',
            okVariant: 'danger',
            okTitle: '確定',
            footerClass: 'modal-footer-confirm',
            centered: true
          })
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
  padding: 16px 16px 20px 16px;
  width: 320px;
  height: 386px;
  border-radius: 0;
}
.card-body-style::v-deep {
  padding: 0px;
}
.heading{
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

.article-excerpt{
  width: 288px;
  line-height: 1.5em;
  overflow: hidden;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
}

.article-footer{
  margin-top: auto;
}

.subscribe-btn {
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
}

</style>
