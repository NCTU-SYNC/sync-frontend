<template>
  <li class="timeline-carousel__item swiper-slide" @click="$emit('update-item')">
    <div v-show="block.blockDateTime" class="timeline-carousel__datetime">
      {{ getDateTime(props.block.blockDateTime) }}
    </div>
    <div class="timeline-carousel__title">
      {{ props.block.blockTitle }}
    </div>
  </li>
</template>

<script setup>
import moment from 'moment'

import { defineComponent, defineProps } from 'vue'

defineComponent({
  name: 'TimelineCarouselItem'
})

const props = defineProps({
  block: {
    type: Object,
    default: () => {}
  }
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
.timeline-carousel {
  &__datetime {
    color: $blue-4;
  }

  &__title {
    color: $text-2;
  }
}

.timeline-carousel__item {
  width: 240px;
  height: 100%;
  padding-top: 2rem;
  padding-right: 1.5rem;

  &::before {
    content: '';
    width: calc(100% - 1rem - 1rem); // full-w - ::after width - gap
    height: 4px;
    position: absolute;
    top: 8px;
    left: calc(1rem + 0.5rem); // ::after width + gap
    background: $blue-1;
    border-radius: 2px;
    transform: translateY(-50%);
  }

  &:last-child::before {
    display: none;
  }

  &::after {
    content: '';
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    background-color: $blue-1;
    border-radius: 50%;
    transition: background-color 0.15s ease-in-out;
  }

  &:hover {
    cursor: pointer;

    .timeline-carousel__title {
      font-weight: 700;
    }

    &::after {
      background-color: $blue-2;
    }
  }

  &.active {
    font-weight: 700;

    &::after {
      width: 1.125rem;
      height: 1.125rem;
      border: 4px solid $blue-2;
      background-color: $blue-4;
    }
  }

  @media screen and (max-width: 1279px) {
    &::before {
      width: calc(100% - 0.75rem - 1rem); // full-w - ::after width - gap

      top: calc(0.75rem / 2);
      left: calc(0.75rem + 0.5rem) // ::after width + gap
    }

    &::after {
      width: 0.75rem;
      height: 0.75rem;
    }

    &.active::after {
      width: calc(0.75rem * 1.125);
      height: calc(0.75rem * 1.125);
      border: 3px solid $blue-2;
    }
  }
}

</style>
