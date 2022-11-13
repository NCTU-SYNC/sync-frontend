<template>
  <b-container fluid class="article-container">
    <CategoryBar />
    <div
      v-if="isPageReady"
      :class="{ 'position-relative': windowScrollY > FooterOffsetTop }"
    >
      <div
        class="timeline-container py-4"
        :class="
          windowScrollY > FooterOffsetTop
            ? 'position-absolute'
            : isTimelineOutOfScreen
              ? 'position-fixed'
              : 'position-absolute'
        "
        :style="
          windowScrollY > FooterOffsetTop
            ? 'bottom: 32px; right: calc(50vw + 360px + 64px - 15px);'
            : isTimelineOutOfScreen
              ? 'top: 104px;'
              : 'top: ' + (barDistToTop - 20) + 'px;'
        "
      >
        <div class="timeline">
          <ul>
            <li
              v-for="(block, blockIndex) in blocks"
              :key="blockIndex"
              @click="scrollTo(`block-${block._id}`)"
            >
              {{ block.blockTitle }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="recommendedNews-container"
        :style="`top: ${firstBlockDistToTop}px;`"
      >
        <div class="d-flex align-items-center heading">
          <h2 class="d-inline-block mb-0">推薦新聞</h2>
          <hr class="d-inline-block line">
        </div>
        <ol>
          <li
            v-for="(recNews, recNewsIndex) in recommendedNews"
            :key="recNewsIndex"
          >
            <div class="content">
              <div class="title">
                <b-link :to="`/article/${recNews._id}`">{{
                  recNews.title
                }}</b-link>
              </div>
              <div class="date">{{ formatDate(recNews.lastUpdatedAt) }}</div>
            </div>
          </li>
        </ol>
      </div>
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
                <b-link
                  v-for="(tag, tagIndex) in tags"
                  :key="tagIndex"
                  :to="{path: '../hashtag', query: { q: tag } }"
                  class="hashtag"
                >
                  #{{ tag }}
                </b-link>
              </div>
              <div class="article-info d-flex justify-content-between">
                <div class="seen-edit-info">
                  觀看數：{{ viewCount }}｜編輯數：{{ editedCount }}
                </div>
                <div class="lastUpdated">
                  最後更新時間 {{ formatDateTime(lastUpdatedAt) }}
                </div>
              </div>
              <hr ref="title-gray-bar">
              <div class="d-flex justify-content-between">
                <div class="author-info">編輯者： {{ authorsString }}</div>
                <div class="icons">
                  <b-button
                    v-b-tooltip.hover.bottom.v-secondary="'編輯內容'"
                    class="btn-icon mx-3"
                    @click="handleEditPostRoute(`${$route.path}/post`)"
                  >
                    <SyncIcon icon="edit" />
                  </b-button>

                  <b-button
                    v-b-tooltip.hover.bottom.v-secondary="'查看編輯歷史'"
                    class="btn-icon mx-3"
                    @click="handleHistoryRoute"
                  >
                    <SyncIcon icon="history-version" />
                  </b-button>

                  <b-button
                    v-b-tooltip.hover.bottom.v-secondary="bookmarkTooltip"
                    class="btn-icon ml-3"
                    :class="isSubscribed ? 'subscribed' : ''"
                    @click="handleClickBookmark"
                  >
                    <SyncIcon v-if="!isSubscribed" icon="save" />
                    <SyncIcon v-else icon="saved" />
                  </b-button>
                </div>
              </div>
            </div>

            <div
              v-for="(block, index) in blocks"
              :ref="`block-${block._id}`"
              :key="index"
              class="block"
              :class="citations.length === 0 ? 'no-citation' : ''"
            >
              <div class="block-header">
                <div class="d-flex justify-content-between">
                  <h2>
                    {{ block.blockTitle }}
                  </h2>
                  <b-button
                    v-b-tooltip.hover.bottom.v-secondary="'分享段落'"
                    class="btn-share"
                    @click="getBlockLink(block._id)"
                  >
                    <b-icon icon="share-fill" />
                  </b-button>
                </div>
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
              <hr>
              <h2>新聞來源</h2>
              <div
                v-for="(citation, index) in citations"
                :key="index"
                class="citation-item"
              >
                <div
                  class="citation-title d-flex justify-content-start align-items-start"
                >
                  <div class="citation-title-square">
                    <div class="citation-title-label" :data-label="index + 1" />
                  </div>
                  <div class="citation-title-text">
                    {{ citation.title }}
                  </div>
                </div>
                <a class="citation-link" :href="citation.url" target="_blank">{{
                  citation.url
                }}</a>
              </div>
            </div>
          </div>
          <b-toast
            id="share-block-toast"
            toast-class="share-block-toast--toast"
            body-class="share-block-toast--toast-body"
            toaster="share-block-toaster"
            no-close-button
            auto-hide-delay="2500"
          >
            已將連結複製到剪貼簿
          </b-toast>
          <b-toaster
            class="b-toaster-bottom-center share-block-toast--toaster"
            name="share-block-toaster"
          />
        </div>
      </transition>
    </div>
  </b-container>
</template>

<script>
// test id:  5f5113349779a26bd0444b26
import moment from 'moment'
import articleAPI from '@/api/article'
import TiptapEditor from '@/components/Editor/TiptapEditor.vue'
import CategoryBar from '@/components/CategoryBar.vue'

export default {
  name: 'Article',
  components: {
    TiptapEditor,
    CategoryBar
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
      // hack to scroll to block after sidebar set
      this.$nextTick(() => {
        this.scrollToBlock()
      })
    },
    '$route.params.ArticleID'() {
      this.getArticleData()
    },
    '$route.query'() {
      this.scrollToBlock()
    }
  },
  created() {
    this.$on('reloadData', this.getArticleData)

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
        this.barDistToTop = this.$refs['title-gray-bar'].offsetTop
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
    scrollTo(refName) {
      const element = this.$refs[refName][0]
      const top = element.offsetTop
      window.scrollTo({ left: 0, top: top - (64 + 10), behavior: 'smooth' })
    },
    updateScroll() {
      this.windowScrollY = window.scrollY
    },
    checkBlockExists(blockId) {
      const refName = `block-${blockId}`
      return refName in this.$refs
    },
    // if query block set, scroll to respective block
    scrollToBlock() {
      // check if query exists
      const query = this.$route.query
      if ('block' in query && this.checkBlockExists(query['block'])) {
        // scroll to block if block exists
        const blockRef = `block-${query['block']}`
        this.$nextTick(() => {
          this.scrollTo(blockRef)
        })
      }
    },
    getBlockLink(blockId) {
      console.log(blockId)
      const url = window.location.origin + '/#' + this.$route.path
      const query = `?block=${blockId}`
      this.copyToClipBoard(url + query)
      this.$nextTick(() => {
        this.$bvToast.show('share-block-toast')
      })
    },
    copyToClipBoard(textToCopy) {
      navigator.clipboard.writeText(textToCopy)
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
  margin-bottom: 50px;
}

:deep(.btn-icon) {
  border: 0px;
  background-color: #ffffff;
  padding: 0;
}

:deep(.btn-share) {
  border: 0px;
  background-color: #ffffff;
  padding: 0;
  color: black;
  height: 32px;
  width: 32px;
}

.category {
  color: $blue;
  font-size: 18px;
  margin-bottom: 16px;
}

.title-text {
  font-size: 36px;
  font-weight: bold;
  line-height: 56px;
  margin-bottom: 10px;
  color: #0e0e0e;
}

.article-info {
  color: $nature-3;
  font-size: 12px;
  line-height: 20px;
}

.hashtag-container {
  margin-bottom: 24px;
  .hashtag {
    font-size: 12px;
    color: $blue !important;
    margin-right: 12px;
  }
}

.author-info {
  font-size: 12px;
  overflow-wrap: anywhere;
}

.icons {
  flex-shrink: 0;
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
    margin-top: 20px;
    .citation-title {
      margin-bottom: 8px;
      line-height: 24px;
      .citation-title-square {
        margin-top: 4px;
        margin-right: 16px;
        line-height: 16px;
        display: flex;
        justify-content: center;
        width: 1rem;
        height: 1rem;
        background-color: $gray-light;
      }
      .citation-title-label {
        &:before {
          content: attr(data-label);
          width: 2rem;
        }
        font-size: 11px;
      }
    }
    .citation-link {
      font-size: 12px;
      text-decoration: none !important;
      color: #a8a8a8 !important;
      font-weight: 400;
      word-break: break-all;
    }
  }
  hr {
    margin-bottom: 40px;
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

.timeline-container {
  @include hide-below-desktop;
  max-height: calc(100vh - 110px);
  overflow-y: scroll;
  right: calc(50vw + 360px + 64px);
  padding-left: 16px;
  padding-right: 0px;
  .timeline {
    position: relative;
  }
  ul {
    padding: 0;
    border-left: 1px solid $gray-light;
    padding-left: 16px;
    padding-top: 24px;
    padding-bottom: 24px;
    margin: 0;
    li {
      width: 240px;
      margin-bottom: 24px;
      list-style: none;
      cursor: pointer;
      line-height: 24px;
      position: relative;
      &::before {
        content: ' ';
        position: absolute;
        background: $blue;
        height: 8px;
        width: 8px;
        top: 8px;
        left: -20.5px;
        border-radius: 50%;
      }
    }
    &::before {
      content: ' ';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 10px;
      height: 10px;
      border: 1px solid $gray-light;
      background-color: white;
      transform: translate(-4.5px, -5px);
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 6px;
      height: 6px;
      border-bottom: 1px solid $gray-light;
      border-right: 1px solid $gray-light;
      transform-origin: top;
      -moz-transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform-origin: center;
      transform: translate(-2.5px) rotate(45deg);
    }
  }
}

::-webkit-scrollbar {
  width: 0; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}

.recommendedNews-container {
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
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .date {
        font-size: 12px;
        color: $nature-3;
        font-weight: 400;
        line-height: 20px;
      }
    }
    li::before {
      content: '0' counter(rec-count);
      color: $nature-3;
      font-size: 20px;
      margin-top: -3px;
    }
  }
}

html {
  scroll-behavior: smooth;
}
</style>

<style lang="scss">

//toast animation

@keyframes toastAnimation {
  from {
    transform: translateY(3.5rem);
  }
  to {
    transform: translateY(-3.5rem);
  }
}
.share-block-toast {
  &--toast {
    position: relative;
    background-color: $blue !important;
    border-radius: 0.5rem;
    transform: translateY(-3.5rem);

    animation-name: toastAnimation;
    animation-duration: 0.3s;
    animation-timing-function: ease;
  }

  &--toast-body {
    font-size: 18px;
    line-height: 30px;
    color: $white;
    padding: 0.5rem 1rem;
  }

  &--toaster {
    div {
      display: flex;
      width: fit-content;
      margin: 0 auto;
    }
  }
}
</style>
