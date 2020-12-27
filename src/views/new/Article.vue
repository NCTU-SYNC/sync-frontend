<template>
  <b-container fluid="xl">
    <b-row>
      <b-col cols="2">
        <div class="sync-blank-container d-flex flex-column pr-3">
          <div class="sync-timeline">
            <div class="sync-timeline-title" />
          </div>
          <div v-for="(block, blockIndex) in blocks" :key="blockIndex">
            <div class="sync-timeline">
              <div class="sync-timeline-time">
                {{ formatDate(block.blockDateTime) }}
              </div>
              <div class="sync-timeline-title">
                <p>{{ block.blockTitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </b-col>
      <b-col cols="8">
        <b-row>
          <b-col>
            <h2>
              {{ title }}
            </h2>
            <hr class="my-2">
            <div class="text-center text-secondary">
              <b-icon icon="clock" />
              最後更新時間 {{ formatTime(lastUpdatedAt) }}
            </div>
            <div class="d-flex justify-content-between py-3">
              <div>
                <b-button
                  v-for="(tag, tagIndex) in tags"
                  :key="tagIndex"
                  variant="outline-primary"
                  :class="['m-1', 'flex-shrink-0']"
                  pill
                >
                  {{ tag }}
                </b-button>
              </div>
              <div class="d-flex flex-grow-1 justify-content-end">
                <b-button
                  variant="outline-primary"
                  class="btn-icon mx-2 mt-1"
                  @click="handleEditPostRoute(`${$route.path}/post`)"
                >
                  <b-icon icon="pencil-square" />
                </b-button>
                <b-button
                  variant="outline-primary"
                  class="btn-icon mx-2 mt-1"
                  @click="handleHistoryRoute"
                >
                  <b-icon icon="clock-history" />
                </b-button>
                <b-button
                  variant="outline-primary"
                  class="btn-icon ml-2 mt-1"
                >
                  <b-icon icon="bookmark" />
                </b-button>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row
          v-for="(block, index) in blocks"
          :key="index"
          class="py-3"
        >
          <b-col>
            <div class="d-flex justify-content-between">
              <h3 class="text-primary">
                {{ block.blockTitle }}
              </h3>
              <b-link class="text-gray">
                {{ formatTime(block.blockDateTime) }}
              </b-link>
            </div>
            <b-card
              border-variant="white"
              no-body
            >
              <editor-content
                class="editor__content"
                :editor="editors[block._id]"
              />
            </b-card>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="2">
        <div class="sync-blank-container" />
        <div class="sync-time-container py-2">
          <p class="mb-0">{{ time.year() }}</p>
          <span
            id="month"
            class="mb-2"
          >{{ time.month() + 1 }} 月</span>
          <span
            id="date"
            class="mb-2 ml-2"
          >{{ time.date() }} 日</span>
          <p class="mt-2 mb-0">
            {{ time.format('hh:mm a') }}
          </p>
        </div>
        <div class="sync-authors-container py-2">
          <p class="mb-1">
            編輯者：
          </p>
          <b-link
            v-for="(author, index) in authors"
            :key="index"
          >{{ formatAuthor(author, index === authors.length-1) }}</b-link>
          <!-- <b-link>吳先生</b-link>, <b-link>吳先生</b-link>, <b-link>吳先生</b-link>, <b-link>吳先生</b-link> -->
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// test id:  5f5113349779a26bd0444b26
import moment from 'moment'
import { getArticleById } from '@/api/article'
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Placeholder } from 'tiptap-extensions'
import Link from '@/components/Editor/TiptapExtensions/Link'

export default {
  name: 'Article',
  components: {
    EditorContent
  },
  data() {
    return {
      tagName: '美國總統大選',
      order: 'time',
      category: [],
      title: '',
      viewCount: 32,
      tags: [],
      blocks: [],
      authors: [],
      createdAt: '',
      lastUpdatedAt: '',
      timeId: null,
      time: moment(),
      editors: [],
      editableBlocks: [],
      isEditting: false,
      // 當使用者按下取消復原用
      backupBlock: null,
      isLogin: false
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
    }
  },
  created() {
    this.timeId = setInterval(() => {
      this.time = moment()
    }, 1000)
    if (this.articleId) {
      getArticleById(this.articleId).then(response => {
        if (response.data.code === 200) {
          const { title, authors, tags, createdAt, blocks, lastUpdatedAt, category, editedCount, editingCount, isPopular } = response.data.data
          console.log(response.data.data)
          this.title = title
          this.authors = authors
          this.tags = tags
          this.createdAt = createdAt
          this.lastUpdatedAt = lastUpdatedAt
          this.blocks = blocks
          this.category = category
          this.editedCount = editedCount
          this.editingCount = editingCount
          this.isPopular = isPopular
          this.blocks.forEach(block => {
            this.editors[block._id] = this.createEditor(block.content)
            this.editableBlocks[block._id] = false
          })
        }
      }).catch(err => {
        console.error(err)
      })
    }

    // check if user logged in
    this.isLogin = !!this.$store.getters.token
  },
  beforeDestroy() {
    clearInterval(this.timeId)
    this.time = null
  },
  methods: {
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
      return moment(timeString).format('YYYY-MM-DD HH:mm')
    },
    formatAuthor(author, isTheLastAuthor) {
      return isTheLastAuthor ? author : author + ', '
    },
    createEditor(initializedContent) {
      const editor = new Editor({
        autoFocus: true,
        onInit: () => {
          // editor is initialized
        },
        onUpdate: () => {
          // console.log(state, transaction)
          // console.log(getHTML(), getJSON())
          // console.log(JSON.stringify(getJSON()))
        },
        extensions: [
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new BulletList(),
          new ListItem(),
          new Link(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: '輸入內文...',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          })
        ],
        content: initializedContent,
        editable: false
      })
      return editor
    }
  }

}
</script>

<style scoped lang="scss">
@import '@/assets/scss/news.scss';

p {
  letter-spacing: 0.25rem;
}

.btn-icon {
  height: 3rem !important;
  width: 3rem !important;
  padding-top: 0.25rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
}

.sync-blank-container {
  padding-top: 9rem;
}

.sync-timeline {
  .sync-timeline-time {
    width: 8rem;
    border: 1px solid $secondary;
    color: $secondary;
    text-align: center;
  }
  .sync-timeline-title {
    flex-grow: 1;
    margin-left: 1rem;
    padding: 0.5rem 0rem 0rem 0.5rem;
    border-left: 1px solid $black;
    min-width: 100%;
    height: 100%;
    min-height: 3rem;
  }
  display: flex;
  flex-direction: column;
  min-width: 100%;
  min-height: 3rem;
}

.sync-time-container {
  padding-top: 9rem;
  border-top: 1px solid $black;
  border-bottom: 1px solid $black;
}

.sync-authors-container {
  border-bottom: 1px solid $black;
}

#month {
  font-size: 2rem;
}

#date {
  font-size: 1.5rem;
}
.reference {
  color: gray;
  text-decoration-line: underline;
}

ul {
  padding-inline-start: 0;
  list-style: none;
}

hr {
  padding-bottom: 1rem;
}

.last-update {
  margin: auto;
  color: gray;
}

.title-bar {
  display: flex;
}

.author {
  display: inline-block;
  margin-left: auto !important;
  color: gray;
}

.tag {
  display: inline-block;
  padding: 0.5rem;
  color: gray;
}
</style>
