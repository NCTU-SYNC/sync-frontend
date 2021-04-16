<template>
  <transition
    name="fade"
    mode="out-in"
    :duration="500"
  >
    <b-container v-if="isPageReady" fluid="xl" class="wrapper">
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
        <b-col cols="8" class="min-vh-100">
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
                    :variant="isSubscribed ? 'primary' : 'outline-primary'"
                    class="btn-icon ml-2 mt-1"
                    @click="handleClickBookmark"
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
                <span class="text-gray">
                  {{ formatTime(block.blockDateTime) }}
                </span>
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
            <span
              v-for="(author, index) in authors"
              :key="index"
            >{{ formatAuthor(author, index === authors.length-1) }}</span>
          </div>
        </b-col>
      </b-row>
      <b-row class="my-5">
        <b-col cols="2" />
        <b-col cols="8">
          <b-card
            class="bg-light border-0 citations-container"
          >
            <p>引用貼文</p>
            <div v-for="(citation, index) in citations" :key="index">
              <div class="d-flex justify-content-start align-items-center mt-2">
                <div class="citation-list-tag">
                  <div class="period" :data-label="index + 1" />
                </div>
                <div class="w-100 pl-2 ">
                  <b-link class="text-primary" :href="citation.url" target="_blank">{{ citation.title }}</b-link>
                </div>
              </div>
            </div>
          </b-card>
        </b-col>
        <b-col cols="2" />
      </b-row>
    </b-container>>
  </transition>
</template>

<script>
// test id:  5f5113349779a26bd0444b26
import moment from 'moment'
import { getArticleById } from '@/api/article'
import { Editor, EditorContent } from 'tiptap'
import { History, Blockquote, Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Placeholder, OrderedList } from 'tiptap-extensions'
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
      citations: [],
      lastUpdatedAt: '',
      timeId: null,
      time: moment(),
      editors: [],
      editableBlocks: [],
      isEditting: false,
      // 當使用者按下取消復原用
      backupBlock: null,
      isLogin: false,
      isSubscribed: false,
      isPageReady: false
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
    }
  },
  watch: {
    subscribedList(newList) {
      console.log('subscribedList', newList)
      if (newList) {
        this.isSubscribed = newList.findIndex(s => s.articleId === this.articleId) >= 0
        return
      }
      this.isSubscribed = false
    },
    isPageReady(newValue) {
      this.$store.commit('SET_FOOTER', newValue)
    },
    '$route.params.ArticleID': function() {
      this.getArticleData()
    }
  },
  mounted() {
    this.$on('reloadData', this.getArticleData)
    this.time = moment()
    this.timeId = setInterval(() => {
      this.time = moment()
    }, 1000)

    this.getArticleData()

    // check if user logged in
    this.isLogin = !!this.$store.getters.token
    if (this.isLogin) {
      this.$store.dispatch('article/VIEW', this.articleId)
      this.isSubscribed = this.subscribedList.findIndex(s => s.articleId === this.articleId) >= 0
    }
  },
  beforeDestroy() {
    clearInterval(this.timeId)
    this.time = null
  },
  methods: {
    getArticleData() {
      if (this.articleId) {
        this.isPageReady = false
        getArticleById(this.articleId).then(response => {
          if (response.data.code === 200) {
            const { title, authors, tags, createdAt, blocks, lastUpdatedAt, category, editedCount, editingCount, citations, isPopular } = response.data.data
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
            this.citations = citations
            this.citations.forEach((citation, index) => {
              this.$store.commit('post/SET_CITATION', { index, citation })
            })
            this.blocks.forEach(block => {
              this.editors[block._id] = this.createEditor(block.content)
              this.editableBlocks[block._id] = false
            })
            this.isPageReady = true
          }
        }).catch(err => {
          console.error(err)
          this.isPageReady = true
        })
      }
    },
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
      return isTheLastAuthor ? author.name : author.name + ', '
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
          new History(),
          new Blockquote(),
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Italic(),
          new Strike(),
          new OrderedList(),
          new Underline(),
          new BulletList(),
          new Link(),
          new ListItem(),
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
    },
    async handleClickBookmark() {
      try {
        if (!this.isSubscribed) {
          await this.$store.dispatch('article/SUBSCRIBE', this.articleId)
        } else {
          this.$store.dispatch('article/UNSUBSCRIBE', this.articleId)
        }
      } catch (error) {
        this.$bvModal.msgBoxOk(`${!this.isSubscribed ? '取消' : ''}追蹤文章失敗`, {
          title: '追蹤文章',
          okVariant: 'danger',
          okTitle: '確定',
          footerClass: 'modal-footer-confirm',
          centered: true
        })
      }
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

.citation-list-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border: 1px solid #939393;
}

.period {
  &:before {
    content: attr(data-label);
    color: #939393;
    width: 2rem;
  }
}
</style>
