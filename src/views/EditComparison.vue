<template>
  <b-container v-if="isPageReady" fluid="xl">
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
            前一版
          </b-button>
          <span> &nbsp; | &nbsp;</span>
          <b-button variant="link" :disabled="base + 1 >= versionsLength" @click="onNextArticleClicked">
            後一版
            <b-icon icon="chevron-right" />
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="isPageReady" class="shadow-sm">
      <b-col>
        <b-row class="divider">
          <b-col class="py-2 comparison-header" cols="6">
            <div :class="{'clicked-row': isClickedRow && base > compare}">
              <span class="mr-2 pr-2 border-right">{{ versions[0].updatedAt }}</span>
              <span>{{ versions[0].author.isAnonymous ? '匿名' : versions[0].author.name }}</span>
            </div>
          </b-col>
          <b-col class="py-2 comparison-header d-flex" cols="6">
            <div :class="{'clicked-row': isClickedRow && base < compare}">
              <span class="mr-2 pr-2 border-right">{{ versions[1].updatedAt }}</span>
              <span>{{ versions[1].author.isAnonymous ? '匿名' : versions[1].author.name }}</span>
            </div>
            <div>
              <span class="bg-diff-add px-2 py-1 m-2">+{{ wordsChanged.added }}</span>
              <span class="bg-diff-delete px-2 py-1 m-2">-{{ wordsChanged.deleted }}</span>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <slot v-for="(blockId, index) in diffOrderArr">
      <ComparisonBlock
        :base="getBlockInVersionByBlockId(versions[0], index, blockId)"
        :article-diff="articleDiff[index]"
        :link-container="linkContainer"
      />
    </slot>
    <ComparisonCitation :citations="[versions[0].citations, versions[1].citations]" />
    <b-row class="mt-3" />
  </b-container>
</template>

<script>
import DiffMatchPatch from 'diff-match-patch'
import { ComparisonBlock, ComparisonCitation } from '@/components/History'
import { getArticlesComparisonByVersionIndexes } from '@/api/history'
import moment from 'moment'

export default {
  components: {
    ComparisonBlock, ComparisonCitation
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
      linkContainer: '{{link}}',
      blockquoteContainer: '{{blockquote}}',
      diffOrderArr: [],
      isPageReady: false,
      isClickedRow: true
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
  mounted() {
    this.base = this.$route.query.base
    this.compare = this.$route.query.compare
    this.handleGetArticlesComparison()
  },
  methods: {
    async handleGetArticlesComparison() {
      try {
        this.isPageReady = false
        this.versions = {}
        const { data } = await getArticlesComparisonByVersionIndexes({
          articleId: this.articleId,
          base: this.base,
          compare: this.compare
        })
        const { articles, length, base, compare, title, wordsChanged } = data.data
        this.versionsLength = length
        if (this.$route.query.base !== base.toString() || this.$route.query.compare !== compare.toString()) {
          this.$router.replace({ query: { base, compare }})
        }
        this.wordsChanged = wordsChanged
        this.base = base
        this.compare = compare
        this.title = title

        // Adjust the time order of the articles
        if (moment(articles[0].updatedAt).isAfter(articles[1].updatedAt)) {
          articles.reverse()
        }

        for (let i = 0; i < 2; i += 1) {
          const title = articles[i].title
          const blocks = articles[i].blocks
          const author = articles[i].author
          const citations = articles[i].citations
          const updatedAt = moment(articles[i].updatedAt).format('YYYY/MM/DD HH:mm')
          this.versions = {
            ...this.versions,
            [i]: { title, blocks, author, updatedAt, citations }
          }
        }

        if (this.compare === this.versionsLength || this.base === this.versionsLength) {
          this.versions[1].updatedAt += '（最新版）'
        }

        this.articleDiff = this.compareContent(this.versions[0].blocks, this.versions[1].blocks)
        this.versions[1].articleDiff = this.articleDiff
        this.isPageReady = true
      } catch (error) {
        console.log(error)
      }
    },
    getBlockInVersionByBlockId(versionContent, index, diffArrBlockId) {
      // 根據 Diff array 找出該 block 傳入 ComparisonBlock，若無則傳入 null，用於顯示版本比對 block
      // diffArrBlockId: 渲染時根據base和compare比較後產生的聯集陣列 blockId
      if (versionContent) {
        const block = versionContent.blocks[index]
        if (block !== undefined) {
          if (block.blockId === diffArrBlockId) {
            return block
          }
          const nonOrderedBlock = versionContent.blocks.find(b => b.blockId === diffArrBlockId)
          return nonOrderedBlock || null
        }
      }
      return null
    },
    union(arg) {
      var arrs = [].slice.call(arg)
      var out = []
      for (var i = 0, l = arrs.length; i < l; i++) {
        for (var j = 0, jl = arrs[i].length; j < jl; j++) {
          var currEl = arrs[i][j]
          if (out.indexOf(currEl) === -1) {
            if (j - 1 !== -1 && out.indexOf(arrs[i][j - 1]) > -1) {
              out.splice(out.indexOf(arrs[i][j - 1]) + 1, 0, currEl)
            } else {
              out.push(currEl)
            }
          }
        }
      }
      return out
    },
    compareContent(blocks1, blocks2) {
      const dmp = new DiffMatchPatch()
      // diff 的陣列
      const articleDiff = []
      // 存放 diff base 和 compare 的 dictionary
      const diffDict = {}
      const baseOrderArr = []
      for (const block of blocks1) {
        // 確認有blockId
        if (block.blockId) {
          baseOrderArr.push(block.blockId)
          // 確認字典裡面尚無 blockId
          if (diffDict[block.blockId] === undefined) {
            // 設定 base 的標題與文字
            diffDict[block.blockId] = {
              base: {
                title: block.blockInfo.blockTitle,
                text: this.getPlainText(block)
              }
            }
          }
        }
      }

      const compareOrderArr = []
      for (const block of blocks2) {
        // 確認有blockId
        if (block.blockId) {
          // 若比較的版本有插入新段落，則在 order 陣列新增，待會則照順序查看陣列
          // if (!diffOrderArr.includes(block.blockId)) {
          //  diffOrderArr.splice(i, 0, block.blockId)
          // }
          compareOrderArr.push(block.blockId)
          // 確認字典裡面尚無 blockId
          if (diffDict[block.blockId] === undefined) {
            diffDict[block.blockId] = {
              // 設定 compare 的標題與文字
              compare: {
                title: block.blockInfo.blockTitle,
                text: this.getPlainText(block)
              }
            }
          } else {
            // 設定 compare 的標題與文字
            diffDict[block.blockId].compare = {
              title: block.blockInfo.blockTitle,
              text: this.getPlainText(block)
            }
          }
        }
      }

      // 排列 diff id 順序的陣列
      const diffOrderArr = [...new Set([...baseOrderArr, ...compareOrderArr])]

      for (const blockId of diffOrderArr) {
        const empty = {
          title: '',
          text: ''
        }
        // 設定 base，若無 base 則給予空物件比對
        const base = diffDict[blockId] ? diffDict[blockId].base ? diffDict[blockId].base : empty : empty
        // 設定 base，若無 base 則給予空物件比對
        const compare = diffDict[blockId] ? diffDict[blockId].compare ? diffDict[blockId].compare : empty : empty
        const titleDiff = dmp.diff_main(base.title, compare.title)
        const contentDiff = dmp.diff_main(base.text, compare.text)
        dmp.diff_cleanupSemantic(titleDiff)
        dmp.diff_cleanupSemantic(contentDiff)
        articleDiff.push({ titleDiff, contentDiff })
      }

      this.diffOrderArr = diffOrderArr
      return articleDiff
    },
    getPlainText(blockContent) {
      let content = ''
      blockContent.content.content.forEach(paragraph => {
        if (paragraph.content) {
          if (paragraph.type === 'paragraph') {
            paragraph.content.forEach(text => {
              if (text.marks && text.marks.some(mark => mark.type === 'link')) {
                content += this.linkContainer + JSON.stringify({
                  text: text.text, marks: text.marks
                }) + this.linkContainer
              } else {
                content += text.text
              }
            })
          } else if (paragraph.type === 'blockquote') {
            // 暫時關閉 blockquote 比對功能
            // content += this.blockquoteContainer
            const payload = paragraph.content
            payload.forEach(p => {
              p.content.forEach(text => {
                if (text.marks && text.marks.some(mark => mark.type === 'link')) {
                  content += this.linkContainer + JSON.stringify({
                    text: text.text, marks: text.marks
                  }) + this.linkContainer
                } else {
                  content += text.text
                }
              })
            })
            // content += this.blockquoteContainer
          }
        }
        content += '\n\n'
      })
      return content
    },
    onPrevArticleClicked() {
      if (this.base <= 1) {
        return
      }
      this.isClickedRow = false
      this.base -= 1
      this.compare = this.base + 1
      console.log(this.base, this.compare)
      this.handleGetArticlesComparison()
    },
    onNextArticleClicked() {
      if (this.base >= this.versionsLength - 1) {
        return
      }
      this.isClickedRow = false
      this.base += 1
      this.compare = this.base + 1
      this.handleGetArticlesComparison()
    }
  }
}
</script>
<style lang="scss" scoped>
.divider {
  > div:first-child {
    border-right: 2px solid #E6E6E6;
  }
  > div:last-child {
    border-left: 2px solid #E6E6E6;
  }
  > div > p {
    margin: 0;
  }
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;

  p {
    margin: 0;
  }
}

.bg-diff {
  &-add {
    background-color: #1AE158;
  }
  &-delete {
    background-color: #FF4F4F;
  }
}
h4{
  font-family: Noto Sans CJK TC;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
}
.clicked-row{
  margin-left: 16px;
  ::before{
      content:"";
      position:absolute;
      width: 12px;
      height: 12px;
      left :10px;
      top: 15px;
      background: #2353FF;
    }
}
</style>
