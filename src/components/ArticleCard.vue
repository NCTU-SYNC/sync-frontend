<template>
  <div class="article-card" :class="{'article-card__lg':lg}" @click="GotoArticle">
    <div class="article-card__image">
      <b-img-lazy :src="imgSrc" fluid-grow />
    </div>
    <div class="article-card__body">
      <div v-show="hasCate" class="article-card__category">{{ category === '' ? '未分類' : category }}</div>
      <div class="article-card__title">{{ title }}</div>
      <div v-show="hasTags" class="article-card__hashtag">
        <hashtag-pill v-for="(tag, tagIndex) in tags" :key="tagIndex" :name="tag" />
      </div>
    </div>
    <div v-show="hasBadge" class="article-card__badge">
      <b-img-lazy :src="badgeImgSrc" />
    </div>
  </div>
</template>

<script>
import { BImgLazy } from 'bootstrap-vue'
import HashtagPill from '@/components/HashtagPill.vue'
import BadgeHot from '@/assets/images/badge-hot.svg'
import BadgeNew from '@/assets/images/badge-new.svg'
import thumbnail from '@/assets/images/thumbnail-placeholder.svg'

const badge = new Map([
  ['badge-hot', BadgeHot],
  ['badge-new', BadgeNew]
])

export default {
  name: 'ArticleCard',
  components: {
    'b-img-lazy': BImgLazy,
    'hashtag-pill': HashtagPill
  },
  props: {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: null
    },
    tags: {
      type: Array,
      default: () => []
    },
    imageURL: {
      type: String,
      default: ''
    },
    articleId: {
      type: String,
      required: true
    },
    badge: {
      type: String,
      default: '',
      validator: (value) => {
        return ['', 'hot', 'new'].includes(value)
      }
    },
    lg: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    imgSrc() {
      return this.imageURL === '' ? thumbnail : this.imageURL
    },
    hasTags() {
      return this.tags.length > 0
    },
    hasCate() {
      return this.category !== null
    },
    hasBadge() {
      return this.badge !== ''
    },
    badgeImgSrc() {
      return badge.get(`badge-${this.badge}`)
    }
  },
  methods: {
    GotoArticle() {
      this.$router.push(`article/${this.articleId}`)
    }
  }
}
</script>

<style lang="scss" >
.article-card {
  position: relative;
  flex: 1;
  width: 320px;
  max-height: 388px;
  min-width: 304px;
  border-radius: 16px;
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.16);
    cursor: pointer;
  }

  &__body {
    padding: 1.25rem;
    padding-bottom: 1.5rem;
  }

  &__image {
    height: 220px;
    overflow: hidden;
    border-radius: 16px 16px 0 0;
    margin: auto;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__category {
    font-size: 0.875rem;
    color: $gray-8;
    line-height: 1.25rem;
    -webkit-line-clamp: 2;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.875rem;
    color: $text-1;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  &__hashtag {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  &__badge {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  &__lg {
    width: 392px;

    .article-card__title {
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }
}
</style>
