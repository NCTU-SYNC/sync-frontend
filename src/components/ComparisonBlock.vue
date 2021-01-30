<template>
  <b-container fluid="xl" class="container">
    <b-row>
      <b-col cols="12" class="header d-flex justify-content-between align-items-center">
        2020/12/29  18:27 | CindyLin
      </b-col>
    </b-row>
    <b-row class="pt-5 article-container">
      <b-col cols="12">
        <b-row>
          <b-col>
            <h2>{{ title }}</h2>
          </b-col>
        </b-row>
        <b-row class="border-bottom mb-4">
          <b-col cols="12"><b-row
            v-for="(block, index) in blocks"
            :key="index"
            class="py-3"
          >
            <b-col>
              <div class="d-flex justify-content-between">
                <h3 class="text-primary">
                  {{ block.blockInfo.blockTitle }}
                </h3>
              </div>
              <b-card
                border-variant="white"
                no-body
              >
                <editor-content
                  class="editor__content"
                  :editor="editors[block.blockId]"
                />
              </b-card>
            </b-col>
          </b-row></b-col>
        </b-row>

        <b-row class="mb-5">
          <b-col cols="12">
            <h3>新聞來源</h3>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Link } from 'tiptap-extensions'
import { getArticleVersionById } from '@/api/history'
export default {
  name: 'ComparisonBlock',
  components: {
    EditorContent
  },
  props: {
    versionIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      title: '',
      blocks: [],
      editors: {},
      versions: [],
      currentIndex: 0,
      versionStartFrom: 0
    }
  },
  created() {
    console.log(this.versionIndex)
    this.handleGetArticleVersion(this.versionIndex)
  },
  methods: {
    createEditor(initializedContent) {
      const editor = new Editor({
        autoFocus: true,
        onInit: () => {},
        onUpdate: () => {},
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
    async handleGetArticleVersion(versionIndex = undefined) {
      try {
        const { data } = await getArticleVersionById({ articleId: '60043867621475aa00007541', versionIndex })
        const { currentVersion, versions, from } = data.data
        this.title = currentVersion.title
        this.versionStartFrom = from
        this.versions = versions
        this.blocks = currentVersion.blocks
        this.blocks.forEach(block => {
          if (this.editors[block.blockId]) {
            this.editors[block.blockId].setContent(block.content)
          } else {
            this.editors[block.blockId] = this.createEditor(block.content)
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  border-top: 2px solid #E6E6E6;
}
.article-container {
  overflow: scroll;
  height: 52vh;
}
.header {
  z-index: 2;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  height: 60px;
}
</style>
