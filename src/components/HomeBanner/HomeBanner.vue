<template>
  <div class="banner">
    <div class="banner-container">
      <img class="banner-img" :src="imgLink">

      <div>
        <div class="banner-label">焦點</div>
        <div class="banner-title">{{ title }}</div>
        <div class="banner-hashtag">
          <HashtagPill v-for="(tag, index) in tags" :key="index" :name="tag" />
        </div>

        <BlockPreview class="banner-text-preview" :block="previewBlock" />

        <div v-show="lg" class="banner-link">
          <b-link :to="articleLink">閱讀全文</b-link>
          <SvgIcon icon="arrow-right" size="sm" />
        </div>
      </div>
    </div>

    <div class="timeline">
      <div class="timeline-section__text">此篇內容的 {{ blocks.length }} 個段落</div>
      <TimelineCarousel :blocks="blocks" @update-slide="updateSlideHandler" />
    </div>

    <div v-show="!lg" class="banner-link banner-link__lower">
      <b-link :to="articleLink">閱讀全文</b-link>
      <SvgIcon icon="arrow-right" size="sm" />
    </div>
  </div>
</template>

<script>
import { Utils } from '@/utils'
import { BLink } from 'bootstrap-vue'
import { mapGetters } from 'vuex'
import HashtagPill from '@/components/HashtagPill.vue'
import BlockPreview from './TimelineCarousel/BlockPreview.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import TimelineCarousel from './TimelineCarousel/TimelineCarousel.vue'
import thumbnailPlaceholder from '@/assets/images/thumbnail-placeholder.svg'

export default {
  name: 'HomeBanner',
  components: { HashtagPill, TimelineCarousel, BlockPreview, BLink, SvgIcon },

  props: {
    title: {
      type: String,
      default: ''
    },

    tags: {
      type: Array,
      default: () => []
    },

    blocks: {
      type: Array,
      default: () => []
    },

    articleId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      previewBlock: this.$props.blocks[0]
    }
  },

  computed: {
    ...mapGetters(['windowWidth']),
    imgLink() {
      const imgLink = Utils.getArticleFirstImage(this.blocks)
      return imgLink !== null ? imgLink : thumbnailPlaceholder
    },

    articleLink() {
      return `/article/${this.$props.articleId}`
    },

    lg() {
      return this.windowWidth > 1279
    }
  },

  methods: {
    updateSlideHandler(index) {
      this.previewBlock = this.$props.blocks[index]
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  background-color: $white;

  border-radius: 1rem;
  padding: 1.5rem;
  margin: 30px auto;

  box-shadow: 0 4px 15px 0 rgb(0 0 0 / 5%);

  @media screen and (max-width: 1279px) {
    background-color: inherit;
    box-shadow: none;

    .timeline {
      background-color: white;

      padding: 0.5rem 1rem 1rem 1rem;
      border-radius: 1rem;
    }
  }

  &-container {
    display: flex;
    flex-direction: row;
    // grid-template-columns: 1fr 0.825fr;
    padding-bottom: 1rem;

    gap: 1.5rem;

    @media screen and (max-width: 1279px) {
      flex-direction: column;
      // grid-template-columns: unset;
      // grid-template-rows: 22.5fr 5.375fr;
    }
  }

  &-img {
    width: 640px;
    aspect-ratio: 2 / 1;
    object-fit: cover;

    border-radius: 12px;

    @media screen and (max-width: 1279px) {
      width: unset;
    }
  }

  &-label {
    font-size: 0.875rem;
    line-height: 1.5rem;
    font-weight: 700;

    color: $gray-8;
  }

  &-title {
    margin-top: 0.5rem;

    font-size: 2rem;
    line-height: 3rem;
    font-weight: 700;

    color: $text-1;
  }

  &-hashtag {
    margin-top: 1rem;

    display: flex;
    gap: 0.5rem;
  }

  &-text-preview {
    margin-top: 1rem;

    @media screen and (max-width: 1279px) {
      display: none;
    }
  }

  &-link {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.25rem;

    &__lower {
      margin-top: 1rem;
    }

    * {
      font-size: 0.875rem;
      line-height: 1.5rem;
      font-weight: 700;
      color: $blue-4 !important;
    }
  }
}

.timeline {
  display: grid;
  gap: 1rem;
  padding: 0.5rem 0;

  &-section__text {
    font-size: 0.875rem;
    line-height: 1.375rem;
    color: $gray-10;

    @media screen and (max-width: 1279px) {
      font-size: 0.75rem;
      line-height: 1.25rem;
    }
  }
}
</style>
