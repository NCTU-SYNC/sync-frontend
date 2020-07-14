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
        <b-card no-body>
          <b-card-body>
            <b-form inline>
              <label class="sr-only" for="post-title">標題</label>
              <b-input
                id="post-title"
                v-model="postTitle"
                class="mb-0 mr-sm-2 mb-sm-0"
                placeholder="輸入標題..."
                required
              />

              <label class="sr-only" for="post-datepicker" />
              <b-form-datepicker
                id="post-datepicker"
                v-model="postDateValue"
                class="mb-0 mr-sm-2 mb-sm-0"
                :hide-header="true"
                locale="zh"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                label-no-date-selected="日期"
                label-help=""
              />

              <label class="sr-only" for="post-timepicker" />
              <b-form-timepicker
                id="post-timepicker"
                v-model="postTimeValue"
                class="mb-0 mr-sm-2 mb-sm-0"
                :hour12="false"
                locale="zh"
                :now-button="true"
                :show-seconds="false"
                :minutes-step="10"
                :no-close-button="true"
                label-now-button="現在時間"
                label-no-time-selected="時間"
                :hide-header="true"
              />
            </b-form>
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
            <b-link v-for="postAuthor in postAuthors" :key="postAuthor" href="#" class="card-link">{{ postAuthor
            }}</b-link>
          </b-card-footer>
        </b-card>
        <hr>
        <div>
          <br>
          <b-col cols="12" class="text-center">
            <b-button
              variant="outline-secondary"
              style="border-radius: 100px; margin-bottom: 1rem;"
              @click="handleAddBlack"
            >+ 段落</b-button>
          </b-col>
        </div>
        <div v-for="block in blocks" :key="block.id">
          <b-card no-body border-variant="white">
            <TiptapEditor
              :content.sync="block.content"
              :block-title.sync="block.blockTitle"
              :block-date-time.sync="block.blockDateTime"
              @onEdit="onEditorEdit"
            />
          </b-card>
          <br>
          <b-col cols="12" class="text-center">
            <b-button
              variant="outline-secondary"
              style="border-radius: 100px; margin-bottom: 1rem;"
              @click="handleAddBlack"
            >+ 段落</b-button>
          </b-col>
        </div>
        <b-container>
          <hr>
          <b-row>
            <b-col class="mr-auto" />
            <b-button class="mr-4" variant="transparent" @click="handleSaveArticle">儲存</b-button>
            <b-button class="mr-auto" variant="dark" @click="handlePublish">發布</b-button></b-row>
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
import NewsPanel from './NewsPanel'
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
      blocks: [],
      data: {},
      postAuthors: ['內部測試'],
      postTitle: '',
      postDateTime: '',
      postDateValue: '',
      postTimeValue: '',
      postTags: []
    }
  },
  created() {
    this.handleClearPost()
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
          this.postDateValue = this.sperateDateAndTime(dateTime).date
          this.postTimeValue = this.sperateDateAndTime(dateTime).time
          this.blocks = data.blocks
        }
      }).catch(err => {
        console.error(err)
      })
    }
  },
  methods: {
    handleAddBlack() {
      const currentBlockCount = this.blocks.length
      this.blocks.push({
        id: currentBlockCount + 1,
        blockDateTime: new Date().toISOString(),
        content: null
      })
    },
    handleSaveArticle() {
      this.data = {
        title: this.postTitle,
        tags: this.postTags,
        authors: this.postAuthors,
        blocks: this.blocks,
        createdAt: `${this.postDateValue} ${this.postTimeValue}`
      }
      localStorage.setItem('post', this.data)
    },
    handlePublish() {
      this.handleSaveArticle()
      if (this.isNewPost) {
        createArticle(this.data).then(response => {
          console.log(response)
          if (response.data.code === 200) {
            this.articleId = response.data.id
            this.$bvModal.msgBoxOk(response.data.message)
              .then(() => {
                this.$router.push({ name: 'Article', params: { ArticleID: this.articleId }})
              })
          } else {
            this.$bvModal.msgBoxOk(response.data.message)
          }
        }).catch(err => {
          console.error(err)
          this.$bvModal.msgBoxOk(err.data.message)
        })
      } else {
        this.data.id = this.$route.params.ArticleID
        updateArticleById(this.data).then(response => {
          console.log(response)
          if (response.data.code === 200) {
            this.$bvModal.msgBoxOk(response.data.message)
              .then(() => {
                this.$router.push({ name: 'Article', params: { ArticleID: this.articleId }})
              })
          } else {
            this.$bvModal.msgBoxOk(response.data.message)
          }
        }).catch(err => {
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
      var str = this.currentEditingEditor.getHTML()
      content.forEach(text => {
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
    sperateDateAndTime(dateTimeString) {
      const dateTime = new Date(dateTimeString)
      return { date: dateTime.toISOString().slice(0, 10),
        time: dateTime.toLocaleTimeString('en-US', { hour12: false }) }
    },
    onEditorEdit(editor) {
      this.currentEditingEditor = editor
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/Post/editor.scss";
</style>
