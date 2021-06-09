<template>
  <b-col md="10" cols="12" class="px-5 px-xl-0">
    <b-row no-gutters><div class="article-category mt-5">{{ getCategory(category) }}</div></b-row>
    <b-row no-gutters>
      <!-- left content -->
      <b-col md="7" cols="12">
        <div class="py-2 pr-3">

          <h1
            class="headline-heading mb-3"
          ><b-link :to="`/article/${newsId}`">{{ title }}</b-link></h1>
          <div class="d-flex justify-content-between">
            <div>
              <div v-for="(tag) in tags" :key="tag" class="article-tag"># {{ tag }}</div>
            </div>
            <img src="@/assets/icons/ic-bookmark.svg" alt="bookmark">
          </div>
          <div
            class="headline-text py-3"
            style="transform: rotate(0);"
          >
            <b-link :to="`/article/${newsId}`" class="stretched-link" />
            {{ getArticleContent(blocks, 80) }}
          </div>
          <div class="d-flex justify-content-between article-footer w-100">
            <div>{{ getDateTime() }}</div>
            <div>觀看數：{{ viewsCount }}｜編輯數：{{ editedCount }}</div>
          </div>
        </div>
      </b-col>
      <!-- right content -->
      <b-col class="d-flex justify-content-center align-items-center">
        <b-img fluid center block :src="require('@/assets/icons/ic-placeholder.svg')" />
      </b-col>
    </b-row>
    <b-row no-gutters><img class="mt-2 mb-5" src="@/assets/icons/ic-headline-page.svg" alt="headline-page"></b-row>
  </b-col>

</template>

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
  methods: {
    getArticleContent: Utils.getArticleContent,
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
.headline-heading{
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 47px;
  letter-spacing: 4px;
  margin-bottom: 0px;
}

.headline-text{
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 32px;
  letter-spacing: 2px;
}
</style>
