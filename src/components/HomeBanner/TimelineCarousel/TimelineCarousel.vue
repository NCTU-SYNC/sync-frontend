<template>
  <div
    ref="timelineCarousel"
    class="timeline-carousel swiper"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <ul class="swiper-wrapper">
      <TimelineCarouselItem
        v-for="(block, index) in blocks"
        ref="carouselItems"
        :key="index"
        :block="block"
        :class="{ active: activeItemIndex === index}"
        @update-item="updateActiveItem(index)"
      />
    </ul>

    <button class="swiper-button-prev timeline-carousel__btn timeline-carousel__prev-btn">
      <SvgIcon icon="arrow-left" />
    </button>
    <button class="swiper-button-next timeline-carousel__btn timeline-carousel__next-btn">
      <SvgIcon icon="arrow-right" />
    </button>
  </div>
</template>

<script>
import Swiper, { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

import TimelineCarouselItem from './TimelineCarouselItem.vue'
import SvgIcon from '@/components/SvgIcon.vue'

const slidePerPage = 5

const domInRectY = (rectLeft, rectRight) => (domLeft, domRight) => rectLeft <= domLeft && rectRight >= domRight

let autoPlay = null

class SwiperAutoPlay {
  constructor(swiper, callback, interval = 3000) {
    this.swiper = swiper
    this.interval = interval
    this.callback = callback
    this.intervalId = -1

    this.start()
  }

  pause() {
    clearInterval(this.intervalId)
    this.intervalId = -1
  }

  start() {
    if (this.intervalId !== -1) return

    this.intervalId = setInterval(this.callback, this.interval)
  }
}

export default {
  name: 'TimelineCarousel',
  components: { SvgIcon, TimelineCarouselItem },
  props: {
    blocks: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      activeItemIndex: 0,
      firstVisibleItemIndex: 0,
      lastVisibleItemIndex: this.$props.blocks.length > slidePerPage ? this.$props.blocks.length - 1 : slidePerPage - 1
    }
  },

  mounted() {
    const swiper = new Swiper(this.$refs.timelineCarousel, {
      modules: [Navigation],
      slidesPerView: slidePerPage,
      slidesPerGroup: slidePerPage,
      spaceBetween: 0,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },

      on: {
        slideChangeTransitionEnd: () => {
          const carousel = this.$refs.timelineCarousel
          const carouselRect = carousel.getBoundingClientRect()

          const domInCarousel = domInRectY(
            carouselRect.left,
            carouselRect.right
          )

          const activeItem = this.$refs.carouselItems[this.activeItemIndex]
          const activeItemRect = activeItem.$el.getBoundingClientRect()

          if (domInCarousel(activeItemRect.left, activeItemRect.right)) return

          this._setActiveItemToFirstVisible()
        }
      }
    })

    autoPlay = new SwiperAutoPlay(swiper, () => {
      const nextIndex = (this.activeItemIndex + 1) % this.$props.blocks.length

      if (nextIndex === 0) swiper.slideReset()
      else if (nextIndex % slidePerPage === 0) {
        swiper.slideNext()
      }

      this.updateActiveItem(nextIndex)
    }, 3000)
  },

  beforeDestroy() {
    autoPlay.pause()
  },

  methods: {
    updateActiveItem(index) {
      this.activeItemIndex = index
      this.$emit('update-slide', index)
    },

    pauseAutoPlay() {
      autoPlay.pause()
    },

    resumeAutoPlay() {
      autoPlay.start()
    },

    _setActiveItemToFirstVisible() {
      const carousel = this.$refs.timelineCarousel
      const carouselRect = carousel.getBoundingClientRect()

      const domInCarousel = domInRectY(
        carouselRect.left,
        carouselRect.right
      )

      // find the first visible item and set it active
      for (const [index, item] of this.$refs.carouselItems.entries()) {
        const itemRect = item.$el.getBoundingClientRect()
        if (domInCarousel(itemRect.left, itemRect.right)) {
          this.updateActiveItem(index)
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline-carousel {
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
  position: relative;

  @media screen and (max-width: 1279px) {
    margin: 0 -1rem;
    padding: 0 1rem;
  }

  font-size: 12px;
  line-height: 20px;

  ul {
    padding: 0;
  }

  li {
    list-style-type: none;
  }

  &__btn {
    display: none;

    padding: 0;
    border: 0;
    border-radius: 9999px;
    z-index: 5;

    width: 56px;
    height: 56px;
    color: white;
    background-color: rgba(0, 0, 0, 0.2);

    &:disabled {
      display: none;
    }
  }

  &:hover {
    .timeline-carousel__btn:not(:disabled) {
      display: block;
    }
  }

  &__prev-btn {
    position: absolute;
    top: 50%;
    left: 1.5rem;

    transform: translateY(-50%);
  }

  &__next-btn {
    position: absolute;
    top: 50%;
    right: 1.5rem;

    transform: translateY(-50%);
  }
}
</style>
