<template>
  <b-container fluid="xl">
    <b-row>
      <b-col>
        <b-breadcrumb :items="breadcrumbItems" class="bg-transparent" />
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center">
        <h4>{{ title }}</h4>
      </b-col>
    </b-row>
    <b-row class="mt-2 pb-2">
      <b-col class="d-flex justify-content-center align-items-center">
        <div>
          <b-button variant="link" :disabled="base <= 1" @click="onPrevArticleClicked">
            <b-icon icon="chevron-left" />
            上一版
          </b-button>
          <span> &nbsp; | &nbsp;</span>
          <b-button variant="link" :disabled="base + 1 >= versionsLength" @click="onNextArticleClicked">
            下一版
            <b-icon icon="chevron-right" />
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6" class="px-0 border-right border-secondary"><comparison-block :version="versions[1]" /></b-col>
      <b-col cols="6" class="px-0 border-left border-secondary"><comparison-block :version="versions[0]" :is-diff="true" :article-diff="articleDiff" :link-container="linkContainer" /></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Editor } from 'tiptap'
import DiffMatchPatch from 'diff-match-patch'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Link } from 'tiptap-extensions'
import ComparisonBlock from '@/components/ComparisonBlock'
import { getArticlesComparisonByVersionIndexes } from '@/api/history'

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
          text: '編輯紀錄',
          to: `/history/${this.articleId}`
        },
        {
          text: '版本比較',
          active: true
        }
      ],
      versions: {},
      baseVersion: {},
      comparedVersion: {},
      articleDiff: [],
      versionsLength: 0,
      base: undefined,
      compare: undefined,
      title: '',
      linkContainer: '龗龗龗龗龗'
    }
  },
  computed: {
    articleId() {
      return this.$route.params.ArticleID
    }
  },
  watch: {
    title(value) {
      this.breadcrumbItems[0].text = value
      this.breadcrumbItems[0].to = `/article/${this.articleId}`
      this.breadcrumbItems[1].to = `/history/${this.articleId}`
    }
  },
  created() {
    this.base = this.$route.query.base
    this.compare = this.$route.query.compare
    console.log(this.base, this.compare)
    this.handleGetArticlesComparison()
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
    async handleGetArticlesComparison() {
      try {
        const { data } = await getArticlesComparisonByVersionIndexes({
          articleId: this.articleId,
          base: this.base,
          compare: this.compare
        })
        const { articles, length, base, compare, title } = data.data
        this.versionsLength = length
        if (this.$route.query.base !== base.toString() || this.$route.query.compare !== compare.toString()) {
          this.$router.replace({ query: { base, compare }})
        }
        this.base = base
        this.compare = compare
        this.title = title

        for (let i = 0; i < 2; i += 1) {
          const title = articles[i].title
          const blocks = articles[i].blocks
          const editors = {}
          const author = articles[i].author
          const updateAt = articles[i].updateAt
          blocks.forEach(block => {
            if (editors[block.blockId]) {
              editors[block.blockId].setContent(block.content)
            } else {
              editors[block.blockId] = this.createEditor(block.content)
            }
          })
          this.versions = {
            ...this.versions,
            [i]: { title, blocks, editors, author, updateAt }
          }
        }

        this.articleDiff = this.compareContent(this.versions[1].blocks, this.versions[0].blocks)
      } catch (error) {
        console.log(error)
      }
    },
    compareContent(blocks1, blocks2) {
      const dmp = new DiffMatchPatch()

      const plainTextBlocks1 = this.getPlainTextBlocks(blocks1)
      const plainTextBlocks2 = this.getPlainTextBlocks(blocks2)

      const longer = plainTextBlocks1.length > plainTextBlocks2.length ? plainTextBlocks1 : plainTextBlocks2
      const shorter = plainTextBlocks1.length <= plainTextBlocks2.length ? plainTextBlocks1 : plainTextBlocks2

      const articleDiff = []

      longer.forEach((block, index) => {
        const comparedBlock = index < shorter.length ? shorter[index] : { blockTitle: '', content: '' }
        const titleDiff = dmp.diff_main(block.blockTitle, comparedBlock.blockTitle)
        const contentDiff = dmp.diff_main(block.content, comparedBlock.content)
        dmp.diff_cleanupSemantic(titleDiff)
        dmp.diff_cleanupSemantic(contentDiff)
        articleDiff.push({ titleDiff, contentDiff })
      })

      return articleDiff
    },
    getPlainTextBlocks(blocks) {
      const plainTextBlocks = []
      blocks.forEach(block => {
        const { blockTitle } = block.blockInfo
        let content = ''
        block.content.content.forEach(paragraph => {
          if (paragraph.content) {
            paragraph.content.forEach(text => {
              if (text.marks && text.marks.some(mark => mark.type === 'link')) {
                content += this.linkContainer + text.text + this.linkContainer
              } else { content += text.text }
            })
          }
          content += '\n\n'
        })
        plainTextBlocks.push({ blockTitle, content })
      })
      return plainTextBlocks
    },
    onPrevArticleClicked() {
      if (this.base <= 1) {
        return
      }
      this.base -= 1
      this.compare = this.base + 1
      console.log(this.base, this.compare)
      this.handleGetArticlesComparison()
    },
    onNextArticleClicked() {
      if (this.base >= this.versionsLength - 1) {
        return
      }
      this.base += 1
      this.compare = this.base + 1
      console.log(this.base, this.compare)
      this.handleGetArticlesComparison()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

<style lang="scss">

</style>
