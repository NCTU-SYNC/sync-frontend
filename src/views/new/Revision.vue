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
                v-for="(block, index) in displayBlocks"
                :key="index"
                class="text-decoration-none history-block history-card mt-3"
                :to="`/revision/${block.blockId}`"
              >
                <h4 class="text-primary">
                  <b-row>
                    <b-col>
                      <h4
                        v-for="(diff, diffIndex) in index === 0 ? titleDiffArr : titleDiffArr2"
                        :key="diffIndex"
                        class="test-span"
                        :style="{ color: diff[0] === 1 ? 'green'
                          : diff[0] === -1 ? 'red' : 'black', textDecoration: diff[0] === -1 ? 'line-through' : 'initial'}"
                      >
                        {{ diff[1] }}
                      </h4>
                    </b-col>
                  </b-row>
                </h4>
                <b-card
                  border-variant="primary"
                  class="border-0"
                >
                  <editor-content
                    class="editor__content"
                    :editor="editors[block._id]"
                  />
                  <b-row>
                    <b-col>
                      <div
                        v-for="(diff, diffIndex) in index === 0 ? googleDiffArr : googleDiffArr2"
                        :key="diffIndex"
                        class="test-span"
                        :style="{ color: diff[0] === 1 ? 'green'
                          : diff[0] === -1 ? 'red' : 'black', fontSize: '22px', textDecoration: diff[0] === -1 ? 'line-through' : 'initial'}"
                      >
                        {{ diff[1] }}
                      </div>
                    </b-col>
                  </b-row>
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
              <b-list-group-item
                v-for="(revision, revisionIndex) in revisions"
                :key="revisionIndex"
                :class="{ 'history-active-version': currentRevisionIndex === revisionIndex}"
                href="#"
                @click="changeRevision(revisionIndex)"
              >
                <p>{{ revision.blockTitle }} | {{ getUpdateDate(revision.updatedAt) }} | 倒數第{{ revisionIndex }}版</p>
                <b-icon icon="person" />
                <b-link class="ml-2">{{ revision.author.name }}</b-link>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- <b-row>
      <b-col>
        <div
          v-for="(diff, index) in diffArr"
          :key="index"
          class="test-span"
          :style="{ color: diff.added ? 'green'
            : diff.removed ? 'red' : 'black', fontSize: '22px' }"
        >
          {{ diff.value }}
          <span
            :style="{ color: 'green'}"
          >{{ (diff.removed && index !== diffArr.length - 1 && diffArr[index+1].added) ? ' > ' : '' }}</span>
        </div>
      </b-col>
    </b-row> -->
    <!-- <b-row>
      <b-col>
        <div
          v-for="(diff, index) in diffArr"
          :key="index"
          class="test-span"
          :style="{ color: diff.added ? 'green'
            : diff.removed ? 'red' : 'black', fontSize: '22px', textDecoration: diff.removed ? 'line-through' : 'initial' }"
        >
          {{ diff.value }}
        </div>
      </b-col>
    </b-row> -->
    <br>
  </b-container>
</template>

<script>
import { getBlockRevisionById } from '@/api/history'
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem } from 'tiptap-extensions'
import Link from '@/components/Editor/TiptapExtensions/Link'
import { diffChars } from 'diff'
// import { getArticleById } from '@/api/article'
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
      title: '段落版本比對',
      blocks: [],
      editors: [],
      diffArr: [],
      revisions: [],
      currentRevision: [],
      currentRevisionIndex: 0,
      displayBlocks: [],
      googleDiffArr: [],
      googleDiffArr2: [],
      titleDiffArr: [],
      titleDiffArr2: [],
      items: [
        {
          text: '閱讀文章',
          to: `/article/${this.$route.params.ArticleID
          }`
        },
        {
          text: '全文編輯紀錄',
          active: true
        }
      ]
    }
  },
  computed: {
    blockId() {
      return this.$route.params.BlockID
    }
  },
  created() {
    console.log(this.blockId)
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
        const { currentRevision, revisions } = data.data
        this.currentRevision = currentRevision
        this.revisions = revisions
        this.blocks = currentRevision
        this.displayBlocks = JSON.parse(JSON.stringify(currentRevision))
        this.displayBlocks.splice(2)
        // this.blocks.forEach(block => {
        //   this.editors[block._id] = this.createEditor(block.content)
        // })
        this.googleDiffArr = this.compareContentGoogle(this.displayBlocks[1].content, this.displayBlocks[0].content)
        this.googleDiffArr2 = this.compareContentGoogle(this.displayBlocks[0].content, this.displayBlocks[1].content)
        const dmp = new DiffMatchPatch()
        const diff = dmp.diff_main(this.displayBlocks[1].blockTitle, this.displayBlocks[0].blockTitle)
        dmp.diff_cleanupSemantic(diff)
        this.titleDiffArr = diff
        const diff2 = dmp.diff_main(this.displayBlocks[0].blockTitle, this.displayBlocks[1].blockTitle)
        dmp.diff_cleanupSemantic(diff2)
        this.titleDiffArr2 = diff2
      } catch (error) {
        console.log(error)
      }
    },
    getUpdateDate(date) {
      return moment(date).format('MM月DD日 HH:mm')
    },
    handleClickArticle() {
      // this.$router.push(`/history/${this.articleId}`)
      this.$router.push(`/history/${this.blockId}`)
    },
    compareContent(doc1, doc2) {
      let firstBlock = ''
      let secondBlock = ''
      doc1.content.forEach(paragraph => {
        if (!paragraph.content) firstBlock += '\n'
        else {
          paragraph.content.forEach(text => {
            firstBlock += text.text
          })
        }
      })
      doc2.content.forEach(paragraph => {
        if (!paragraph.content) secondBlock += '\n'
        else {
          paragraph.content.forEach(text => {
            secondBlock += text.text
          })
        }
      })
      const diffArr = diffChars(firstBlock, secondBlock)
      return diffArr
    },
    compareContentGoogle(doc1, doc2) {
      const dmp = new DiffMatchPatch()
      let firstBlock = ''
      let secondBlock = ''
      doc1.content.forEach(paragraph => {
        if (!paragraph.content) firstBlock += '\n'
        else {
          paragraph.content.forEach(text => {
            firstBlock += text.text
          })
        }
      })
      doc2.content.forEach(paragraph => {
        if (!paragraph.content) secondBlock += '\n'
        else {
          paragraph.content.forEach(text => {
            secondBlock += text.text
          })
        }
      })
      const diff = dmp.diff_main(firstBlock, secondBlock)
      dmp.diff_cleanupSemantic(diff)
      // console.log(diff)
      return diff
    },
    changeRevision(revisionIndex) {
      this.currentRevisionIndex = revisionIndex
      this.displayBlocks = [this.blocks[revisionIndex], revisionIndex === this.blocks.length - 1 ? { content: { content: [] }, blockTitle: '' } : this.blocks[revisionIndex + 1]]
      this.googleDiffArr = this.compareContentGoogle(this.displayBlocks[1].content, this.displayBlocks[0].content)
      this.googleDiffArr2 = this.compareContentGoogle(this.displayBlocks[0].content, this.displayBlocks[1].content)
      const dmp = new DiffMatchPatch()
      const diff = dmp.diff_main(this.displayBlocks[1].blockTitle, this.displayBlocks[0].blockTitle)
      dmp.diff_cleanupSemantic(diff)
      this.titleDiffArr = diff
      const diff2 = dmp.diff_main(this.displayBlocks[0].blockTitle, this.displayBlocks[1].blockTitle)
      dmp.diff_cleanupSemantic(diff2)
      this.titleDiffArr2 = diff2
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

.test-span {
  white-space: pre-wrap;
  display: inline;
  word-break: break-all
}
</style>
