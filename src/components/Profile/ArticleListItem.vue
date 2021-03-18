<template>
  <b-row>
    <b-col>
      <b-link
        class="item-link"
        :to="`/article/${article._id}`"
      >
        <div
          class="p-3 border-bottom"
        >
          <div>
            <p class="text-gray">{{ article.category || '未分類' }}</p>
            <h3>{{ article.title }}</h3>
            <p>{{ JSON.stringify(article.block) }}</p>
          </div>
          <div class="d-flex justify-content-start align-items-center">
            <div class="mr-3">
              <b-icon icon="clock" />
              最後更新時間：{{ getLastUpdateTime(article.lastUpdatedAt) }}
            </div>
            <div>
              <b-icon icon="eye" />
              {{ article.viewsCount || 0 }} 次觀看
            </div>
          </div>
        </div></b-link>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ArticleListItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    getLastUpdateTime(time) {
      return moment(time).format('YYYY年MM月DD日 HH:mm')
    }
  }
}
</script>

<style scoped lang="scss">
.item-link {
  text-decoration: none;
}
</style>
