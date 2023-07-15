<template>
  <div class="block-preview">
    <transition name="fade" mode="out-in">
      <div :key="props.block.id">
        <p class="block-preview__datetime">{{ block.dateTime }}</p>
        <p class="block-preview__title">{{ block.blockTitle }}</p>
        <p
          class="block-preview__content"
          :class="{ 'block-preview__content__long': block.dateTime === '' }"
        >
          {{ block.content }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import moment from 'moment'
import { computed, reactive } from 'vue'
import { Utils } from '@/utils'

const props = defineProps({
  block: {
    type: Object,
    default: undefined
  }
})

const block = reactive({
  dateTime: computed(() => getDateTime(props.block.blockDateTime)),
  blockTitle: computed(() => props.block.blockTitle),
  content: computed(() => Utils.getArticleContent([props.block]))
})

const getDateTime = (lastUpdatedAt) => {
  const datetime = moment(lastUpdatedAt)
  if (datetime.isValid()) {
    return datetime.format('MM/DD HH:mm')
  }
  return ''
}
</script>

<style lang="scss" scoped>
.block-preview {
  position: relative;
  padding-left: 1rem;

  &::before {
    content: '';
    width: 0.25rem;
    height: 8.75rem;
    border-radius: 0.25rem;

    position: absolute;
    left: 0;

    background-color: $blue-4;
  }

  font-size: 1rem;
  line-height: 1.5rem;

  &__datetime {
    font-weight: 700;
    color: $text-1;

    margin-bottom: 0.25rem;
  }

  &__title {
    font-weight: 500;
    color: $text-1;

    margin-bottom: 1rem;
  }

  &__content {
    display: -webkit-box;
    font-weight: 400;
    color: $text-2;

    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    &__long {
      -webkit-line-clamp: 4;
    }
  }
}

// vue transition
.fade-leave-active {
  transition: opacity 0.24s;
}

.fade-enter-active {
  transition: opacity 0.33s, transform 0.33s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter {
  transform: translateY(5%);
}

</style>
