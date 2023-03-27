<template>
  <div class="topic-recommend d-flex justify-content-center">
    <div
      class="topic-recommend__box d-flex flex-column justify-content-center align-items-start"
    >
      <div class="title"> 為你推薦更多 </div>
      <div class="hashtag_container">
        <div class="content mb-4"> 選擇有興趣主題閱讀更多相關內容 </div>
        <div class="d-flex flex-wrap">
          <HashtagPill
            v-for="(tag, tagIndex) in hashtags"
            :key="tagIndex"
            style="margin: 8px"
            :name="tag"
          />
        </div>
      </div>
      <div v-if="!isLogin" class="content">
        已經有一個 SYNC 帳戶？
        <b-link :to="{ name: 'Login'}"> 登入 </b-link>
        以查看更多推薦內容？
      </div>
    </div>
  </div>
</template>

<script>
import HashtagPill from '@/components/HashtagPill.vue'
import hashtagAPI from '@/api/hashtag'
import { mapGetters } from 'vuex'

export default {
  name: 'RecommendHashtag',
  components: {
    HashtagPill
  },
  data() {
    return {
      hashtags: []
    }
  },
  computed: {
    ...mapGetters([
      'isLogin'
    ])
  },
  created() {
    this.getRecommendHashtags()
  },
  methods: {
    async getRecommendHashtags() {
      await hashtagAPI
        .getRecommendHashtags()
        .then((response) => { this.hashtags = response })
        .catch((err) => console.error(err))
    }
  }
}
</script>

<style lang="scss" scoped>
.topic-recommend {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.4;
    background-image: url('../../src/assets/images/TopicRecommendBG.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  &__box {
    max-width: 1233px;
    margin: 2.5rem 4rem;
    gap: 2rem;
  }

  .title{
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 2px;
  }

  .content{
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
  }

  .hashtag_container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
