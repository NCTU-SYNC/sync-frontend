<template>
  <b-container fluid class="article-container">
    <div
      v-if="isPageReady"
      :class="{ 'position-relative': windowScrollY > FooterOffsetTop }"
    >
      <transition name="fade" mode="out-in" :duration="500">
        <div class="d-flex justify-content-center">
          <div class="main-content-container">
            <div class="title-block mt-5">
              <div class="category">
                {{ formatCategory(category) }}
              </div>
              <div class="title-container">
                <h1 class="title-text">
                  {{ title }}
                </h1>
              </div>

              <div class="hashtag-container">
                <HashtagPill v-for="(tag, index) in tags" :key="index" :name="tag" />
              </div>
              <div class="author-info">編輯者： {{ authorsString }}</div>
            </div>

            <div
              v-for="(block, index) in blocks"
              :ref="`block-${block._id}`"
              :key="index"
              class="block"
              :class="citations.length === 0 ? 'no-citation' : ''"
            >
              <div class="block-header">
                <h2>
                  {{ block.blockTitle }}
                </h2>
                <div v-if="block.blockDateTime" class="article-info">
                  事件時間：{{
                    formatBlockDateTime(block.blockDateTime, block.timeEnable)
                  }}
                </div>
              </div>

              <TiptapEditor
                :id="block.id"
                class="editor__content"
                :content="block.content"
                :editable="false"
              />
            </div>

            <div v-if="citations.length !== 0" class="citations">
              <h2>參考資料</h2>
              <div
                v-for="(citation, index) in citations"
                :key="index"
                class="citation-item"
              >
                <div class="citation-title-label" :data-label="index + 1">{{ index + 1 }}.</div>

                <div class="citation-title-text">
                  {{ citation.title }}
                </div>

                <a class="citation-link" :href="citation.url" target="_blank">{{
                  citation.url
                }}</a>
              </div>
            </div>

            <div class="toolbar">
              <div class="toolbar__toolset">
                <b-button
                  v-b-tooltip.hover.bottom.v-secondary="'編輯內容'"
                  variant="link"
                  class="btn-icon"
                  @click="handleEditPostRoute(`${$route.path}/post`)"
                >
                  <SvgIcon icon="edit" />
                </b-button>
                <b-button
                  v-b-tooltip.hover.bottom.v-secondary="'查看編輯歷史'"
                  variant="link"
                  class="btn-icon"
                  @click="handleHistoryRoute"
                >
                  <SvgIcon icon="history-version" />
                </b-button>
                <b-button
                  v-b-tooltip.hover.bottom.v-secondary="bookmarkTooltip
                  "
                  variant="link"
                  class="btn-icon"
                  :class="isSubscribed ? 'subscribed' : ''"
                  @click="handleClickBookmark"
                >
                  <SvgIcon v-if="!isSubscribed" icon="save" />
                  <SvgIcon v-else icon="saved" />
                </b-button>
              </div>
              <div class="toolbar__toolset">
                <b-button
                  v-b-tooltip.hover.bottom.v-secondary="'分享文章'"
                  variant="link"
                  class="btn-icon"
                  @click="handleShareArticle"
                >
                  <SvgIcon icon="chain" />
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <b-toaster name="read-toaster" class="toaster" />
  </b-container>
</template>

<script>
// test id:  5f5113349779a26bd0444b26
import moment from 'moment'
import articleAPI from '@/api/article'
import TiptapEditor from '@/components/Editor/TiptapEditor.vue'
import HashtagPill from '@/components/HashtagPill.vue'
import SvgIcon from '@/components/SvgIcon.vue'

export default {
  name: 'Article',
  components: {
    HashtagPill,
    TiptapEditor,
    SvgIcon
  },
  data() {
    return {
      categoryList: [
        '即時',
        '政經',
        '國際',
        '社會',
        '科技',
        '環境',
        '生活',
        '運動'
      ],
      recommendedNews: [],
      order: 'time',
      category: [],
      title: '',
      viewCount: 32,
      tags: [],
      blocks: null,
      authors: [],
      createdAt: '',
      editedCount: 0,
      citation: {},
      lastUpdatedAt: '',
      timeId: null,
      time: moment(),
      isLogin: false,
      isSubscribed: false,
      isPageReady: false,
      windowScrollY: null,
      titleBarTop: null,
      barDistToTop: 0,
      FooterOffsetTop: 0,
      firstBlockDistToTop: 0,
      isRecommendedReady: false,
      changePageTransition: false
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
    authorsString() {
      let authorsString = ''
      const authors = this.authors
      authorsString = authors
        .slice(0, 3)
        .map((user) => user.name)
        .join(', ')
      if (authors.length > 3) {
        authorsString += ` + ${authors.length - 3} 人`
      }
      return authorsString
    },
    bookmarkTooltip() {
      return this.isSubscribed ? '取消收藏文章' : '收藏文章'
    }
  },
  watch: {
    subscribedList(newList) {
      if (newList) {
        this.isSubscribed =
          newList.findIndex((s) => s.articleId === this.articleId) >= 0
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
    this.isLogin = this.$store.getters.isLogin
    if (this.isLogin) {
      this.$store.dispatch('article/VIEW', this.articleId)
      this.isSubscribed =
        this.subscribedList.findIndex((s) => s.articleId === this.articleId) >=
        0
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
        articleAPI
          .getById(this.articleId)
          .then((response) => {
            if (response.data.code === 200) {
              const {
                title,
                authors,
                tags,
                createdAt,
                blocks,
                lastUpdatedAt,
                category,
                editedCount,
                editingCount,
                citations,
                isPopular,
                viewsCount
              } = response.data.data
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
              this.isPageReady = true
            }
            this.$store.state.post.blocks = this.blocks
          })
          .catch((err) => {
            console.error(err)
            this.isPageReady = true
          })
      }
      this.isRecommendedReady = false
      articleAPI
        .getRecommended(5)
        .then((response) => {
          const data = response.data
          if (data.code === 200) {
            const receivedNews = []
            const articles = data.data[0]
            for (const index in articles) {
              const { title, lastUpdatedAt, _id } = articles[index]
              receivedNews.push({ title, lastUpdatedAt, _id })
            }
            this.recommendedNews = receivedNews
            this.isRecommendedReady = true
          }
        })
        .catch((err) => {
          console.error(err)
          this.isRecommendedReady = true
        })
    },
    setOffsetTopOfSideElements() {
      if (!this.isPageReady) return
      this.$nextTick(() => {
        this.firstBlockDistToTop =
          this.$refs[`block-${this.blocks[0]._id}`][0].offsetTop
        setTimeout(() => {
          const footer = document.querySelector('.footer')
          this.FooterOffsetTop = footer.offsetTop - footer.offsetHeight - 518 // citation
        }, 50)
      })
    },
    handleEditPostRoute(route) {
      if (this.isLogin) {
        this.$router.push(route)
      } else {
        this.$bvModal.msgBoxOk('Please Login First')
      }
    },
    handleHistoryRoute() {
      this.$router.push(`/history/${this.articleId}`)
    },
    formatDate(timeString) {
      return moment(timeString).format('YYYY.MM.DD')
    },
    formatDateTime(timeString) {
      return moment(timeString).format('YYYY/MM/DD HH:mm')
    },
    formatBlockDateTime(timeString, timeEnable) {
      const displayTime = timeEnable || timeEnable === undefined
      return moment(timeString).format(
        `YYYY/MM/DD${displayTime ? ' HH:mm' : ''}`
      )
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
        this.$bvModal.msgBoxOk(
          `${!this.isSubscribed ? '取消' : ''}追蹤文章失敗`,
          {
            title: '追蹤文章',
            okVariant: 'danger',
            okTitle: '確定',
            footerClass: 'modal-footer-confirm',
            centered: true
          }
        )
      }
    },
    handleShareArticle() {
      navigator.clipboard.writeText(`${location.host}/#${this.$route.path}`).then(() => {
        this.$bvToast.toast('連結已複製', {
          solid: true,
          noCloseButton: true,
          toaster: 'read-toaster',
          bodyClass: 'toast__black rounded',
          autoHideDelay: 1500
        })
      }).catch((err) => {
        console.error(err)
      })
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

.main-content-container {
  width: 720px;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  margin-bottom: 50px;
  background-color: white;
  border-radius: 16px;
}

:deep(.btn-icon) {
  border: 0px;
  padding: 0;
}

.category {
  color: $blue;
  font-size: 18px;
}

.title-text {
  font-size: 2rem;
  font-weight: bold;
  line-height: 3rem;
  color: #0e0e0e;
}

.article-info {
  color: $nature-3;
  font-size: 12px;
  line-height: 20px;
}

.hashtag-container {
  font-size: 12px;
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
}

.author-info {
  font-size: 12px;
  overflow-wrap: anywhere;
}

.category-navbar {
  border-bottom: 1px solid $gray-light;
}

.category-item {
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 8px;
  color: #232323;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  border-top: solid 1px $gray-300;
  padding: 0.5rem 0;

  .toolbar__toolset {
    display: flex;
    gap: 1.5rem;
  }
}

.block {
  margin-bottom: 56px;
  .block-header {
    h2 {
      font-weight: 700;
      margin-bottom: 8px;
      line-height: 38px;
      letter-spacing: 4px;
      color: #0e0e0e;
    }
    margin-bottom: 18px;
  }
  &:last-child.no-citation {
    margin-bottom: 218px;
  }
}

.citations {
  margin-bottom: 120px;
  .citation-item {
    display: grid;
    grid-template-columns: 30px 1fr;
    grid-template-rows: 1fr 1fr;
    font-size: 18px;
    line-height: 30px;
    margin-top: 20px;

    .citation-link {
      font-size: 12px;
      color: $blue-4 !important;
      text-decoration: underline !important;
      font-weight: 400;
      word-break: break-all;
      grid-row-start: 2;
      grid-column-start: 2;
    }
  }

  .citation-title-label {
    text-align: center;
  }

  h2 {
    margin-bottom: 18px;
  }
}

.article-container {
  @media only screen and (min-width: map-get($grid-breakpoints, xl)) {
    min-height: 1080px;
  }
}

.toaster {
  position: fixed;
  top: 5.5rem;
  width: 100vw;
  display: flex;
  justify-content: center;
}

::-webkit-scrollbar {
  width: 0; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}

html {
  scroll-behavior: smooth;
}
</style>
