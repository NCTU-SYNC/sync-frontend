<template>
  <div class="card-container" :class="{'card__lg':lg}" @click="goToArticle">
    <div class="card-title">
      {{ title }}
    </div>
    <div class="card-info">
      <span class="card-info__time">
        <sync-icon size="md" icon="timer" />
        {{ lastUpdatedFromNow }}發布
      </span>
      <span class="card-info__status">
        <span class="card-info__status_pill">
          <sync-icon size="sm" icon="pen-red" />
          <span>{{ editingStatus }}</span>
        </span>
        <sync-icon v-if="editingNow > 0" size="md" icon="lifting-red" />
      </span>
    </div>
    <div class="card-text">
      {{ body }}
    </div>
    <button class="card-btn" @click.stop="goToEdit">加入編輯</button>
  </div>
</template>

<script>
import moment from 'moment'
import { blocksToText } from '@/utils/editorUtil'

export default {
  name: 'AwaitEditCard',
  props: {
    articleId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'title'
    },
    blocks: {
      type: Array,
      default: () => []
    },
    lastUpdatedAt: {
      type: String,
      default: 'time'
    },
    editingNow: {
      type: Number,
      default: 0
    },
    lg: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    body() {
      return blocksToText(this.blocks)
    },
    lastUpdatedFromNow() {
      return moment(this.lastUpdatedAt).locale('zh-tw').fromNow()
    },
    editingStatus() {
      return this.editingNow === 0 ? '等待編輯中' : this.editingNow
    }
  },
  methods: {
    goToArticle() {
      this.$router.push(`/article/${this.articleId}`)
    },
    goToEdit() {
      this.$router.push(`article/${this.articleId}/post`)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  &-container {
    display: flex;
    flex-direction: column;
    width: 304px;
    height: 292px;
    border-radius: 16px;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
    padding: 20px;
    gap: 1rem;

    &:hover {
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.16);
      cursor: pointer;
    }
  }

  &-title {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.875rem;
    color: $text-1;

    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.5rem;
    font-size: 0.875rem;

    &__time {
      display: flex;
      color: $text-2;
    }

    &__status {
      display: flex;
      gap: 0.5rem;

      &_pill {
        display: flex;
        justify-content: end;
        align-items: center;
        padding: 0 10px;
        gap: 0.5rem;
        color: $text-1;
        background-color: $red-1;
        border-radius: 12px;

        & > svg {
          width: 0.75rem;
          height: 0.75rem;
        }
      }
    }
  }

  &-text {
    font-size: 1rem;
    line-height: 1.5rem;
    color: $text-2;

    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &-btn {
    width: 100%;
    height: 48px;
    margin-top: auto;
    background-color: $blue-4;
    border: 0;
    border-radius: 8px;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.875rem;
    color: $white;
    cursor: pointer;
  }

  &__lg {
    width: 460px;
    height: 272px;

    & .card-title {
      font-size: 1.5rem;
      line-height: 2rem;
    }

    & .card-text {
      line-clamp: 2;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
