<template>
  <b-list-group v-b-scrollspy.80 class="timeline-block__container">
    <b-list-group-item v-for="(block, index) in blocks" :key="index" class="timeline-block__card" :to="`#block-${index}`">
      <ArticleTimelineCard
        :datetime="block.blockDateTime"
        :title="block.blockTitle"
      />
    </b-list-group-item>

  </b-list-group>
</template>

<script>
import ArticleTimelineCard from './ArticleTimelineCard.vue'

export default {
  name: 'ArticleTimelineBlock',
  components: {
    ArticleTimelineCard
  },
  props: {
    blocks: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped lang="scss">
.timeline-block__container {
  display: flex;
  flex-direction: column;
  overflow: scroll;

  .timeline-block__card {
    position: relative;
    width: initial;
    margin-bottom: 1rem;
    margin-left: 1.5rem;
    padding: 0;
    border: 0;
    background-color: initial;

    &.active::after {
      border-color: $blue-2;
      background-color: $blue-4;
    }

    &::before {
      content: "";
      position: absolute;
      top: -1rem;
      left: -18px;
      width: 4px;
      height: calc(100% + 2rem);
      background-color: $blue-1;
    }

    &::after {
      content: "";
      position: absolute;
      top: calc(50% - 0.5rem);
      left: -1.50rem;
      width: 16px;
      height: 16px;
      border: 3px solid $blue-1;
      border-radius: 9999px;
      background-color: $blue-1;
    }

    &:first-of-type {
      &::before {
        height: calc(50% + 1rem);
        top: auto;
        bottom: -1rem;
      }

      &::after {
        top: calc(50% - 0.5rem);
      }
    }

    &:last-of-type {
      margin-bottom: 0;

      &::before {
        height: calc(50% + 1rem);
      }

      &::after {
        top: calc(50% - 0.5rem);
      }
    }

  }
}
</style>
