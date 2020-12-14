<template>
  <b-container fluid="xl">
    <b-row>
      <b-col cols="8">
        <b-row class="history-top-row">
          <b-col class="d-flex align-items-center">
            <b-breadcrumb
              :items="items"
              class="bg-transparent p-0 m-0"
            >
              <b-breadcrumb-item :to="`/article/${articleId}`">閱讀文章</b-breadcrumb-item>
              <b-breadcrumb-item :to="`/history/${articleId}`">全文編輯紀錄</b-breadcrumb-item>
              <b-breadcrumb-item active>段落編輯紀錄</b-breadcrumb-item>
            </b-breadcrumb>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col class="bg-light p-4">
            <h2 class="mb-0">{{ title }}</h2>
            <div class="tag-contianer py-3">
              <b-button
                v-for="(tag, tagIndex) in tags"
                :key="tagIndex"
                variant="outline-primary"
                size="sm"
                class="tag tag-pill"
              >
                #{{ tag }}
              </b-button>
            </div>
            <div class="d-flex flex-column">
              <b-link
                v-for="(block, index) in blocks"
                :key="index"
                class="text-decoration-none history-block history-card"
                :to="`/revision/${block._id}`"
              >
                <b-card
                  border-variant="primary"
                  class="border-0"
                >
                  <h3 class="text-primary">
                    {{ block.blockTitle }}
                  </h3>
                  <editor-content
                    class="editor__content"
                    :editor="editors[block._id]"
                  />
                </b-card>
              </b-link>

            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="4">
        <b-row class="history-top-row">
          <b-col class="d-flex justify-content-center">
            <div class="editor-hint-step">
              <span>Help!</span>
              <span>點選已選擇不同版本文章的編輯紀錄</span>
              <b-button size="sm" variant="link">
                <b-icon icon="x" />
              </b-button>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col>
            <b-list-group flush>
              <b-list-group-item :class="{ 'history-active-version': true}" href="#">
                <p>4月15日，下午5:10 | 目前版本</p>
                <b-icon icon="person" />
                <b-link class="ml-2">ShangHsun</b-link>
              </b-list-group-item>
              <b-list-group-item href="#">
                <p>4月14日，下午5:10</p>
                <b-icon icon="person" />
                <b-link class="ml-2">ShangHsun</b-link>
              </b-list-group-item>
              <b-list-group-item href="#">
                <p>4月14日，下午5:10</p>
                <b-icon icon="person" />
                <b-link class="ml-2">ShangHsun</b-link>
              </b-list-group-item>
              <b-list-group-item href="#">
                <p>4月14日，下午5:10</p>
                <b-icon icon="person" />
                <b-link class="ml-2">ShangHsun</b-link>
              </b-list-group-item>
              <b-list-group-item href="#">
                <p>4月14日，下午5:10</p>
                <b-icon icon="person" />
                <b-link class="ml-2">ShangHsun</b-link>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem } from 'tiptap-extensions'
import Link from '@/components/Editor/TiptapExtensions/Link'

export default {
  name: 'Revision',
  components: {
    EditorContent
  },
  data() {
    return {
      articleId: '',
      tags: [],
      title: '',
      blocks: [],
      editors: []
    }
  },
  computed: {
    blockId() {
      return this.$route.params.BlockID
    }
  },
  created() {
    console.log(this.blockId)
    setTimeout(() => {
      this.articleId = '5fd2de1713154979181a04b1'
    }, 1000)
    if (this.blockId) {
      /* getArticleById(this.articleId).then(response => {
        if (response.data.code === 200) {
          const { title, tags, blocks } = response.data.data
          console.log(response.data.data)
          console.log(blocks)
          this.title = title
          this.tags = tags
          this.blocks = blocks
          this.blocks.forEach(block => {
            this.editors[block._id] = this.createEditor(block.content)
          })
        }
      }).catch(err => {
        console.error(err)
      })*/
    }
  },
  methods: {
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
          new Link()
        ],
        content: initializedContent,
        editable: false
      })
      return editor
    },
    handleClickArticle() {
      this.$router.push(`/history/${this.articleId}`)
    }
  }

}
</script>

<style scoped lang="scss">
.tag {
  display: inline-block;
  align-items: center;
  justify-content: center;
  border-radius: 3rem;
  border: 1px solid $primary;
  background-color: $white;
  white-space:nowrap;
  margin: 0.25rem 0.5rem 0.25rem 0.5rem !important;

  &:first-child {
    margin: 0.25rem 0.5rem 0.25rem 0rem !important;
  }

  &:hover {
    background-color: $primary;
  }

  &-contianer {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  &-pill {
    height: 2rem !important;
    text-decoration: none;
    padding: 0.25rem 0.75rem 0.25rem 0.75rem !important;
  }
}

.history-top-row {
  height: 2rem !important;
}

.history-card {
  color: $primary;
  border-radius: 0.5rem;
  border: 1px solid $primary;
}

.editor-hint-step {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: $white;
  border: 1px solid $primary;
  border-radius: 3rem;
  padding: 0 0 0 1rem;
  font-size: 0.9rem;

  span {
    display: inline-block;
    margin: 0rem 0.5rem;
  }
}

.history-active-version {
  background-color: $light !important;
}

.history-block {
  height: 20rem !important;
  overflow-y: auto;
}
</style>
