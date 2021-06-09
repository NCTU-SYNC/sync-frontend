<template>
  <b-col>
    <b-card
      no-body
      style="width: 320px; height: 420px"
      class="mx-auto my-3"
    >
      <b-card-body>
        <div class="d-flex justify-content-between">
          <div class="article-category">
            {{ getCategory(category) }}
          </div>
          <img src="@/assets/icons/ic-bookmark.svg">
        </div>
        <div>

          <b-card-title class="heading mt-4 mb-3">
            <b-link :to="`/article/${newsId}`">
              {{ getTitle(title) }}
            </b-link>
          </b-card-title>

        </div>

        <div class="tags-row my-3">
          <div v-for="(tag,tagIndex) in tags" :key="tagIndex" class="article-tag">
            # {{ tag }}
          </div>
        </div>
        <div style="transform: rotate(0);">
          <b-link :to="`/article/${newsId}`" class="stretched-link" />
          <b-card-text class="body mb-4"> {{ getArticleContent(blocks,100) }} </b-card-text>
        </div>
        <div class="d-flex justify-content-between article-footer">
          <div>
            {{ getDateTime }}
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
    newsId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hover: false
    }
  },
  computed: {
    getDateTime() {
      const datetime = moment(this.lastUpdatedAt)
      if (datetime.isValid()) {
        return datetime.format('YYYY.MM.DD')
      }
      return ''
    }
  },
  methods: {
    getTitle(title) {
      if (title.length > 24) {
        return title.slice(0, 24) + ' ..'
      }
      return title
    },
    getCategory(newsCategory) {
      if (typeof newsCategory === 'string') {
        if (newsCategory.length === 0) { return '未分類' } else return newsCategory
      } else return '未分類'
    },
    getArticleContent: Utils.getArticleContent
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/news.scss';

.heading{
    font-size: 22px;
    line-height: 1.5em;
    height: 3em;
    overflow: hidden;
    box-sizing: border-box;
    letter-spacing: 2px;
    text-align: justify;
}

.tags-row{
  height:2.5em;
  box-sizing: border-box;
  overflow: hidden;
}
.body{
  font-size: 16px;
  line-height: 1.5em;
  height: 9em;
  overflow: hidden;
}

</style>
