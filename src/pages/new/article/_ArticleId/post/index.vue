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
            <div class="editor-hint-step">
              <span>Help!</span>
              <span>1. 編輯文章主題區塊</span>
              <span>2. 撰寫段落標題與內容</span>
              <span>3. 右側搜尋新聞加入文章</span>
              <b-button variant="link">
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
            <b-form>
              <label
                class="sr-only"
                for="post-title"
              >標題</label>
              <b-form-input
                id="post-title"
                v-model="postTitle"
                class="mb-0 mr-sm-2 mb-sm-0"
                placeholder="輸入標題..."
                required
              />
            </b-form>
            <div class="d-flex justify-content-between py-2">
              <div class="d-flex justify-content-start">
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
                  />
                </b-button>
                <b-button
                  variant="outline-primary"
                  class="tag tag-add-btn"
                >
                  <b-icon icon="plus" />
                </b-button>
              </div>
              <div class="d-flex justify-content-end align-items-center">
                <b-form-checkbox
                  v-model="isAnonymous"
                  value="true"
                  unchecked-value="false"
                >
                  匿名發文
                </b-form-checkbox>
                <span class="mx-2 text-secondary">
                  編輯者：Shang
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
              @click="handleAddBlack"
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
            no-body
            class="bg-light border-0 min-vh-50"
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
                @click="handleAddBlack"
              >
                <span>+ 段落</span>
              </b-button>
            </div>
            <div class="block-divider" />
          </div>
        </div>
        <b-row>
          <b-col class="d-flex justify-content-between">
            <b-button
              variant="outline-primary"
              size="lg"
              class="px-3"
              @click="handleSaveArticle"
            >
              儲存
            </b-button>
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
import { getArticleById, createArticle, updateArticleById } from '@/api/article'
import TiptapEditor from '@/components/Post/TiptapEditor'
import { getToken } from '@/utils/auth'
import NewsPanel from '@/components/NewsPanel'
const seperateDateAndTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString)
  return {
    date: dateTime.toISOString().slice(0, 10),
    time: dateTime.toLocaleTimeString('en-US', { hour12: false })
  }
}

export default {
  name: 'Post',
  components: {
    TiptapEditor,
    NewsPanel
  },
  middleware: 'authenticated',
  async asyncData ({ route }) {
    const { ArticleId } = route.params
    const isNewPost = !(ArticleId || false)
    if (ArticleId) {
      const { data } = await getArticleById(ArticleId)
      if (data.code === 200) {
        const postData = data.data
        return {
          data: postData,
          articleId: ArticleId,
          postAuthors: postData.authors,
          postTitle: postData.title,
          postTags: postData.tags,
          postDateTime: postData.createdAt,
          postDateValue: seperateDateAndTime(postData.createdAt).date,
          postTimeValue: seperateDateAndTime(postData.createdAt).time,
          blocks: postData.blocks,
          isNewPost
        }
      }
    } else {
      return {
        isNewPost
      }
    }
  },
  data () {
    return {
      articleId: undefined,
      currentEditingEditor: null,
      isNewPost: false,
      isAnonymous: false,
      blocks: [],
      data: {},
      postAuthors: ['內部測試'],
      postTitle: '',
      postDateTime: '',
      postDateValue: '',
      postTimeValue: '',
      postTags: ['美國總統大選', '川普'],
      items: [
        {
          text: '首頁',
          to: '/new/home'
        },
        {
          text: '編輯新聞',
          active: true
        }
      ]
    }
  },
  methods: {
    handleAddBlack () {
      const currentBlockCount = this.blocks.length
      this.blocks.push({
        id: currentBlockCount + 1,
        blockDateTime: new Date().toISOString(),
        content: null
      })
    },
    handleSaveArticle () {
      this.data = {
        title: this.postTitle,
        tags: this.postTags,
        authors: this.postAuthors,
        blocks: this.blocks,
        createdAt: `${this.postDateValue} ${this.postTimeValue}`,
        token: this.$store.getters.token
      }
      localStorage.setItem('post', this.data)
    },
    handlePublish () {
      // return if the user is not login
      if (!getToken()) {
        this.$bvModal.msgBoxOk('Please Login First')
        return
      }
      this.handleSaveArticle()
      if (this.isNewPost) {
        createArticle(this.data).then((response) => {
          // console.log(response)
          if (response.data.code === 200) {
            this.articleId = response.data.id
            this.$bvModal.msgBoxOk(response.data.message)
              .then(() => {
                this.$router.push({ name: 'article-ArticleID', params: { ArticleID: this.articleId } })
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
                this.$router.push({ name: 'article-ArticleID', params: { ArticleID: this.articleId } })
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
    importNews (content) {
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
    handleClearPost () {
      this.blocks = []
      this.data = {}
      this.postAuthors = []
      this.postTitle = ''
      this.postDateValue = ''
      this.postTimeValue = ''
      this.postTags = []
    },
    onEditorEdit (editor) {
      this.currentEditingEditor = editor
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/Post/editor.scss";

.block-divider {
  width: 100%;
  height: 1rem;
  border-bottom: 1px solid $primary;
}

.tag {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3rem;
  border: 1px solid $primary;
  margin: 0.25rem !important;

  &-pill {
    height: 2rem !important;
    text-decoration: none;
    padding: 0.25rem 0.5rem 0.25rem 0.75rem !important;
  }

  &-add-btn {
    height: 2rem !important;
    width: 2rem !important;
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
  overflow-y: scroll;
}

.news-area {
  display:inline-block;
  height: calc(100vh - 100px);
  overflow-y: scroll;
}
</style>
