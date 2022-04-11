<template>
  <b-container class="wrapper">
    <b-row
      style="position: relative"
      :class="{ 'justify-content-center': !showNewsSource }"
    >
      <div v-if="isTimelineShow" align-self="stretch" class="timeline-panel">
        <div class="bg-light timeline-header">
          <b-button
            variant="transparent"
            block
            class="btn-edit"
            @click="handleShowTimeline(false)"
          >
            <b-icon icon="chevron-left" />
            段落標題
          </b-button>
        </div>
        <div class="timeline-container">
          <a
            v-for="(block, index) in blocks"
            :key="index"
            class="timeline"
            @click="focusOnTitle(block.id)"
          >
            <div class="rectangle" />
            {{ block.blockTitle !== '' ? block.blockTitle : '段落尚無標題' }}
          </a>
        </div>
      </div>
      <div
        v-else
        class="timeline-panel-btn-only"
        :class="{ 'timeline-shrink': showNewsSource }"
      >
        <b-button
          variant="light"
          class="btn-edit"
          @click="handleShowTimeline(true)"
        >
          <icon icon="edit-timeline" />
          <span v-if="!showNewsSource">段落標題</span>
        </b-button>
      </div>
      <div class="main-editor-area">
        <b-card no-body class="edit-card edit-row">
          <b-card-body body-class="edit-card-body">
            <label class="sr-only" for="post-title">標題</label>
            <div class="d-flex justify-content-start w-100">
              <b-form-input
                v-model="postTitle"
                size="lg"
                class="post-title"
                placeholder="文章標題"
                required
              />
              <b-dropdown
                ref="categoryRef"
                class="bg-white rounded category-dropdown"
                toggle-class="p-0 text-truncate text-decoration-none category-dropdown-btn"
                variant="link"
                no-caret
                @hide="dropdownOpen = false"
                @show="dropdownOpen = true"
              >
                <template #button-content>
                  <div
                    class="dropdownbtn-text"
                    :class="{ 'btn-text-left': categorySelected !== '' }"
                  >
                    {{
                      categorySelected === '' ? '文章分類' : categorySelected
                    }}
                  </div>
                  <div class="btn-chevron">
                    <icon
                      :icon="dropdownOpen ? 'arrow-up' : 'arrow-down'"
                      size="md"
                    />
                  </div>
                </template>
                <b-dropdown-item-button
                  v-for="(category, categoryIndex) in categoryList"
                  :key="categoryIndex"
                  :active="categorySelected === category"
                  active-class="active-btn"
                  button-class="dropdown-btn"
                  @click="categorySelected = category"
                >
                  {{ category }}
                </b-dropdown-item-button>
              </b-dropdown>
            </div>
            <div class="title-card-row title-card-row-start">
              <Tag
                v-for="(tag, tagIndex) in post.postTags"
                :key="tagIndex"
                :tag-index="tagIndex"
              />
              <Tag v-if="post.postTags.length < 5" :new-tag="true" />
            </div>
          </b-card-body>
        </b-card>
        <div class="edit-add-block-row edit-row d-flex align-items-center">
          <b-button
            variant="transparent"
            block
            class="text-left add-text"
            @click="handleAddBlock(-1)"
          >
            + 新增段落
          </b-button>
        </div>
        <div v-for="(block, blockIndex) in blocks" :key="block.id">
          <b-card class="edit-block edit-row">
            <b-button
              variant="link"
              class="close-btn"
              @click="handleDeleteBlock(blockIndex)"
            >
              <b-icon icon="x" font-scale="1.5" />
            </b-button>
            <BlockEditor :ref="`block-${block.id}`" :block="block" />
          </b-card>
          <div class="edit-add-block-row edit-row d-flex align-items-center">
            <b-button
              variant="transparent"
              block
              class="text-left add-text"
              @click="handleAddBlock(blockIndex)"
            >
              + 新增段落
            </b-button>
          </div>
        </div>
        <div v-if="citationList.length > 0">
          <b-row>
            <b-col>
              <b-card
                class="bg-light border-0 edit-row citations-container mb-5"
                body-class="p-4"
              >
                <p class="citations-container--title">新聞來源</p>
                <b-card
                  v-for="(citation, index) in citationList"
                  ref="citation"
                  :key="index"
                  class="citations-container--card border-0"
                  body-class="p-3"
                >
                  <div class="d-flex justify-content-between">
                    <div class="d-flex flex-column">
                      <div class="d-flex mb-2">
                        <div
                          class="citation-list-tag"
                          role="button"
                          @click="scrollToCitationNode(index)"
                        >
                          <div class="period" :data-label="index + 1" />
                        </div>
                        <div class="w-100 pl-2">
                          <div>{{ citation.info.title }}</div>
                        </div>
                      </div>
                      <b-link
                        class="citation-list-link"
                        :href="citation.url"
                        target="_blank"
                      >{{ citation.info.url }}
                      </b-link>
                    </div>
                    <div class="citation-list-btn">
                      <b-button variant="link" @click="onCitationEdited(index)">
                        編輯
                      </b-button>
                      <b-button
                        variant="link"
                        @click="onCitationRemoved(index)"
                      >
                        刪除
                      </b-button>
                    </div>
                  </div>
                </b-card>
              </b-card>
            </b-col>
          </b-row>
        </div>
        <b-toast
          id="citation-toast"
          toast-class="citation-toast--toast"
          body-class="citation-toast--toast-body"
          toaster="citation-toaster"
          no-close-button
          auto-hide-delay="2500"
        >
          已新增至新聞來源
        </b-toast>
        <b-toaster
          class="b-toaster-bottom-center citation-toast--toaster"
          name="citation-toaster"
        />
      </div>
      <div v-show="showNewsSource" class="news-area">
        <b-button
          variant="link"
          class="close-source"
          @click="handleShowNewsSource(false)"
        >
          <b-icon icon="x" scale="1.66" variant="secondary" />
        </b-button>
        <NewsPanel />
      </div>
      <div
        v-show="!showNewsSource"
        class="news-area-btn-only"
      >
        <b-button
          variant="light"
          @click="handleShowNewsSource(true)"
        >
          <icon icon="edit-source" />
          搜尋新聞
        </b-button>
      </div>
    </b-row>
    <transition name="fade" mode="out-in" :duration="500">
      <b-alert
        v-model="showAddPointsAlert"
        class="points-alert"
        dismissible
        variant="light"
      >
        <p class="text-center">恭喜您！</p>
        <p class="d-flex justify-content-center align-content-center">
          <EditStar class="mr-2" /> + {{ editPoint }}
        </p>
        <p class="text-center">撰寫新文章，個人貢獻度 + {{ editPoint }} 分！</p>
      </b-alert>
    </transition>
    <EditToolModal />
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getArticleById } from '@/api/article'
import BlockEditor from '@/components/Post/BlockEditor'
import NewsPanel from '@/components/NewsPanel'
import { Utils } from '@/utils'
import EditStar from '@/components/Icons/EditStar'
import Tag from '@/components/Editor/Tag'
import EditToolModal from '@/components/Post/EditToolModal'

export default {
  name: 'Post',
  components: {
    BlockEditor,
    NewsPanel,
    EditStar,
    Tag,
    EditToolModal
  },
  data() {
    return {
      articleId: undefined,
      currentEditingEditor: null,
      isAddingTag: false,
      categoryList: [
        '政經',
        '國際',
        '社會',
        '科技',
        '環境',
        '生活',
        '運動',
        '未分類'
      ],
      items: [
        {
          text: '首頁',
          to: '/'
        },
        {
          text: '編輯新聞',
          active: true
        }
      ],
      addTagText: '',
      isLoading: false,
      isTimelineShow: false,
      showNewsSource: false,
      dropdownOpen: false,
      sessionTimestamp: new Date(),
      cacheArticleTimer: null
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'uid']),
    ...mapGetters({ post: 'post' }),
    editPoint() {
      return this.post.isNewPost ? 5 : 2
    },
    blocks() {
      return this.post.blocks
    },
    postTitle: {
      get() {
        return this.post.postTitle
      },
      set(newTitle) {
        this.$store.commit('post/SET_TITLE', newTitle)
      }
    },
    categorySelected: {
      get() {
        return this.post.categorySelected
      },
      set(newCategory) {
        this.$store.commit('post/SET_CATEGORY', newCategory)
      }
    },
    showAddPointsAlert: {
      get() {
        return this.post.showAddPointsAlert
      },
      set(newValue) {
        this.$store.commit('post/SHOW_ADDPOINTS_ALERT', newValue)
      }
    },
    citationList() {
      return this.post.citation.getList()
    }
  },
  watch: {
    categorySelected() {
      this.$refs.categoryRef.hide(true)
    }
  },
  beforeDestroy() {
    clearInterval(this.cacheArticleTimer)
  },
  created() {
    // 從route中獲得此文章的ID
    this.initPostPage().then(() => {
      this.cacheArticleTimer = setInterval(() => {
        this.setArticleLocalStorage()
      }, 10000)
    })
  },
  methods: {
    async initPostPage() {
      this.$store.commit('post/RESET_POST')
      const articleId = this.$route.params.ArticleID
      const isNewPost = !(articleId || false)
      this.$store.commit('post/SET_NEW_POST', isNewPost)
      this.$store.commit('post/SET_ARTICLEID', articleId)
      const localStorageData = this.getArticleLocalStorage()
      // fetch article either from localStorage or remote DB
      if (articleId) {
        this.isLoading = true
        getArticleById(articleId)
          .then(response => {
            if (response.data.code === 200) {
              let data = response.data.data
              // check localStorage, use localStorage article if newer than lastUpdated
              if (localStorageData) {
                const { timeStamp } = localStorageData
                const { lastUpdatedAt } = data
                // use date comparison to guarantee correctness
                const localStorageDate = new Date(timeStamp)
                const receivedDate = new Date(lastUpdatedAt)
                if (localStorageDate > receivedDate) {
                  data = localStorageData
                  this.$bvToast.toast(`已恢復您於 ${localStorageDate.toLocaleString()} 開始的編輯階段`, {
                    title: '恢復編輯',
                    autoHideDelay: 20000
                  })
                }
              }
              this.$store.commit('post/INIT_POST', { data })
              this.isLoading = false
              this.$nextTick(() => {
                this.post.currentEditingEditor = null
              })
            } else {
              this.isLoading = false
              throw new Error(response.data.message)
            }
          })
      } else { // if new article
        if (localStorageData) {
          const { timeStamp } = localStorageData
          const localStorageDate = new Date(timeStamp)
          this.$bvModal
            .msgBoxConfirm(`您於 ${localStorageDate.toLocaleString()} 已有一篇標題為：「${localStorageData.title}」的文章正在編輯，
              請問要繼續編輯嗎？`, {
              title: '繼續編輯',
              okTitle: '繼續編輯',
              cancelTitle: '取消',
              headerClass: 'custom-modal-header',
              footerClass: 'custom-modal-footer',
              okVariant: 'ok',
              cancelVariant: 'cancel',
              centered: true
            }).then(value => {
              if (value) {
                const data = localStorageData
                this.$store.commit('post/INIT_POST', { data })
                this.$nextTick(() => {
                  this.post.currentEditingEditor = null
                })
                this.$bvToast.toast(`已恢復您於 ${localStorageDate.toLocaleString()} 開始的編輯階段`, {
                  title: '恢復編輯',
                  autoHideDelay: 20000
                })
              } else {
                this.removeArticleLocalStorage()
                this.handleAddBlock(-1)
              }
            })
        } else {
          this.handleAddBlock(-1)
        }
      }
      return true
    },
    handleAddBlock(index) {
      const currentBlockCount = this.post.blocks.length
      const blockObj = {
        id: `${Utils.getRandomString()}-${(currentBlockCount + 1).toString()}`,
        blockTitle: '',
        blockDateTime: '',
        content: null,
        timeEnable: false
      }
      this.$store.commit('post/ADD_BLOCK', {
        index: index,
        block: blockObj
      })
      this.$nextTick(() => {
        const editor = this.$store.getters['post/GET_EDITOR_BY_ID'](blockObj.id)
        this.$store.commit('post/FOCUS_EDITOR', editor)
      })
    },
    handleDeleteBlock(index) {
      if (this.post.blocks.length === 1) {
        this.$bvModal.msgBoxOk('文章必須至少含有一個段落，故無法刪除。')
        return
      }
      const title = this.post.blocks[index].blockTitle || '無標題'
      this.$bvModal
        .msgBoxConfirm(`是否刪除段落：${title}？`, {
          title: '刪除段落',
          okVariant: 'danger',
          okTitle: '刪除',
          cancelTitle: '取消',
          cancelVariant: 'outline-primary',
          footerClass: 'modal-footer-confirm',
          centered: true
        })
        .then((value) => {
          if (value) {
            this.$store.commit('post/DELETE_BLOCK', index)
          }
        })
    },
    scrollToCitationNode(index) {
      this.citationList[index].lastNode.node.$el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    },
    onCitationEdited(index) {
      const context = { citation: this.citationList[index] }
      this.$store.commit('post/SET_MODAL_CONTEXT', { context })
      this.$store.commit('post/SET_MODAL_COMPONENT', {
        componentString: 'CITATION'
      })
    },
    onCitationRemoved(index) {
      if (this.citationList[index]) {
        const citation = this.citationList[index]
        this.$bvModal
          .msgBoxConfirm(`是否刪除引用：${citation.info.title}？`, {
            title: '刪除引用',
            okVariant: 'danger',
            okTitle: '刪除',
            cancelTitle: '取消',
            cancelVariant: 'outline-primary',
            footerClass: 'modal-footer-confirm',
            centered: true
          })
          .then((value) => {
            if (value) {
              this.$store.dispatch('post/REMOVE_EDITOR_CITATION', citation)
            }
          })
      }
    },
    handleShowTimeline(status) {
      this.isTimelineShow = status
    },
    handleShowNewsSource(status) {
      this.showNewsSource = status
      if (status === true) this.handleShowTimeline(false)
    },
    focusOnTitle(blockId) {
      this.$refs[`block-${blockId}`][0].focusOnTitle()
    },
    // Saves article content into localStorage and adds timestamp
    setArticleLocalStorage() {
      const articleData = this.$store.getters['post/GET_PUBLISH_DATA']
      articleData['timeStamp'] = this.sessionTimestamp
      const storeData = JSON.stringify(articleData)
      localStorage.setItem(this.$store.getters['post/GET_ARTICLEID_STRING'], storeData)
    },
    // get from localStorage
    getArticleLocalStorage() {
      const articleIdStr = this.$store.getters['post/GET_ARTICLEID_STRING']
      const data = localStorage.getItem(articleIdStr)
      let ret = null
      try {
        ret = JSON.parse(data)
      } catch (e) {
        console.error(e)
      }
      return ret
    },
    removeArticleLocalStorage() {
      localStorage.removeItem(this.$store.getters['post/GET_ARTICLEID_STRING'])
    }
  }
}
</script>

<style lang="scss">
// toast animation
@keyframes toastAnimation {
  from {
    transform: translateY(3.5rem);
  }
  to {
    transform: translateY(-3.5rem);
  }
}

.citation-toast {
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

<style scoped lang="scss">
@import '@/assets/scss/post/main.scss';

.wrapper {
  padding-top: 0;
}

.block-divider {
  width: 100%;
  height: 1rem;
  border-bottom: 1px solid $primary;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5rem;
  padding: 8px 10px;
  margin-right: 16px;
  // used to be calculated by bootstrap, now fixed
  height: 40px;
  &::placeholder {
    color: $text-4;
    line-height: 1.5rem;
    font-weight: 700;
    font-size: 16px;
  }
}

.add-block-btn {
  border-radius: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  width: 5rem;
  height: 2rem;
}

.main-editor-area {
  display: inline-block;
  width: 816px;
  padding: 16px;
  height: calc(100vh - 64px);
  overflow-x: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    margin-top: 16px;
    margin-bottom: 16px;
    background: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: $nature_6;
    height: 106px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.news-area {
  background: #fff;
  position: absolute;
  right: 0;
  height: calc(100vh - 64px);
  overflow-x: hidden;
  overflow-y: hidden;
  box-shadow: -10px 0px 15px rgba(0, 0, 0, 0.05);
  width: 504px;
}

.news-area-btn-only {
  // design: 312px
  width: 304px;
  text-align: right;
  padding: 24px 32px;
  @extend %panel-width-lg;
}

.citations-container {
  a {
    text-decoration: underline;
  }

  &--title {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.875rem;
    letter-spacing: 2px;

    padding: 4px;
    color: $text-2;
  }

  &--card {
    margin-bottom: 0.75rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

/* HIDE RADIO */
[type='radio'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* IMAGE STYLES */
[type='radio'] {
  cursor: pointer;
}

.citation-list {
  &-tag {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;

    & + div {
      font-size: 0.875rem;
    }
  }

  &-link {
    font-size: 0.625rem;
    line-height: 1.25rem;
    color: $text-3;
    text-decoration: underline !important;
  }

  &-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    button {
      padding: 0 0.5rem;
      color: $blue;
      border-right: 1px solid $gray-200;

      &:last-of-type {
        border: 0;
      }

      &:hover,
      &:active {
        text-decoration: none;
      }
    }
  }
}

.period {
  &:before {
    content: attr(data-label);
    color: $blue;
    font-size: 0.875rem;
    font-weight: 700;
  }
}

.close-btn {
  position: absolute;
  padding: 0;
  right: 5px;
  top: 5px;
  color: $nature_8;
}

.close-source {
  position: absolute;
  padding: 0;
  right: 0.75rem;
  top: 0.75rem;
  height: 1.5rem;
  width: 1.5rem;
  z-index: 11;
}

.points-alert {
  position: fixed;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  border: 1px solid $primary;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  padding: 2rem 2.5rem 1rem 2.5rem;

  p {
    color: $primary;
  }
}

// --------------- NEWS CLASSES ----------------

%panel-width-lg {
  // Macbook Pro resolution (1440px) - scrollbar width (~15px)
  @media only screen and (max-width: 1424px) {
    width: 132px;
    padding-left: 0px;
    padding-right: 0px;
  }
}

.btn-edit {
  display: flex;
  align-items: center;
}

.timeline-header {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  height: 3.5rem;

  button {
    color: $nature-8 !important;
    padding-left: 2rem;
    //styleName: Normal Body / 16px - Medium;
    font-family: Noto Sans CJK TC;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 2px;
    text-align: left;

    svg {
      margin-right: 1rem;
    }
  }
}

.timeline-panel {
  padding: 0;
  width: 312px;
  border-right: $nature-4 1px solid;

  height: calc(100vh - 64px);
  overflow-x: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    margin-top: 16px;
    margin-bottom: 16px;
    background: transparent;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: $nature_6;
    height: 106px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.timeline-panel-btn-only {
  // design: 312px
  width: 304px;
  padding: 24px 32px;

  @media only screen and (max-width: 1439px) {
    width: 132px;
    padding-left: 0px;
    padding-right: 0px;
  }
}

.timeline-shrink {
  width: 100px;
}

.timeline-container {
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
}

.timeline {
  display: flex;
  position: relative;
  width: 100%;
  padding: 0 2rem 0 2rem;
  margin: 0.5rem 0;

  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
  letter-spacing: 2px;
  text-decoration: none !important;

  cursor: pointer;
}

.rectangle {
  position: absolute;
  width: 24px;
  height: 2px;
  top: calc(0.75rem - 1px);
  left: 0;
  background: $nature-6;
}

.edit-card {
  background: $light;
  border: none;

  &-body {
    padding: 24px 32px 24px 24px;
  }
}

.title-card-row {
  display: flex;
  margin-top: 1.5rem;
  margin-bottom: -0.5rem;
  align-items: center;
  flex-wrap: wrap;
  &-between {
    justify-content: space-between;
  }

  &-start {
    justify-content: flex-start;
  }
}

.dropdown-line {
  position: relative;
  margin: 0 0.5rem;
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    left: 0;
    top: 0;
    bottom: 0;
    background: #c4c4c4;
  }
}
::v-deep .category-dropdown {
  ul.dropdown-menu {
    min-width: 130px;
    font-size: 14px;
    margin-top: 8px;
    border: 0;
    box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15) !important;
  }
  li .dropdown-item {
    padding-left: 18px;
    padding-right: 18px;
  }
  .dropdown-btn {
    color: $text-1;
    padding-top: 6px;
    padding-bottom: 6px;
    &:hover,
    &:active {
      background-color: $nature-2;
    }
  }
  .active-btn {
    color: $blue;
    background-color: $blue-1;
    &:hover {
      background-color: $blue-1;
    }
  }
}
::v-deep .category-dropdown-btn {
  width: 130px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 0;
  padding-right: 0;
  .dropdownbtn-text {
    display: inline-flex;
    margin-right: 16px;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: 90px;
    &.btn-text-left {
      justify-content: flex-start;
      padding-left: 16px;
      text-align: left;
    }
  }
  .btn-chevron {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    position: relative;
    &::before {
      position: absolute;
      content: '';
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 24px;
      border-left: 1px solid $gray-4;
    }
  }
}

.dropdown-icon {
  color: $nature-8;
}

.edit-add-block-row {
  position: relative;
  margin: 1.5rem 0;
  width: 100%;
  height: 40px;
  background: $light;
  color: $text-1;
  border-radius: 0.25rem;
  border: none;
  .add-text {
    font-size: 14px;
    padding-left: 16px;
  }
}

.edit-block {
  position: relative;
  background: $light;
  border: none;
  .card-body {
    padding: 28px 32px 24px 24px;
  }
}

.edit-row {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 4px;
    left: 0px;
    top: 0px;
    bottom: 0px;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    background: #c4c4c4;
  }

  &:focus-within {
    &::before {
      content: '';
      position: absolute;
      width: 4px;
      left: 0px;
      top: 0px;
      bottom: 0px;
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
      background: $blue;
    }
    background: $blue-60 !important;
  }
}
</style>
