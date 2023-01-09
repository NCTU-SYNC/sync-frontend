<template>
  <div class="topic-recommend d-flex justify-content-center">
    <div
      style="width: 100%; max-width: 1200px; margin: 40px 20px"
      class="d-flex flex-column justify-content-center align-items-start"
    >
      <div class="title"> 為你推薦更多 </div>
      <div class="content"> 選擇有興趣主題閱讀更多相關內容 </div>
      <div class="d-flex flex-wrap">
        <HashtagPill
          v-for="(tag, tagIndex) in hashtags"
          :key="tagIndex"
          style="margin: 8px"
          :name="tag"
        />
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
  height: 424px;
  margin: 0 -15px;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.4;
    background-image: url('../../src/assets/images/TopicRecommendBG.svg');
  }

  .title{
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 2px;
  }

  .content{
    margin: 32px 0;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
  }
}
</style>
