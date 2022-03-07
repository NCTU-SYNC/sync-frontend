<template>
  <div>
    <div class="article-category">{{ getCategory(category) }}</div>
    <div class="d-flex flex-column-reverse flex-md-row">
      <!-- left content -->
      <div class="left-content d-flex flex-column">
        <h1
          class="headline-heading"
        ><b-link :to="`/article/${newsId}`">{{ title }}</b-link></h1>
        <div class="d-flex justify-content-between">
          <div v-if="tags.length > 0" class="headline-tags">
            <span v-for="(tag, tagIndex) in tags" :key="tagIndex"> #{{ tag }} </span>
          </div>
        </div>
        <div
          class="headline-text"
        >
          {{ getArticleContent(blocks,200) }}
        </div>
        <div class="d-flex justify-content-between article-footer w-100">
          <div>{{ getDateTime() }}</div>
          <div>觀看數：{{ viewsCount }}｜編輯數：{{ editedCount }}</div>
        </div>
      </div>
      <!-- right content -->
      <div class="d-flex align-items-center">
        <b-img block center style="max-height: 300px; max-width: 512px;" :src="imgLink" />
      </div>
    </div>
  </div></template>

<script>
import moment from 'moment'
import { Utils } from '@/utils'
export default {
  name: 'Headline',
  props: {
    title: {
      type: String,
      default: 'WHO：國際專家下月赴中國 調查COVID-19疫情源頭'
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
      thumbnailPlaceholder: require('@/assets/images/thumbnail-placeholder.svg')
    }
  },
  computed: {
    imgLink() {
      const imgLink = this.getArticleFirstImage(this.blocks)
      return imgLink !== null ? imgLink : this.thumbnailPlaceholder
    }
  },
  methods: {
    getArticleContent: Utils.getArticleContent,
    getArticleFirstImage: Utils.getArticleFirstImage,
    getCategory(newsCategory) {
      if (typeof newsCategory === 'string') {
        if (newsCategory.length === 0) { return '未分類' } else return newsCategory
      } else return '未分類'
    },
    getDateTime() {
      const datetime = moment(this.lastUpdatedAt)
      if (datetime.isValid()) {
        return datetime.format('YYYY.MM.DD')
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/news.scss';
.article-category {
  margin-top: 32px;
  margin-bottom: 16px;
}
.left-content {
  height: 300px;
  margin-right: 2rem;
  flex-grow: 1;
}
.headline-heading{
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 47px;
  letter-spacing: 4px;
  margin-bottom: 0px;
}

.headline-text{
  padding-top: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.headline-tags {
  margin-top: 8px;
  font-size: 12px;
  color: $blue;
}

.article-footer {
  margin-top: auto;
}

@media only screen and (max-width: 768px) {
  .left-content {
    margin-right: 0px;
    height: max-content;
  }
  .article-footer {
    margin-top: 32px;
  }
}
</style>
