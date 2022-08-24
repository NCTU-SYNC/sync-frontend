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
          <b-button
            variant="link"
            :disabled="base <= 1"
            @click="onPrevArticleClicked"
          >
            <b-icon icon="chevron-left" />
            前一版
          </b-button>
          <span> &nbsp; | &nbsp;</span>
          <b-button
            variant="link"
            :disabled="base + 1 >= versionsLength"
            @click="onNextArticleClicked"
          >
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
            <div :class="{ 'clicked-row': isClickedRow && base > compare }">
              <span class="mr-2 pr-2 border-right">{{
                versions[0].updatedAt
              }}</span>
              <span>{{
                versions[0].author.isAnonymous
                  ? '匿名'
                  : versions[0].author.name
              }}</span>
            </div>
          </b-col>
          <b-col class="py-2 comparison-header d-flex" cols="6">
            <div :class="{ 'clicked-row': isClickedRow && base < compare }">
              <span class="mr-2 pr-2 border-right">{{
                versions[1].updatedAt
              }}</span>
              <span>{{
                versions[1].author.isAnonymous
                  ? '匿名'
                  : versions[1].author.name
              }}</span>
            </div>
            <div>
              <span
                class="bg-diff-add px-2 py-1 m-2"
              >+{{ wordsChanged.added }}</span>
              <span
                class="bg-diff-delete px-2 py-1 m-2"
              >-{{ wordsChanged.deleted }}</span>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row
      v-for="(blocks, index) in allDiff"
      :key="index"
      class="divider"
    >
      <b-col cols="6" :class="!blocks.right.content ? 'deleted-block': ''">

        <div v-if="blocks.left.title !== ''" class="block-header">
          <h2>
            {{ blocks.left.title }}
          </h2>
        </div>
        <TiptapEditor
          v-if="blocks.left.content !== null"
          :id="blocks.left.blockId"
          :content="blocks.left.content"
          class="editor__content__comparison"
          :editable="false"
        />
      </b-col>
      <b-col cols="6" :class="!blocks.left.content ? 'new-block': ''">
        <div class="block-header">
          <h2>
            {{ blocks.right.title }}
          </h2>
        </div>
        <TiptapEditor
          :id="blocks.right.blockId"
          class="editor__content__comparison"
          :content="blocks.right.content"
          :editable="false"
        />
      </b-col>
    </b-row>
    <ComparisonCitation :citations="[versions[0].citations, versions[1].citations]" />
    <b-row class="mt-3" />
  </b-container>
</template>

<script>
import { ComparisonCitation } from '@/components/History'
import TiptapEditor from '@/components/Editor/TiptapEditor.vue'
import historyAPI from '@/api/history'
import moment from 'moment'
import VersionDiff from '@/utils/versionDiff'

export default {
  components: {
    ComparisonCitation,
    TiptapEditor
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
      isClickedRow: true,
      blocks1: [],
      blocks2: [],
      allDiff: []
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
        const { data } = await historyAPI.getComparison(
          this.articleId,
          this.base,
          this.compare
        )

        const { articles, length, base, compare, title, wordsChanged } =
          data.data
        this.versionsLength = length
        if (
          this.$route.query.base !== base.toString() ||
          this.$route.query.compare !== compare.toString()
        ) {
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

        // Get two versions of article
        for (let i = 0; i < 2; i += 1) {
          const title = articles[i].title
          const blocks = articles[i].blocks
          const author = articles[i].author
          const citations = articles[i].citations
          const updatedAt = moment(articles[i].updatedAt).format(
            'YYYY/MM/DD HH:mm'
          )
          this.versions = {
            ...this.versions,
            [i]: { title, blocks, author, updatedAt, citations }
          }
        }

        if (
          this.compare === this.versionsLength ||
          this.base === this.versionsLength
        ) {
          this.versions[1].updatedAt += '（最新版）'
        }

        // find common blocks and create id array
        const leftBlockIds = this.versions[0].blocks.map((b) => b.blockId)
        const rightBlockIds = this.versions[1].blocks.map((b) => b.blockId)
        const commonBlockIds = leftBlockIds.filter(o => rightBlockIds.some((blockId) => o === blockId))
          .map(b => b)

        // The code below is used to match common blocks between the
        // old article (left) and new article (right).
        // If a block is removed or added,
        // it has to maintain its relative position in the comparison order.

        const segments = [[]]
        let cIdx = 0
        let sIdx = 0
        // find removed blocks
        for (const bId of leftBlockIds) {
          if (bId !== commonBlockIds[cIdx]) {
            // Left block removed
            segments[sIdx].push(bId)
          } else {
            sIdx += 1
            segments.push([])
            if (cIdx + 1 < commonBlockIds.length) cIdx += 1
          }
        }
        // find added blocks
        cIdx = 0
        sIdx = 0
        for (const bId of rightBlockIds) {
          if (bId !== commonBlockIds[cIdx]) {
            // Right block added
            segments[sIdx].push(bId)
          } else {
            sIdx += 1
            if (cIdx + 1 < commonBlockIds.length) cIdx += 1
          }
        }

        // build diff order
        // We will compare the article blocks in this order
        const diffIdxOrder = []
        for (sIdx = 0; sIdx < segments.length; sIdx++) {
          diffIdxOrder.push(...segments[sIdx])
          if (sIdx < commonBlockIds.length) { diffIdxOrder.push(commonBlockIds[sIdx]) }
        }

        let leftIdx = 0
        let rightIdx = 0
        const leftBlocks = this.versions[0].blocks
        const rightBlocks = this.versions[1].blocks

        // if left or right block does not exists, fill blank block
        this.allDiff = []
        for (const orderIdx of diffIdxOrder) {
          const comparisonPair = {
            left: {},
            right: {}
          }
          if (leftBlocks[leftIdx]?.blockId === orderIdx) {
            comparisonPair.left = {
              title: leftBlocks[leftIdx].blockInfo.blockTitle,
              content: leftBlocks[leftIdx].content,
              blockId: leftBlocks[leftIdx].blockId
            }
            leftIdx += 1
          } else {
            comparisonPair.left = {
              title: '',
              content: null
            }
          }
          if (rightBlocks[rightIdx]?.blockId === orderIdx) {
            comparisonPair.right = {
              title: rightBlocks[rightIdx].blockInfo.blockTitle,
              content: rightBlocks[rightIdx].content,
              blockId: rightBlocks[rightIdx].blockId
            }
            rightIdx += 1
          } else {
            comparisonPair.right = {
              title: '',
              content: null
            }
          }
          this.allDiff.push(comparisonPair)
        }

        // Run version comparison
        for (const both of this.allDiff) {
          if (both.left.title !== '' && both.right.title !== '') {
            const diff = new VersionDiff(both.left.content, both.right.content)
            diff.mark()
          }
        }

        this.isPageReady = true
      } catch (error) {
        console.error(error)
      }
    },
    onPrevArticleClicked() {
      if (this.base <= 1) {
        return
      }
      this.isClickedRow = false
      this.base -= 1
      this.compare = this.base + 1
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
    border-right: 2px solid #e6e6e6;
  }
  > div:last-child {
    border-left: 2px solid #e6e6e6;
  }
  > div > p {
    margin: 0;
  }
  margin-top: 16px;
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
    border-radius: 4px;
  }
  &-delete {
    background-color: #FF4F4F;
    border-radius: 4px;
  }
}

.block {
  &-header {
    h3 {
      font-size: 24px;
    }
  }
}

.deleted-block {
  background-color: rgba(255, 79, 79, 0.3);
}
.new-block {
  background-color: rgba(26, 225, 91, 0.3);
}

</style>
