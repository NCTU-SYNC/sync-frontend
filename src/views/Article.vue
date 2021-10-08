<template>
  <b-container fluid class="article-container">
    <CategoryBar />
    <div v-if="isPageReady">
      <div
        class="timeline-container py-4"
        :class=" isTimelineOutOfScreen ? 'position-fixed' : 'position-absolute'"
        :style=" isTimelineOutOfScreen ? 'top: 104px;' : 'top: ' + (barDistToTop-20) +'px;'"
      >
        <ul>
          <li class="circle" />
          <li v-for="(block, blockIndex) in blocks" :key="blockIndex" class="circle" @click="scrollTo(`block-${block._id}`)">
            {{ block.blockTitle }}
          </li>
          <li class="circle" />
        </ul>
      </div>
      <div
        class="recommendedNews-container"
        :style="`top: ${firstBlockDistToTop}px;`"
      >
        <div class="d-flex align-items-center heading">
          <h2 class="d-inline-block mb-0">推薦新聞 </h2>
          <hr class="d-inline-block line">
        </div>
        <ol>
          <li v-for="(recNews, recNewsIndex) in recommendedNews" :key="recNewsIndex">
            <div class="content">
              <div class="title">{{ recNews.title }}</div>
              <div class="date">{{ recNews.lastUpdatedAt }}</div>
            </div>
          </li>
        </ol>
      </div>
      <transition
        name="fade"
        mode="out-in"
        :duration="500"
      >
        <div class="d-flex justify-content-center">
          <div id="all">
            <div id="title-block" class="mt-5">
              <div id="category" class="mb-3">
                {{ formatCategory(category) }}
              </div>
              <div id="title-container">
                <h1 id="title-text">
                  {{ title }}
                </h1>
              </div>

              <div class="my-3">
                <span v-for="(tag, tagIndex) in tags" :key="tagIndex" class="article-tags"> #{{ tag }} </span>
              </div>
              <div class="article-info d-flex justify-content-between">
                <div id="seen-edit-info">觀看數：{{ viewCount }}｜編輯數：{{ editedCount }}</div>
                <div id="lastUpdated">最後更新時間 {{ formatTime(lastUpdatedAt) }}</div>
              </div>
              <hr ref="title-gray-bar" class="my-3">
              <div class="d-flex justify-content-between">
                <div id="author-info">
                  編輯者： {{ authorsString }}
                </div>
                <div id="icons">
                  <b-button
                    v-b-tooltip.hover.bottom.v-secondary="'編輯內容'"
                    class="btn-icon mx-3"
                    @click="handleEditPostRoute(`${$route.path}/post`)"
                  >
                    <icon icon="edit" />
                  </b-button>

                  <b-button
                    v-b-tooltip.hover.bottom.v-secondary="'查看編輯歷史'"
                    class="btn-icon mx-3"
                    @click="handleHistoryRoute"
                  >
                    <icon icon="history-version" />
                  </b-button>

                  <b-button
                    v-b-tooltip.hover.bottom.v-secondary="bookmarkTooltip"
                    class="btn-icon ml-3"
                    :class="isSubscribed ? 'subscribed': ''"
                    @click="handleClickBookmark"
                  >
                    <icon v-if="!isSubscribed" icon="save" />
                    <icon v-else icon="saved" />
                  </b-button>
                </div>
              </div>
            </div>

            <div
              v-for="(block, index) in blocks"
              :ref="`block-${block._id}`"
              :key="index"
              class="block"
              :class="citations.length===0?'no-citation':''"
            >

              <div class="block-header">
                <h2>
                  {{ block.blockTitle }}
                </h2>
                <div class="article-info mt-2">
                  {{ formatTime(block.blockDateTime) }}
                </div>
              </div>

              <TiptapEditor
                class="editor__content"
                :content="block.content"
                :editable="false"
              />

            </div>

            <div v-if="citations.length!==0" class="citations">
              <hr>
              <h2>新聞來源</h2>
              <div v-for="(citation, index) in citations" :key="index" class="citation-item">
                <div class="citation-title d-flex justify-content-start align-items-center">
                  <div class="citation-list-square">
                    <div class="citation-label" :data-label="index + 1" />
                  </div>
                  <div class="w-100 pl-3">
                    {{ citation.title }}
                  </div>
                </div>
                <a class="citation-link" :href="citation.url" target="_blank">{{ citation.url }}</a>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </b-container>
</template>

<script>
// test id:  5f5113349779a26bd0444b26
import moment from 'moment'
import { getArticleById } from '@/api/article'
import TiptapEditor from '@/components/Editor/TiptapEditor.vue'
import CategoryBar from '@/components/CategoryBar.vue'

export default {
  name: 'Article',
  components: {
    TiptapEditor, CategoryBar
  },
  data() {
    return {
      categoryList: ['即時', '政經', '國際', '社會', '科技', '環境', '生活', '運動'],
      recommendedNews: [
        { title: '華航疫情案再增2機師確診1名回溯採檢、1名居家', lastUpdatedAt: '2021.04.26' },
        { title: '華航疫情案再增2機師確診1名回溯採檢、1名居家', lastUpdatedAt: '2021.04.26' },
        { title: '華航疫情案再增2機師確診1名回溯採檢、1名居家', lastUpdatedAt: '2021.04.26' },
        { title: '華航疫情案再增2機師確診1名回溯採檢、1名居家', lastUpdatedAt: '2021.04.26' },
        { title: '華航疫情案再增2機師確診1名回溯採檢、1名居家', lastUpdatedAt: '2021.04.26' }
      ],
      order: 'time',
      category: [],
      title: '',
      viewCount: 32,
      tags: [],
      blocks: [],
      authors: [],
      createdAt: '',
      editedCount: 0,
      citations: [],
      lastUpdatedAt: '',
      timeId: null,
      time: moment(),
      isLogin: false,
      isSubscribed: false,
      isPageReady: false,
      windowScrollY: null,
      titleBarTop: null,
      barDistToTop: 0,
      firstBlockDistToTop: 0
    }
  },
  computed: {
    getYear() {
      return this.time.getFullYear()
    },
    getMonth() {
      return this.time.getMonth()
    },
    articleId() {
      return this.$route.params.ArticleID
    },
    subscribedList() {
      return this.$store.getters['article/subscribedList']
    },
    isTimelineOutOfScreen() {
      return this.windowScrollY > this.barDistToTop - 124
    },
    authorsString() {
      let authorsString = ''
      const authors = this.authors
      authorsString = authors.slice(0, 3).map(user => user.name).join(', ')
      if (authors.length > 3) { authorsString += ` + ${authors.length - 3} 人` }
      return authorsString
    },
    bookmarkTooltip() {
      return this.isSubscribed ? '取消收藏文章' : '收藏文章'
    }
  },
  watch: {
    subscribedList(newList) {
      if (newList) {
        this.isSubscribed = newList.findIndex(s => s.articleId === this.articleId) >= 0
        return
      }
      this.isSubscribed = false
    },
    isPageReady(newValue) {
      this.$store.commit('SET_FOOTER', newValue)
      this.setOffsetTopOfSideElements()
    },
    '$route.params.ArticleID': function() {
      this.getArticleData()
    }
  },
  created() {
    this.$on('reloadData', this.getArticleData)
    this.time = moment()
    this.timeId = setInterval(() => {
      this.time = moment()
    }, 1000)

    this.getArticleData()

    // check if user logged in
    this.isLogin = !!this.$store.getters.token
    if (this.isLogin) {
      this.$store.dispatch('article/VIEW', this.articleId)
      this.isSubscribed = this.subscribedList.findIndex(s => s.articleId === this.articleId) >= 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
  },
  beforeDestroy() {
    clearInterval(this.timeId)
    this.time = null
    window.removeEventListener('scroll', this.updateScroll)
  },
  methods: {
    getArticleData() {
      if (this.articleId) {
        this.isPageReady = false
        getArticleById(this.articleId).then(response => {
          if (response.data.code === 200) {
            const { title, authors, tags, createdAt, blocks, lastUpdatedAt, category, editedCount, editingCount, citations, isPopular, viewsCount } = response.data.data
            this.title = title
            this.authors = authors
            this.tags = tags
            this.createdAt = createdAt
            this.lastUpdatedAt = lastUpdatedAt
            this.blocks = blocks
            this.category = category
            this.editedCount = editedCount
            this.viewCount = viewsCount
            this.editingCount = editingCount
            this.isPopular = isPopular
            this.citations = citations
            this.citations.forEach((citation, index) => {
              this.$store.commit('post/SET_CITATION', { index, citation })
            })
            this.isPageReady = true
          }
        }).catch(err => {
          console.error(err)
          this.isPageReady = true
        })
      }
    },
    setOffsetTopOfSideElements() {
      this.$nextTick(() => {
        this.barDistToTop = this.$refs['title-gray-bar'].offsetTop
        this.firstBlockDistToTop = this.$refs[`block-${this.blocks[0]._id}`][0].offsetTop
      })
    },
    handleEditPostRoute(route) {
      if (this.isLogin) { this.$router.push(route) } else { this.$bvModal.msgBoxOk('Please Login First') }
    },
    handleHistoryRoute() {
      this.$router.push(`/history/${this.articleId}`)
    },
    formatDate(timeString) {
      return moment(timeString).format('YYYY.MM.DD')
    },
    formatTime(timeString) {
      return moment(timeString).format('YYYY/MM/DD HH:mm')
    },
    formatCategory(category) {
      return category === '' ? '未分類' : category
    },
    async handleClickBookmark() {
      try {
        if (!this.isSubscribed) {
          await this.$store.dispatch('article/SUBSCRIBE', this.articleId)
        } else {
          this.$store.dispatch('article/UNSUBSCRIBE', this.articleId)
        }
      } catch (error) {
        this.$bvModal.msgBoxOk(`${!this.isSubscribed ? '取消' : ''}追蹤文章失敗`, {
          title: '追蹤文章',
          okVariant: 'danger',
          okTitle: '確定',
          footerClass: 'modal-footer-confirm',
          centered: true
        })
      }
    },
    scrollTo(refName) {
      const element = this.$refs[refName][0]
      const top = element.offsetTop
      window.scrollTo({ left: 0, top: top - (64 + 10), behavior: 'smooth' })
    },
    updateScroll() {
      this.windowScrollY = window.scrollY
    }
  }

}
</script>

<style scoped lang="scss">
@import '@/assets/scss/news.scss';

p {
  letter-spacing: 0.25rem;
}

#all {
  width: 720px;
}

#title-block {
  margin-bottom: 50px;
}

.btn-icon {
  &::v-deep{
    border: 0px;
    background-color: #ffffff;
    padding: 0;
  }
}

#category {
  color: $blue;
  font-size: 18px;
}

#title-text {
  font-size: 36px;
  font-weight: bold;
  line-height: 56px;
}

.article-info {
  color: $nature-3;
  font-size: 12px;
}

.article-tags {
  font-size: 12px;
  color: $blue;
}

#author-info {
  font-size: 12px;
  overflow-wrap: anywhere;
}

#icons {
  flex-shrink: 0;
}

.category-navbar{
  border-bottom: 1px solid $gray-light;
}

.category-item{
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 8px;
  color: #232323;
}

.block{
  margin-bottom: 56px;
  .block-header{
    margin-bottom: 18px;
  }
  &:last-child.no-citation{
    margin-bottom: 218px;
  }
}

.citations {
  margin-bottom: 218px;
  .citation-title {
    margin-bottom: 7px;
  }
  hr {
    margin-bottom: 40px;
  }
  h2 {
    margin-bottom: 18px;
  }
  .citation-list-square {
    display: flex;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    background-color: $gray-light;
  }
  .citation-label {
    &:before {
      content: attr(data-label);
      width: 2rem;
    }
    font-size: 11px;
  }
  .citation-link {
    margin-top: 7px;
    text-decoration: none !important;
    color: $nature-3 !important;
  }
}

.article-container {
  @media only screen and (min-width: map-get($grid-breakpoints, xl)){
    min-height: 1080px;
  }
}

.timeline-container {
  @include hide-below-desktop;
  width: 240px;
  right: calc(50vw + 360px + 64px);
  padding-left: 16px;
  padding-right: 0px;
}

.recommendedNews-container{
  @include hide-below-desktop;
  position: absolute;
  width: 264px;
  left: calc(50vw + 360px + 64px);
  .heading {
    margin-bottom: 16px;
  }
  hr.line {
    width: 129px;
    border-top: 1px solid #232323;
    margin-right: 0px;
  }

  ol {
    list-style: none;
    counter-reset: rec-count;
    padding: 0;
    li {
      counter-increment: rec-count;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      .content {
        width: 225px;
      }
      .title {
        margin-bottom: 8px;
        letter-spacing: 2px;
      }
      .date {
        font-size: 12px;
        color: $nature-3;
      }
    }
    li::before {
      content: "0" counter(rec-count);
      color: $nature-3;
      font-size: 20px;
      margin-top: -3px;
    }
  }
}

li.circle{
  position: relative;
  margin: 0;
  padding-bottom: 1em;
  padding-left: 20px;
  list-style: none;

  &:hover{
    cursor: pointer;
  }

  &:last-child::after {
    content: '↓';
    color: $gray-light;
    font-weight: bold;
    position: absolute;
    left: -5.4px;
    top: 8px;
    background-image: none;
  }
  &::before{
    background-color: $gray-light;
    width: 2px;
    content: '';
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
  }
  &:first-child::after{
      content: '';
      position: absolute;
      background-image: url('~@/assets/materials/ma-timeline-square.svg');
      background-repeat: no-repeat;
      background-size: contain;
      left: -4.51px;
      top: -10px;
      width: 10px;
      height: 10px;
  }
  &::after{
    content: '';
    position: absolute;
    background-image: url('~@/assets/materials/ma-timeline-circle.svg');
    background-repeat: no-repeat;
    background-size: contain;
    left: -3.51px;
    top: 8px;
    width: 8px;
    height: 8px;
  }
}

html {
  scroll-behavior: smooth;
}

</style>
