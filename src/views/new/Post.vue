<template>
  <b-container fluid class="wrapper">
    <b-row>
      <b-col v-if="isTimelineShow" cols="2" align-self="stretch" class="timeline-panel">
        <div class="bg-light timeline-header">
          <b-button variant="transparent" block class="btn-edit">
            <b-icon icon="chevron-left" />
            段落標題
          </b-button>
        </div>
        <div class="timeline-container">
          <a class="timeline">
            <div class="rectangle" />
            會考如長舉行51561454145145
          </a>
          <a class="timeline">
            <div class="rectangle" />
            會考如長舉行
          </a>
        </div>
      </b-col>
      <b-col v-else cols="2" align-self="start" class="d-flex justify-content-start">
        <b-button variant="light" class="btn-edit">
          <img src="@/assets/icons/ic-edit-timeline.svg">
          段落標題
        </b-button>
      </b-col>
      <b-col
        class="py-2 main-editor-area"
        lg="8"
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
                {{ tag }}
              </div>
              <div class="input-tag">
                <span v-if="isAddingTag" class="text-primary">＃</span>
                <span v-else class="text-secondary">＃</span>
                <b-form-input v-model="addTagText" placeholder="新增關鍵字" @keyup.enter="addTag" @focus="addTag" @blur="isAddingTag = false" />
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="edit-add-block-row edit-row">
          <b-button variant="transparent" block class="text-left" @click="handleAddBlock(-1)">
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
              <b-icon icon="x" />
            </b-button>
            <BlockEditor
              :block="block"
            />
          </b-card>
          <div class="edit-add-block-row edit-row">
            <b-button variant="transparent" block class="text-left" @click="handleAddBlock(blockIndex)">
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
        v-if="false"
        lg="5"
        cols="12"
        class="py-4 py-lg-2 news-area"
      >
        <NewsPanel @importNews="importNews" />
      </b-col>
      <b-col cols="2" class="d-flex justify-content-end" align-self="start">
        <b-button variant="light">
          <img src="@/assets/icons/ic-edit-source.svg">
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
      blocks: [],
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
      isTimelineShow: true
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'uid', 'token']),
    ...mapGetters({ post: 'post' }),
    editPoint() {
      return this.isNewPost ? 5 : 2
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
          this.blocks = data.blocks
          console.log(this.blocks)
          this.categorySelected = data.category
          for (const c of data.citations || []) {
            this.$store.commit('post/PUSH_CITATION', c)
          }
          if (this.blocks.length === 0) {
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
      const currentBlockCount = this.blocks.length
      const blockObj = {
        id: `${Utils.getRandomString()}-${(currentBlockCount + 1).toString()}`,
        blockTitile: '',
        blockDateTime: new Date().toISOString(),
        content: null
      }
      if (index < 0) {
        this.blocks.unshift(blockObj)
      } else {
        const insertPosition = index + 1
        this.blocks.splice(insertPosition, 0, blockObj)
      }
    },
    handleDeleteBlock(index) {
      if (this.blocks.length === 1) {
        this.$bvModal.msgBoxOk('文章必須至少含有一個段落，故無法刪除。')
        return
      }
      const title = this.blocks[index].blockTitile || '無標題'
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
          this.blocks.splice(index, 1)
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
      this.data = {
        ...this.data,
        title: this.postTitle,
        tags: this.postTags,
        authors: this.postAuthors,
        blocks: this.$store.getters.post.blocks,
        createdAt: `${this.postDateValue} ${this.postTimeValue}`,
        citations: this.post.citations,
        uid: this.uid,
        token: this.token,
        isAnonymous: this.isAnonymous
      }
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
    handleClearPost() {
      this.blocks = []
      this.data = {}
      this.postAuthors = []
      this.postTitle = ''
      this.postDateValue = ''
      this.postTimeValue = ''
      this.postTags = []
    },
    seperateDateAndTime(dateTimeString) {
      const dateTime = new Date(dateTimeString)
      return {
        date: dateTime.toISOString().slice(0, 10),
        time: dateTime.toLocaleTimeString('en-US', { hour12: false })
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
  height: calc(100vh - 100px);
  overflow-x: hidden;
  overflow-y: scroll;
}

.news-area {
  display:inline-block;
  height: calc(100vh - 100px);
  overflow-x: hidden;
  overflow-y: scroll;
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
  right: 0rem;
  top: 0rem;
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
  padding: 0 0 0 2rem;
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

  margin-right: 0.5rem;
  padding: 0 1rem 0 0.5rem;
  height: 36px;
  background: $white;
  border-radius: 1.5rem;
}

.edit-add-block-row {
  position: relative;
  margin: 1rem 0;
  width: 100%;
  height: 40px;
  background: $light;
  color: rgba(0, 0, 0, 0.85);
  border-radius: 0.25rem;
  border: none;
}

.edit-block {
  position: relative;
  background: $light;
  border: none;
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
