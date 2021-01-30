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
              <div
                v-for="(revision, index) in currentRevision"
                :key="index"
              >
                <div class="revision-title">第{{ revision.revisionIndex }}版</div>
                <h4> {{ revision.blockTitle }}</h4>
                <b-card
                  border-variant="primary"
                  class="border-0"
                >
                  <editor-content
                    class="editor__content"
                    :editor="editors[revision._id]"
                  />
                </b-card>
                <br>
                <h5>與上一版本比較結果 (diff)：</h5>
                <br>
                <div
                  v-for="(diff, diffIndex) in index+1 < currentRevision.length ? compareTitle(currentRevision[index+1].blockTitle, revision.blockTitle) : []"
                  :key="diffIndex"
                  class="comparision-result"
                  :style="{ color: diff[0] === 1 ? 'green'
                    : diff[0] === -1 ? 'red' : 'black', textDecoration: diff[0] === -1 ? 'line-through' : 'initial'}"
                >{{ diff[1] }}</div>
                <b-card
                  border-variant="primary"
                  class="border-0"
                >
                  <div
                    v-for="(diff, diffIndex) in index+1 < currentRevision.length ? compareContent(currentRevision[index+1].content, revision.content).diffArr : []"
                    :key="diffIndex"
                    class="comparision-result"
                    :style="{ color: diff[0] === 1 ? 'green'
                      : diff[0] === -1 ? 'red' : 'black', textDecoration: diff[0] === -1 ? 'line-through' : 'initial'}"
                  >{{ diff[1] }}</div>
                </b-card>
                <br>
                <h5>另一種表現方式（patch）：</h5>
                <br>
                <b-card
                  border-variant="primary"
                  class="border-0"
                >
                  <ul>
                    <li
                      v-for="(patch, patchIndex) in index+1 < currentRevision.length ? compareContent(currentRevision[index+1].content, revision.content).patchArr : []"
                      :key="patchIndex"
                    >
                      <div
                        v-for="(diff, diffIndex) in index+1 < currentRevision.length ? patch.diffs : []"
                        :key="diffIndex"
                        class="comparision-result"
                        :style="{ color: diff[0] === 1 ? 'green'
                          : diff[0] === -1 ? 'red' : 'black', textDecoration: diff[0] === -1 ? 'line-through' : 'initial'}"
                      >{{ diff[1].replace('\n','') }}</div>
                    </li>
                  </ul>
                </b-card>
              </div>
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
              <b-list-group-item
                v-for="(revision, revisionIndex) in revisions"
                :key="revisionIndex"
                :class="{ 'history-active-version': $route.query.revision === revisionIndex}"
                href="#"
                :to="`/revision/${blockId}?revision=${from + revisions.length - revisionIndex}`"
              >
                <p>{{ revision.blockTitle }} | {{ getUpdateDate(revision.updatedAt) }} | 第{{ revision.revisionIndex }}版</p>
                <b-icon icon="person" />
                <b-link class="ml-2">{{ revision.author.name }}</b-link>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <br>
  </b-container>
</template>

<script>
import { getBlockRevisionById } from '@/api/history'
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem } from 'tiptap-extensions'
import Link from '@/components/Editor/TiptapExtensions/Link'
import DiffMatchPatch from 'diff-match-patch'
import moment from 'moment'

export default {
  name: 'Revision',
  components: {
    EditorContent
  },
  data() {
    return {
      articleId: '',
      tags: [],
      title: '段落編輯紀錄',
      blocks: [],
      editors: {},
      diffArr: [],
      revisions: [],
      currentRevision: [],
      currentRevisionIndex: 0,
      items: [
        {
          text: '閱讀文章',
          to: `/article/${this.$route.params.ArticleID
          }`
        },
        {
          text: '全文編輯紀錄'
        },
        {
          text: '段落編輯紀錄',
          active: true
        }
      ]
    }
  },
  computed: {
    blockId() {
      return this.$route.params.BlockID
    },
    currentViewRevision() {
      return this.$route.query.revision
    }
  },
  watch: {
    currentViewRevision(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.handleGetBlockRevision(newValue)
      }
    }
  },
  created() {
    if (this.blockId) {
      this.handleGetBlockRevision()
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
    async handleGetBlockRevision(revisionIndex = undefined) {
      try {
        const { data } = await getBlockRevisionById({ blockId: this.blockId, revisionIndex })
        const { currentRevision, revisions, from } = data.data
        this.currentRevision = currentRevision
        this.revisions = revisions
        this.blocks = currentRevision
        this.blocks.forEach(block => {
          if (this.editors[block._id]) {
            this.editors[block._id].setContent(block.content)
          } else {
            this.editors[block._id] = this.createEditor(block.content)
          }
        })
        this.from = from
      } catch (error) {
        console.log(error)
      }
    },
    getUpdateDate(date) {
      return moment(date).format('MM月DD日 HH:mm')
    },
    compareTitle(title1, title2) {
      const dmp = new DiffMatchPatch()
      const diff = dmp.diff_main(title1, title2)
      dmp.diff_cleanupSemantic(diff)
      return diff
    },
    compareContent(doc1, doc2) {
      const getPlainText = doc => {
        let plainText = ''
        doc.content.forEach(paragraph => {
          if (paragraph.content) {
            paragraph.content.forEach(text => {
              plainText += text.text
            })
          }
          plainText += '\n\n'
        })
        return plainText
      }

      const dmp = new DiffMatchPatch()
      const diffArr = dmp.diff_main(getPlainText(doc1), getPlainText(doc2))
      dmp.diff_cleanupSemantic(diffArr)
      const patchArr = dmp.patch_make(getPlainText(doc1), getPlainText(doc2))
      return { diffArr, patchArr }
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

.comparision-result {
  white-space: pre-wrap;
  display: inline;
  word-break: break-all;
  font-size: 1em;
}

.revision-title {
  font-size: 2em;
  font-weight: bold;
  margin-top: 40px;
  text-decoration: underline;
}
</style>
