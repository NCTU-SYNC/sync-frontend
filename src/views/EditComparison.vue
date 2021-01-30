<template>
  <b-container fluid="xl">
    <b-row>
      <b-col>
        <b-breadcrumb :items="breadcrumbItems" class="bg-transparent" />
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center">
        <h4>拜登就職演說</h4>
      </b-col>
    </b-row>
    <b-row class="mt-2 pb-2">
      <b-col class="d-flex justify-content-center align-items-center">
        <div>
          <b-button variant="link">
            <b-icon icon="chevron-left" />
            上一版
          </b-button>
          <span> &nbsp; | &nbsp;</span>
          <b-button variant="link">
            下一版
            <b-icon icon="chevron-right" />
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6" class="px-0 border-right border-secondary"><comparison-block :version="versions[1]" /></b-col>
      <b-col cols="6" class="px-0 border-left border-secondary"><comparison-block :version="versions[0]" :is-diff="true" :diff-arr="diffArr" /></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Editor } from 'tiptap'
import DiffMatchPatch from 'diff-match-patch'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Link } from 'tiptap-extensions'
import ComparisonBlock from '@/components/ComparisonBlock'
import { getArticleVersionById } from '@/api/history'
export default {
  components: {
    ComparisonBlock
  },
  data() {
    return {
      breadcrumbItems: [
        {
          text: '拜登就職演說',
          href: '#'
        },
        {
          text: '編輯紀錄'
        },
        {
          text: '版本比較',
          active: true
        }
      ],
      versions: {},
      diffArr: []
    }
  },
  created() {
    Promise.all([this.handleGetArticleVersion(1),
      this.handleGetArticleVersion(0)])
      .then(() => {
        console.error(this.versions[1])
        this.diffArr = this.compareContent(this.versions[1].blocks, this.versions[0].blocks)
      })
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
        const { currentVersion } = data.data
        const title = currentVersion.title
        const blocks = currentVersion.blocks
        const editors = {}
        blocks.forEach(block => {
          if (editors[block.blockId]) {
            editors[block.blockId].setContent(block.content)
          } else {
            editors[block.blockId] = this.createEditor(block.content)
          }
        })
        this.versions = {
          ...this.versions,
          [versionIndex]: {
            title, blocks, editors
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    compareTitle(title1, title2) {
      const dmp = new DiffMatchPatch()
      const diff = dmp.diff_main(title1, title2)
      dmp.diff_cleanupSemantic(diff)
      return diff
    },
    compareContent(blocks1, blocks2) {
      const getPlainText = blocks => {
        let plainText = ''
        blocks.forEach(block => {
          block.content.content.forEach(paragraph => {
            if (paragraph.content) {
              paragraph.content.forEach(text => {
                plainText += text.text
              })
            }
            plainText += '\n\n'
          })
        })
        return plainText
      }
      const dmp = new DiffMatchPatch()
      const diffArr = dmp.diff_main(getPlainText(blocks1), getPlainText(blocks2))
      dmp.diff_cleanupSemantic(diffArr)
      return diffArr
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

<style lang="scss">

</style>
