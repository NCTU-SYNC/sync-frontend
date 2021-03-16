<template>
  <b-container>
    <b-row>
      <b-col
        class="py-2 main-editor-area"
        lg="7"
        md="12"
        sm="12"
        cols="12"
      >
        <b-row>
          <b-col class="d-flex justify-content-between align-items-center">
            <b-breadcrumb
              :items="items"
              class="bg-transparent p-0 m-0"
            />
            <div v-if="isShowHint" class="editor-hint-step">
              <span>Help!</span>
              <span>1. 編輯文章主題區塊</span>
              <span>2. 撰寫段落標題與內容</span>
              <span>3. 右側搜尋新聞加入文章</span>
              <b-button variant="link" @click="onHintClosed">
                <b-icon icon="x" />
              </b-button>
            </div>
          </b-col>
        </b-row>
        <b-card
          no-body
          class="mt-2 bg-light border-0"
        >
          <b-card-body>
            <b-form inline class="d-flex justify-content-end align-items-stretch w-100">
              <label
                class="sr-only"
                for="post-title"
              >標題</label>
              <b-form-input
                id="post-title"
                v-model="postTitle"
                class="mb-0 mr-sm-2 mb-sm-0 d-flex flex-grow-1"
                placeholder="輸入標題..."
                required
              />
              <div class="border rounded bg-white date-time-container">
                <b-dropdown
                  class="w-100 h-100"
                  :text="categorySelected.length === 0 ? '文章主題分類': categorySelected"
                  toggle-class="text-truncate"
                  variant="link"
                >
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
              </div>
            </b-form>
            <div class="d-flex justify-content-between py-2">
              <div class="tag-contianer">
                <b-button
                  v-for="(tag, tagIndex) in postTags"
                  :key="tagIndex"
                  variant="outline-primary"
                  size="sm"
                  class="tag tag-pill"
                >
                  #{{ tag }}
                  <b-icon
                    icon="x"
                    class="ml-1"
                    @click="removeTag(tagIndex)"
                  />
                </b-button>
                <div class="tag tag-add-btn">
                  <span v-if="isAddingTag">#</span>
                  <b-form-input
                    v-if="isAddingTag"
                    v-model="addTagText"
                    class="pl-0"
                    size="sm"
                    autofocus
                    @keyup.enter="addTag"
                  />
                  <b-button
                    variant="outline-primary"
                    size="sm"
                    class="border-0"
                    @click="addTag"
                  >
                    <b-icon
                      icon="plus"
                      :class="{'tag-cross': isAddingTag && addTagText.length === 0}"
                    />
                  </b-button>
                </div>
              </div>
              <div class="d-flex justify-content-end align-items-center text-nowrap text-sm">
                <b-form-checkbox
                  v-model="isAnonymous"
                  value="true"
                  unchecked-value="false"
                >
                  匿名發文
                </b-form-checkbox>
                <span class="mx-2 text-secondary">
                  編輯者：{{ $store.getters.displayName }}
                </span>
                <b-link class="text-secondary">
                  +其他10位
                </b-link>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <div class="d-flex justify-content-center mt-3">
          <div class="block-divider" />
          <div class="flex-grow-1">
            <b-button
              variant="outline-primary"
              class="add-block-btn"
              @click="handleAddBlock"
            >
              <span>+ 段落</span>
            </b-button>
          </div>
          <div class="block-divider" />
        </div>
        <div
          v-for="block in blocks"
          :key="block.id"
        >
          <b-card
            class="bg-light border-0"
          >
            <TiptapEditor
              :content.sync="block.content"
              :block-title.sync="block.blockTitle"
              :block-date-time.sync="block.blockDateTime"
              @onEdit="onEditorEdit"
            />
          </b-card>
          <div class="d-flex justify-content-center mt-3">
            <div class="block-divider" />
            <div class="flex-grow-1">
              <b-button
                variant="outline-primary"
                class="add-block-btn"
                @click="handleAddBlock"
              >
                <span>+ 段落</span>
              </b-button>
            </div>
            <div class="block-divider" />
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
              @click="handlePublish"
            >
              發布
            </b-button>
          </b-col>
        </b-row>
      </b-col>
      <b-col
        lg="5"
        cols="12"
        class="py-4 py-lg-2 news-area"
      >
        <NewsPanel @importNews="importNews" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getArticleById, createArticle, updateArticleById } from '@/api/article'
import TiptapEditor from '@/components/Post/TiptapEditor'
import { getToken } from '@/utils/auth'
import NewsPanel from '@/components/NewsPanel'

export default {
  name: 'Post',
  components: {
    TiptapEditor,
    NewsPanel
  },
  data() {
    return {
      articleId: undefined,
      currentEditingEditor: null,
      isNewPost: false,
      isAnonymous: false,
      isAddingTag: false,
      isShowHint: localStorage.getItem('hint') === null,
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
      addTagText: ''
    }
  },
  computed: {
    ...mapGetters({ post: 'post' })
  },
  watch: {
    categorySelected(newValue) {
      this.data.category = newValue
    }
  },
  created() {
    // this.handleClearPost()
    // 從route中獲得此文章的ID
    const articleId = this.articleId = this.$route.params.ArticleID
    this.isNewPost = !(articleId || false)
    if (articleId) {
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
          this.categorySelected = data.category
          if (this.blocks.length === 0) {
            this.handleAddBlock()
          }
        }
      }).catch(err => {
        console.error(err)
      })
    } else {
      this.handleAddBlock()
    }
  },
  methods: {
    handleAddBlock() {
      const currentBlockCount = this.blocks.length
      this.blocks.push({
        id: currentBlockCount + 1,
        blockDateTime: new Date().toISOString(),
        content: null
      })
    },
    handlePublish() {
      // return if the user is not login
      if (!getToken()) {
        this.$bvModal.msgBoxOk('Please Login First')
        return
      }
      if (this.isNewPost) {
        createArticle(this.data).then((response) => {
          // console.log(response)
          if (response.data.code === 200) {
            this.articleId = response.data.id
            this.$bvModal.msgBoxOk(response.data.message)
              .then(() => {
                this.$router.push({ name: 'Article', params: { ArticleID: this.articleId }})
              })
          } else {
            this.$bvModal.msgBoxOk(response.data.message)
          }
        }).catch((err) => {
          console.error(err)
          this.$bvModal.msgBoxOk(err.data.message)
        })
      } else {
        this.data.id = this.$route.params.ArticleID
        this.data.token = this.$store.getters.token
        updateArticleById(this.data).then((response) => {
          // console.log(response)
          if (response.data.code === 200) {
            this.$bvModal.msgBoxOk(response.data.message)
              .then(() => {
                this.$router.push({ name: 'Article', params: { ArticleID: this.articleId }})
              })
          } else {
            this.$bvModal.msgBoxOk(response.data.message)
          }
        }).catch((err) => {
          console.error(err)
          this.$bvModal.msgBoxOk(err.data.message)
        })
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
    onEditorEdit(editor) {
      this.currentEditingEditor = editor
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
    onHintClosed() {
      localStorage.setItem('hint', true)
      this.isShowHint = false
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
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/post/main.scss";

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

.editor-hint-step {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  background-color: $light;
  border-radius: 3rem;
  padding: 0 0 0 1rem;

  span {
    margin: 0rem 0.5rem;
  }
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
</style>
