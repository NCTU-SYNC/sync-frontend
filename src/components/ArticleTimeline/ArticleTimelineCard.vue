<template>
  <div class="timeline-card">
    <div class="timeline-card__datetime">{{ parsedDate }}</div>
    <div class="timeline-card__title">{{ title }}</div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ArticleTimelineCard',
  props: {
    datetime: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    parsedDate() {
      return moment(this.datetime).format('YYYY/MM/DD')
    }
  }
}
</script>

<style scoped lang="scss">
.timeline-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.04);
  padding: 1rem;

  &__datetime {
    font-size: 12px;
    line-height: 20px;
    color: $blue-4;
  }

  &__title {
    font-size: 14px;
    line-height: 24px;
    color: $gray-9;
  }
}
</style>
