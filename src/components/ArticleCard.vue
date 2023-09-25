<template>
  <div class="article-card" :class="{'article-card__lg':lg}" @click="GotoArticle">
    <div v-if="imgLink" class="article-card__image">
      <b-img-lazy :src="imgLink" fluid-grow />
    </div>
    <div v-else-if="!singleBlock" class="article-card__summaryImg">
      <ul>
        <li v-for="(blockTitle, index) in blockTitles" :key="index">
          {{ blockTitle }}
        </li>
      </ul>
    </div>
    <div v-else class="article-card__contentPreview">
      <p>{{ getContent() }}</p>
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
import { Utils } from '@/utils'
import { blocksToText } from '@/utils/editorUtil'

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
    blocks: {
      type: Object,
      required: true
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
  data() {
    return {
      blockTitles: Utils.getArticleBlockTitles(this.$props.blocks, 5)
    }
  },
  computed: {
    imgLink() {
      return Utils.getArticleFirstImage(this.$props.blocks)
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
    },
    singleBlock() {
      return this.blockTitles.length === 1
    }
  },
  methods: {
    GotoArticle() {
      this.$router.push(`article/${this.articleId}`)
    },
    getContent() {
      return blocksToText(this.$props.blocks)
    }
  }
}
</script>

<style lang="scss">
.article-card {
  position: relative;
  flex: 1;
  // min-width: 304px;
  max-height: 388px;
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
      aspect-ratio: 1/1;
      object-fit: cover;
    }
  }

  &__summaryImg {
    display: flex;
    padding: 1.5rem;
    justify-content: center;
    align-items: center;
    height: 220px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 64%, rgba(0, 0, 0, 0.1) 100%);

    ul {
      display: grid;
      gap: 0.625rem;
      list-style: none;
    }

    li {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.25rem;
      color: $text-2;

      // line-clamp: 1;
      // -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      /** bullet */
      position: relative;
      padding-left: 1.5rem;
      &::before {
        display: inline-block;
        position: absolute;
        left: 0;
        content: '\2022';
        font-size: 1.5rem;
        line-height: 1.25rem;
        font-weight: bold;
        width: 1.5rem;
      }

      &:nth-child(4n-3)::before {
        color: $blue;
      }
      &:nth-child(4n-2)::before {
        color: $red;
      }
      &:nth-child(4n-1)::before {
        color: $light-blue;
      }
      &:nth-child(4n)::before {
        color: $yellow;
      }
    }
  }

  &__contentPreview {
    display: grid;
    padding: 4rem 3.25rem;
    height: 220px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 64%, rgba(0, 0, 0, 0.1) 100%);

    p {
      font-size: 1rem;
      line-height: 1.5rem;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;

      border-left: solid 2px $yellow;
      margin-left: -.75rem;
      padding-left: .75rem;
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
    .article-card__title {
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }
}
</style>
