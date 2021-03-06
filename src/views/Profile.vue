<template>
  <b-container fluid="lg">
    <b-row>
      <b-col>
        <b-row>
          <b-col cols="9" class="d-flex justify-content-center align-items-center">
            <div class="d-flex justify-content-center align-items-center">
              <b-img-lazy class="avatar" :src="photoURL" />
            </div>
            <div class="d-flex flex-column justify-content-center ml-4">
              <h3>{{ displayName }}</h3>
              <p>ID: {{ uid }}</p>
            </div>
          </b-col>
          <b-col cols="3" class="d-flex flex-column justify-content-center">
            <p>貢獻值：<span>尚未開始採計</span></p>
            <p>帳戶創建日期：</p>
            <p class="text-gray">{{ creationDateTime }}</p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-2 no-gutters">
      <b-col>
        <ul role="tablist" class="options-nav">
          <li :aria-selected="currentShowingIndex === 0" role="tab" class="option-name">
            <a @click="onOptionClicked(0)"><span class="option-text">我編輯過的文章</span></a>
          </li>
          <li :aria-selected="currentShowingIndex === 1" role="tab" class="option-name">
            <a @click="onOptionClicked(1)"><span class="option-text">我瀏覽過的文章</span></a>
          </li>
          <li :aria-selected="currentShowingIndex === 2" role="tab" class="option-name">
            <a @click="onOptionClicked(2)"><span class="option-text">我追蹤的文章</span></a>
          </li>
          <li aria-selected="false" role="tab" class="option-name">
            <a><span class="option-text">設定</span></a>
          </li>
        </ul>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 class="profile-title">最近一週</h4>
      </b-col>
    </b-row>
    <slot v-for="article in showingArticles">
      <ArticleListItem :article="article" />
    </slot>
    <div class="m-4" />
  </b-container>
</template>

<script>
import ArticleListItem from '@/components/Profile/ArticleListItem.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getArticlesInfo } from '@/api/user'

export default {
  name: 'Profile',
  components: {
    ArticleListItem
  },
  data() {
    return {
      articles: {},
      showingArticles: [],
      currentShowingIndex: 0
    }
  },
  computed: {
    ...mapGetters(['photoURL', 'displayName', 'uid', 'isLogin']),
    ...mapGetters({ createAt: 'user/createAt' }),
    creationDateTime() {
      return this.createAt ? moment(parseInt(this.createAt)).format('YYYY年M月D日 HH:mm') : ''
    }
  },
  watch: {
    isLogin(newValue) {
      if (newValue) {
        this.init()
      }
    }
  },
  mounted() {
    if (this.$store.getters.isLogin) {
      this.init()
    }
  },
  methods: {
    async init() {
      console.log('isLogin')
      const { data } = await getArticlesInfo({ token: this.$store.getters.token })
      if (data.code === 200) {
        this.articles = data.data
        this.onOptionClicked(0)
      }
    },
    onOptionClicked(index) {
      this.currentShowingIndex = index
      switch (index) {
        case 2:
          this.showingArticles = this.articles.viewed
          break
        case 1:
          this.showingArticles = this.articles.subscribed
          break
        case 0:
        default:
          this.showingArticles = this.articles.edited
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.avatar {
  border-radius: 50%;
  width: 100%;
  height: auto;
  max-width: 150px;
  max-height: 150px;
}

.options-nav {
  margin-top: 2rem;
  padding: 0;
  display: flex;
  justify-content: space-around;
  position: relative;
  list-style: none;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $black;
  }

  .option-name[aria-selected='true'] .option-text {
    color: $primary;
    border-bottom: 3px solid $primary;
  }

  .option-name .option-text {
    cursor: pointer;
    display: inline-block;
    font-size: 1rem;
    color: #b9b9b9;
    padding-bottom: 1rem;
    margin-right: 0;
    letter-spacing: 0.25rem;
    text-indent: 0.25rem;
  }
}

.profile-title {
  margin: 1rem 0;
  color: rgb(49, 87, 211)
}
</style>
