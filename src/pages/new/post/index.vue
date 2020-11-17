<template>
  <b-container>
    <b-row>
      <b-col
        class="py-2"
        lg="8"
        md="12"
        sm="12"
        xs="12"
      >
        <b-row>
          <b-col>
            <b-breadcrumb :items="items" />
          </b-col>
        </b-row>
        <b-card
          no-body
          class="bg-light"
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
            <div class="py-3">
              <span
                v-for="(tag, tagIndex) in postTags"
                :key="tagIndex"
                :class="['p-2', 'm-1', 'flex-shrink-0', 'shadow-sm', 'rounded', 'border']"
              >
                {{ tag }}
                <b-button variant="outline-primary">
                  <b-icon icon="x" />
                </b-button>
              </span>
              <b-button variant="link">
                <b-icon icon="plus" />
              </b-button>
              <b-form-checkbox
                v-model="isAnonymous"
                value="true"
                unchecked-value="false"
              >
                匿名發文
              </b-form-checkbox>
              <span>
                編輯者：Shang
              </span>
              <b-link>
                +其他10位
              </b-link>
            </div>
            <label for="post-tags" />
            <b-form-tags
              v-model="postTags"
              input-id="post-tags"
              separator=" "
              placeholder="新增標籤 (空白或Enter鍵分隔)"
              remove-on-delete
              duplicate-tag-text="重複的標籤"
            />
          </b-card-body>
          <b-card-footer>
            編輯者：
            <b-link
              v-for="postAuthor in postAuthors"
              :key="postAuthor.uid"
              href="#"
              class="card-link"
            >
              {{ postAuthor.displayName }}
            </b-link>
          </b-card-footer>
        </b-card>
        <hr>
        <div class="d-flex justify-content-center">
          <div class="block-divider" />
          <div class="flex-grow-1">
            <b-button
              variant="outline-primary"
              style="border-radius: 100px; margin-bottom: 1rem; min-width: 6rem; height: 2rem"
              @click="handleAddBlack"
            >
              + 段落
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
            border-variant="white"
          >
            <TiptapEditor
              :content.sync="block.content"
              :block-title.sync="block.blockTitle"
              :block-date-time.sync="block.blockDateTime"
              @onEdit="onEditorEdit"
            />
          </b-card>
          <br>
          <b-col
            cols="12"
            class="text-center"
          >
            <b-button
              variant="outline-secondary"
              style="border-radius: 3rem; text-align: center; line-height: 1rem;"
              class="text-center"
              @click="handleAddBlack"
            >
              + 段落
            </b-button>
          </b-col>
        </div>
        <b-container>
          <hr>
          <b-row>
            <b-col class="mr-auto" />
            <b-button
              class="mr-4"
              variant="transparent"
              @click="handleSaveArticle"
            >
              儲存
            </b-button>
            <b-button
              class="mr-auto"
              variant="dark"
              @click="handlePublish"
            >
              發布
            </b-button>
          </b-row>
        </b-container>
      </b-col>
      <b-col
        class="h-100 d-inline-block py-4 py-lg-2"
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
    const { ArticleID } = route.params
    const isNewPost = !(ArticleID || false)
    if (ArticleID) {
      const { data } = await getArticleById(ArticleID)
      if (data.code === 200) {
        const postData = data.data
        return {
          data: postData,
          articleId: ArticleID,
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
          console.log(response)
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
          console.log(response)
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
</style>
