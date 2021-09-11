<template>
  <b-container fluid class="wrapper">
    <b-row>
      <b-col v-if="isTimelineShow" cols="2" align-self="stretch" class="timeline-panel">
        <div class="bg-light timeline-header">
          <b-button variant="transparent" block class="btn-edit" @click="handleShowTimeline(false)">
            <b-icon icon="chevron-left" />
            段落標題
          </b-button>
        </div>
        <div class="timeline-container">
          <a v-for="(block, index) in blocks" :key="index" class="timeline" @click="focusOnTitle(block.id)">
            <div class="rectangle" />
            {{ block.blockTitle !== '' ? block.blockTitle : '段落尚無標題' }}
          </a>
        </div>
      </b-col>
      <b-col v-else :cols="showNewsSource?1:2" align-self="start" class="d-flex justify-content-start">
        <b-button variant="light" class="btn-edit mt-3" @click="handleShowTimeline(true)">
          <icon icon="edit-timeline" />
          <span v-if="!showNewsSource">段落標題</span>
        </b-button>
      </b-col>
      <b-col
        class="py-2 main-editor-area"
        lg="7"
        md="12"
        sm="12"
        cols="12"
      >
        <b-card
          no-body
          class="mt-2 edit-card edit-row"
        >
          <b-card-body>
            <label
              class="sr-only"
              for="post-title"
            >標題</label>
            <b-form-input
              id="post-title"
              v-model="postTitle"
              size="lg"
              class="mb-0 mr-sm-2 mb-sm-0 d-flex flex-grow-1"
              placeholder="文章標題"
              required
            />
            <div class="title-card-row title-card-row-between">
              <b-dropdown
                ref="categoryRef"
                class="bg-white rounded"
                :text="categorySelected.length === 0 ? '文章主題分類': categorySelected"
                toggle-class="text-truncate text-decoration-none title-text "
                variant="link"
                no-caret
              >
                <template #button-content>
                  文章分類
                  <span class="dropdown-line" />
                  <b-icon icon="chevron-down" class="dropdown-icon" />
                </template>
                <b-row class="no-gutters pl-2">
                  <b-col
                    v-for="(category, categoryIndex) in categoryList"
                    :key="categoryIndex"
                    cols="6"
                    class="d-flex justify-content-center align-items-center py-1 pr-2"
                  >
                    <label
                      :class="['btn',{ 'btn-outline-primary': categorySelected === category }, 'w-100' ]"
                    >
                      <input
                        v-model="categorySelected"
                        type="radio"
                        :value="category"
                      >
                      <span>{{ category }}</span>
                    </label>
                  </b-col>
                </b-row>
              </b-dropdown>
              <b-form-group class="checkbox">
                <input id="checkbox-title" v-model="isAnonymous" type="checkbox">
                <label for="checkbox-title"><span />匿名發文</label>
              </b-form-group>
            </div>
            <div class="title-card-row title-card-row-start">
              <div v-for="(tag, tagIndex) in postTags" :key="tagIndex" class="input-tag">
                <span class="text-primary">＃</span>
                {{ tag }} <b-button variant="link" class="remove-tag" @click="removeTag(tagIndex)"><b-icon icon="x" font-scale="1.5" /></b-button>
              </div>
              <div class="input-tag">
                <span v-if="isAddingTag" class="text-primary">＃</span>
                <span v-else class="text-secondary">＃</span>
                <b-form-input v-model="addTagText" placeholder="新增關鍵字" @keyup.enter="addTag" @focus="addTag" @blur="isAddingTag = false" />
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="edit-add-block-row edit-row d-flex align-items-center">
          <b-button variant="transparent" block class="text-left add-text" @click="handleAddBlock(-1)">
            + 新增段落
          </b-button>
        </div>
        <div
          v-for="(block, blockIndex) in blocks"
          :key="block.id"
        >
          <b-card
            class="edit-block edit-row"
          >
            <b-button variant="link" class="close-btn" @click="handleDeleteBlock(blockIndex)">
              <b-icon icon="x" font-scale="1.5" />
            </b-button>
            <BlockEditor
              :ref="`block-${block.id}`"
              :block="block"
            />
          </b-card>
          <div class="edit-add-block-row edit-row d-flex align-items-center">
            <b-button variant="transparent" block class="text-left add-text" @click="handleAddBlock(blockIndex)">
              + 新增段落
            </b-button>
          </div>
        </div>
        <div v-if="post.citations.length > 0">
          <b-row>
            <b-col>
              <b-card
                class="bg-light border-0 citations-container"
              >
                <p>引用貼文</p>
                <div v-for="(citation, index) in post.citations" :key="index">
                  <div class="d-flex justify-content-start align-items-center mt-2">
                    <div class="citation-list-tag">
                      <div class="period" :data-label="index + 1" />
                    </div>
                    <div class="w-100 pl-2 ">
                      <b-link class="text-primary" :href="citation.url" target="_blank">{{ citation.title }}</b-link>
                    </div>
                    <div class="citation-list-remove">
                      <b-button variant="outline-primary" class="citation-list-remove-btn" @click="onCitationRemoved(index)">
                        <b-icon icon="x" />
                      </b-button>
                    </div>
                  </div>
                </div>
              </b-card>
            </b-col>
          </b-row>
          <div class="block-divider" />
        </div>

        <b-row class="mt-3 mb-5">
          <b-col class="d-flex justify-content-end">
            <b-button
              variant="outline-primary"
              size="lg"
              class="px-3"
              :disabled="isLoading"
              @click="handlePublish"
            >
              發布
            </b-button>
          </b-col>
        </b-row>
      </b-col>
      <b-col
        v-if="showNewsSource"
        lg="4"
        cols="12"
        class="news-area px-0"
      >
        <b-button variant="link" class="close-source" @click="handleShowNewsSource(false)">
          <b-icon icon="x" font-scale="2" />
        </b-button>
        <NewsPanel @importNews="importNews" />
      </b-col>
      <b-col v-else cols="3" class="d-flex justify-content-end" align-self="start">
        <b-button variant="light" class="mt-2" @click="handleShowNewsSource(true)">
          <icon icon="edit-source" />
          搜尋新聞
        </b-button>
      </b-col>
    </b-row>
    <transition
      name="fade"
      mode="out-in"
      :duration="500"
    >
      <b-alert v-model="showAddPointsAlert" class="points-alert" dismissible variant="light">
        <p class="text-center">恭喜您！</p>
        <p class="d-flex justify-content-center align-content-center">
          <EditStar class="mr-2" /> + {{ editPoint }}
        </p>
        <p class="text-center">撰寫新文章，個人貢獻度 + {{ editPoint }} 分！</p>
      </b-alert>
    </transition>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getArticleById, createArticle, updateArticleById } from '@/api/article'
import BlockEditor from '@/components/Post/BlockEditor'
import NewsPanel from '@/components/NewsPanel'
import { Utils } from '@/utils'
import EditStar from '@/components/Icons/EditStar'

export default {
  name: 'Post',
  components: {
    BlockEditor,
    NewsPanel,
    EditStar
  },
  data() {
    return {
      articleId: undefined,
      currentEditingEditor: null,
      isNewPost: false,
      isAnonymous: false,
      isAddingTag: false,
      // blocks: [],
      data: {},
      postAuthors: [],
      postTitle: '',
      postDateTime: '',
      postDateValue: '',
      postTimeValue: '',
      categoryList: ['政經', '國際', '社會', '科技', '環境', '生活', '運動'],
      categorySelected: '',
      postTags: [],
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
      showAddPointsAlert: false,
      redirectTimerId: null,
      isTimelineShow: false,
      showNewsSource: false
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'uid', 'token']),
    ...mapGetters({ post: 'post' }),
    editPoint() {
      return this.isNewPost ? 5 : 2
    },
    blocks() {
      return this.post.blocks
    }
  },
  watch: {
    categorySelected(newValue) {
      this.data.category = newValue
      this.$refs.categoryRef.hide(true)
    },
    showAddPointsAlert(newValue) {
      if (!newValue && this.redirectTimerId) {
        clearTimeout(this.redirectTimerId)
        this.redirectTimerId = null
        this.$router.push({ name: 'Article', params: { ArticleID: this.articleId }})
      }
    }
  },
  beforeDestroy() {
    if (this.redirectTimerId) {
      clearTimeout(this.redirectTimerId)
    }
  },
  created() {
    // this.handleClearPost()
    // 從route中獲得此文章的ID
    const articleId = this.articleId = this.$route.params.ArticleID
    this.isNewPost = !(articleId || false)
    this.$store.commit('post/RESET_POST')
    if (articleId) {
      this.isLoading = true
      getArticleById(articleId).then(response => {
        if (response.data.code === 200) {
          this.data = response.data.data
          const data = this.data
          this.postAuthors = data.authors
          this.postTitle = data.title
          this.postTags = data.tags
          const dateTime = this.postDateTime = data.createdAt
          this.postDateValue = this.seperateDateAndTime(dateTime).date
          this.postTimeValue = this.seperateDateAndTime(dateTime).time
          const blocks = data.blocks
          console.log('received blocks:', blocks)
          for (const b of blocks || []) {
            this.$store.commit('post/PUSH_BLOCK', b)
            console.log('push:', b)
          }
          this.categorySelected = data.category
          for (const c of data.citations || []) {
            this.$store.commit('post/PUSH_CITATION', c)
          }
          if (this.post.blocks.length === 0) {
            this.handleAddBlock()
          }
          this.isLoading = false
        } else {
          throw new Error(response.data.message)
        }
      }).catch(err => {
        console.error(err)
        this.isLoading = false
      })
    } else {
      this.handleAddBlock()
    }
  },
  methods: {
    handleAddBlock(index) {
      console.log('handle add block')
      const currentBlockCount = this.post.blocks.length
      const blockObj = {
        id: `${Utils.getRandomString()}-${(currentBlockCount + 1).toString()}`,
        blockTitle: '',
        blockDateTime: new Date().toISOString(),
        content: null
      }
      this.$store.commit('post/ADD_BLOCK', {
        index: index,
        block: blockObj
      })
    },
    handleDeleteBlock(index) {
      if (this.post.blocks.length === 1) {
        this.$bvModal.msgBoxOk('文章必須至少含有一個段落，故無法刪除。')
        return
      }
      const title = this.post.blocks[index].blockTitle || '無標題'
      this.$bvModal.msgBoxConfirm(`是否刪除段落：${title}？`, {
        title: '刪除段落',
        okVariant: 'danger',
        okTitle: '刪除',
        cancelTitle: '取消',
        cancelVariant: 'outline-primary',
        footerClass: 'modal-footer-confirm',
        centered: true
      }).then(value => {
        if (value) {
          this.$store.commit('post/DELETE_BLOCK', index)
        }
      })
    },
    async handlePublish() {
      this.isLoading = true
      if (!this.token || !this.isLogin) {
        await this.$bvModal.msgBoxOk('登入逾時或失效，請重新登入')
        this.isLoading = false
        this.$router.push('/login')

        return
      }
      let noTitle = false
      this.blocks.forEach((block) => {
        if (block.blockTitle === '') {
          noTitle = true
        }
      })
      if (noTitle) {
        await this.$bvModal.msgBoxOk('段落標題不得為空白，請輸入段落標題')
        this.isLoading = false
        return
      }
      this.data = {
        ...this.data,
        title: this.postTitle,
        tags: this.postTags,
        authors: this.postAuthors,
        blocks: this.post.blocks,
        createdAt: `${this.postDateValue} ${this.postTimeValue}`,
        citations: this.post.citations,
        uid: this.uid,
        token: this.token,
        isAnonymous: this.isAnonymous
      }
      console.log(this.data)
      if (this.isNewPost) {
        try {
          console.log(this.data)
          const { data } = await createArticle(this.data)
          this.isLoading = false
          if (data.code === 200) {
            this.articleId = data.id
            this.$store.commit('post/RESET_POST')
            this.showAddPointsAlertAndRedirect()
          } else {
            this.$bvModal.msgBoxOk(data.message)
          }
        } catch (error) {
          this.$bvModal.msgBoxOk(error.message)
          this.isLoading = true
        }
      } else {
        this.data.id = this.articleId
        try {
          const { data } = await updateArticleById(this.data)
          this.isLoading = false
          if (data.code === 200) {
            this.$store.commit('post/RESET_POST')
            this.showAddPointsAlertAndRedirect()
          } else {
            this.$bvModal.msgBoxOk(data.message)
          }
        } catch (error) {
          this.$bvModal.msgBoxOk(error.message)
          this.isLoading = false
        }
      }
    },
    importNews(content) {
      if (this.currentEditingEditor === null) {
        this.$bvModal.msgBoxOk('請選擇編輯區塊，或是先新增段落後再引入')
        return
      }
      let str = this.currentEditingEditor.getHTML()
      content.forEach((text) => {
        str += `<p>${text}</p>`
      })
      this.currentEditingEditor.setContent(str, true)
    },
    seperateDateAndTime(dateTimeString) {
      const dateTime = new Date(dateTimeString)
      return {
        date: dateTime.toISOString().slice(0, 10),
        // time: dateTime.toLocaleTimeString('en-US', { hour12: false })
        time: dateTime.toISOString().slice(11, 19)
      }
    },
    removeTag(index) {
      this.postTags.splice(index, 1)
    },
    addTag() {
      if (this.isAddingTag) {
        if (this.addTagText.length > 0) {
          this.postTags.push(this.addTagText)
          this.addTagText = ''
        }
      }
      this.isAddingTag = !this.isAddingTag
    },
    onCitationRemoved(index) {
      if (this.post.citations[index]) {
        this.$bvModal.msgBoxConfirm(`是否刪除引用：${this.post.citations[index].title}？`, {
          title: '刪除引用',
          okVariant: 'danger',
          okTitle: '刪除',
          cancelTitle: '取消',
          cancelVariant: 'outline-primary',
          footerClass: 'modal-footer-confirm',
          centered: true
        }).then(value => {
          if (value) {
            this.post.citations.splice(index, 1)
          }
        })
      }
    },
    showAddPointsAlertAndRedirect() {
      this.showAddPointsAlert = true
      this.redirectTimerId = setTimeout(() => {
        this.$router.push({ name: 'Article', params: { ArticleID: this.articleId }})
      }, 2000)
    },
    handleShowTimeline(status) {
      this.isTimelineShow = status
      // if (status === true) this.handleShowNewsSource(false)
    },
    handleShowNewsSource(status) {
      this.showNewsSource = status
      if (status === true) this.handleShowTimeline(false)
    },
    focusOnTitle(blockId) {
      this.$refs[`block-${blockId}`][0].focusOnTitle()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/post/main.scss";

.wrapper {
  padding-top: 0;
}

.block-divider {
  width: 100%;
  height: 1rem;
  border-bottom: 1px solid $primary;
}

.tag {
  display: inline-block;
  align-items: center;
  justify-content: center;
  border-radius: 3rem;
  border: 1px solid $primary;
  margin: 0.25rem !important;
  white-space:nowrap;

  &-contianer {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  &-pill {
    height: 2rem !important;
    text-decoration: none;
    padding: 0.25rem 0.5rem 0.25rem 0.75rem !important;
  }

  &-add-btn {
    height: 2rem !important;
    display: flex;
    justify-content: flex-end;

    span {
      padding: 0.25rem 0 0.25rem 0.75rem !important;
      font-size: 0.875rem
    }

    button {
      width: 2rem;
      height: 2rem !important;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3rem;
      margin: 0 !important;
    }

    input {
      width: 6rem;
      border: none !important;
      background-color: transparent !important;
      padding: 0;
    }
  }

  &-cross {
    transform: rotate(45deg);
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
  display:inline-block;
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
}

.citations-container {
  a {
    text-decoration: underline;
  }
}

/* HIDE RADIO */
[type=radio] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* IMAGE STYLES */
[type=radio] {
  cursor: pointer;
}

.citation-list-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border: 1px solid #939393;
}

.citation-list-remove {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  width: 1.5rem;
  height: 1.5rem;
}

.citation-list-remove-btn {
  border: none;
  width: 1.5rem !important;
  height: 1.5rem !important;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.period {
  &:before {
    content: attr(data-label);
    color: #939393;
    width: 2rem;
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
  right: 1rem;
  top: 0.5rem;
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
.btn-edit {
  display: flex;
  align-items: center;
}

#post-title::placeholder {
  color: rgba(0, 0, 0, 0.3);
  font-size: 1.5rem;
  font-weight: bold;
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
  border-right: $nature-4 1px solid;
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
}

.title-card-row {
  margin-top: 1rem;
  display: flex;
  align-items: center;

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
    content: "";
    position: absolute;
    width: 1px;
    left: 0;
    top: 0;
    bottom: 0;
    background: #c4c4c4;
  }
}

.dropdown-icon {
  color: #c4c4c4;
}

.checkbox {
  label {
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  input[type="checkbox"] {
    display:none;
  }

  input[type="checkbox"] + label span {
    display:inline-block;
    width: 16px;
    height: 16px;
    margin: 0 0.5rem 0.25rem 0;
    vertical-align: middle;
    background: url('~@/assets/icons/ic-checkmark-unchecked.svg') 0 center no-repeat;
    cursor: pointer;
  }

  input[type="checkbox"]:checked + label span {
    margin: 0 0.5rem 0.25rem 0;
    background: url('~@/assets/icons/ic-checkmark-checked.svg') 0 center no-repeat;
  }

  input[type=checkbox]+ label {
    color: rgba(0, 0, 0, 0.85);
    user-select: none; /* 防止文字被滑鼠選取反白 */
  }
}

.input-tag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    margin-left: 0.25rem;
  }
  input {
    background: transparent;
    padding: 0;
    height: 36px;
    max-width: 5.2rem;
    &::placeholder {
      color: rgba(0, 0, 0, 0.3);
    }
  }
  .remove-tag {
    display: none;
  }
  &:hover {
    .remove-tag {
      display: inline-block;
      padding-left: 0;
      padding-right: 0;
      color: $nature-8;
      &:hover {
        color: black;
      }
    }
  }
  transition: width 1s;
  margin-right: 0.5rem;
  padding: 0 1rem 0 0.5rem;
  height: 36px;
  background: $white;
  border-radius: 1.5rem;
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
    content: "";
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
      content: "";
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
