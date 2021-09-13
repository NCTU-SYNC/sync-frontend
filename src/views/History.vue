<template>
  <b-container fluid="lg">
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
    <b-row>
      <b-col class="d-flex justify-content-end align-items-center">
        <div class="h-100 d-flex align-items-center">
          <!-- issue: https://github.com/vuejs/eslint-plugin-vue/issues/370 -->
          <span class="ml-1 pr-2 ">{{ from + 1 }}-{{ versionsLength &lt; to ? versionsLength: to }}篇</span>
          <span class="ml-1 pl-2">(共{{ versionsLength }}篇)</span>
        </div>

        <div>
          <b-button
            variant="link"
            :disabled="!isPrevPageButtonEnable"
            @click="onPrevPageClicked"
          >
            <b-icon icon="chevron-left" />
          </b-button>
          <span class="link-right" />
          <b-button
            variant="link"
            :disabled="!isNextPageButtonEnable"
            @click="onNextPageClicked"
          >
            <b-icon icon="chevron-right" />
          </b-button>
        </div>

      </b-col>
    </b-row>
    <b-row class="history-header">
      <b-col sm="4">
        <div class="date-container">
          版本日期
        </div>
      </b-col>
      <b-col sm="5">
        編輯者
      </b-col>
      <b-col sm="3">
        版本比較
      </b-col>
    </b-row>
    <b-row
      v-for="(item, itemIndex) in historyItems"
      :key="itemIndex"
      class="history-row"
      :class="{ 'hovered-row' : item.index != null,
                'compared-row' : isComparedRow(item.index)}"
    >
      <b-col sm="4">
        <div class="date-container">
          <slot v-if="item.type === 'header'" class="no-headers">
            <h5>{{ item.month }}</h5>
          </slot>
          <slot>
            {{ item.updatedAt }}
          </slot>
        </div>
      </b-col>
      <b-col sm="5">
        {{ item.author }}
      </b-col>
      <b-col sm="3" class="compare-options">
        <div v-if="item.type !== 'header'">
          <b-link
            class="pr-2 link-right"
            :class="{ 'text-primary': item.index !== 1,
                      'hovered-link': item.index !== 1}"
            :to="`/compare/${articleId}?base=${item.index - 1}&compare=${item.index}`"
            :disabled="item.index === 1"
            @mouseover="onPrevLinkMouseover(item.index)"
            @mouseout="onPrevLinkMouseout(item.index)"
          >與前一版比較</b-link>

          <b-link
            class="pl-2"
            :class="{ 'text-primary': item.index !== versionsLength,
                      'hovered-link': item.index !== versionsLength}"
            :to="`/compare/${articleId}?base=${versionsLength}&compare=${item.index}`"
            :disabled="item.index === versionsLength"
            @mouseover="onLatestLinkMouseover(item.index)"
            @mouseout="onLatestLinkMouseout(item.index)"
          >與最新版比較</b-link>
        </div>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { getArticleVersionsById } from '@/api/history'
import moment from 'moment'

export default {
  name: 'History',
  data() {
    return {
      breadcrumbItems: [
        {
          text: this.title,
          to: `/article/${this.articleId}`
        },
        {
          text: '編輯紀錄',
          active: true
        }
      ],
      historyItems: [],
      currentVersion: null,
      historyShowCount: 20,
      currentViewPage: 1,
      versionsLength: 0,
      from: 0,
      to: 0,
      currentHoveredRow: null,
      isHoveringLatestLink: false,
      isHoveringPrevLink: false
    }
  },
  computed: {
    articleId() {
      return this.$route.params.ArticleID
    },
    currentViewVersion() {
      return this.$route.query.version
    },
    title() {
      return this.currentVersion && this.currentVersion.title
    },
    isNextPageButtonEnable() {
      return this.currentViewPage < this.versionsLength / this.historyShowCount
    },
    isPrevPageButtonEnable() {
      return this.currentViewPage > 1
    }
  },
  watch: {
    title(value) {
      this.breadcrumbItems[0].text = value
      this.breadcrumbItems[0].to = `/article/${this.articleId}`
    }
  },
  created() {
    this.historyShowCount = this.$route.query.limit || 20
    this.currentViewPage = this.$route.query.page || 1

    if (this.articleId) {
      this.handleGetArticleVersions()
    }
  },
  methods: {
    async handleGetArticleVersions() {
      this.historyItems = []
      this.$route.query.limit = this.historyShowCount
      this.$route.query.page = this.currentViewPage
      try {
        const { data } = await getArticleVersionsById({
          articleId: this.articleId,
          limit: this.historyShowCount,
          page: this.currentViewPage
        })
        const { currentVersion, versions, length, limit, page, from, to } = data.data
        this.currentVersion = currentVersion
        this.versionsLength = length
        this.from = from
        this.to = to
        const monthDict = {}
        for (const version of versions) {
          let updatedAt = moment(version.updatedAt).format('YYYY/MM/DD HH:mm')
          if (version.versionIndex === length) {
            updatedAt += '（最新版）'
          }

          const monthStr = moment(version.updatedAt).format('YYYY/MM')
          if (!monthDict[monthStr]) {
            this.historyItems.push({
              type: 'header',
              month: monthStr
            })
            monthDict[monthStr] = true
          }
          this.historyItems.push({
            blockId: version._id,
            author: version.author.name,
            updatedAt,
            index: version.versionIndex,
            editTextCounts: { added: version.wordsChanged.added, deleted: version.wordsChanged.deleted }
          })
        }
        this.historyShowCount = limit
        this.currentViewPage = page
      } catch (error) {
        console.log(error)
      }
    },
    onLimitDropdownClicked(value) {
      this.historyShowCount = value
      this.$router.replace({ query: { limit: this.historyShowCount, page: this.currentViewPage }})
      this.handleGetArticleVersions()
    },
    onNextPageClicked() {
      if (!this.isNextPageButtonEnable) { return }
      this.currentViewPage += 1
      this.$router.replace({ query: { limit: this.historyShowCount, page: this.currentViewPage }})
      this.handleGetArticleVersions()
    },
    onPrevPageClicked() {
      if (!this.isPrevPageButtonEnable) { return }
      this.currentViewPage -= 1
      this.$router.replace({ query: { limit: this.historyShowCount, page: this.currentViewPage }})
      this.handleGetArticleVersions()
    },
    onLatestLinkMouseover(index) {
      this.currentHoveredRow = index
      this.isHoveringLatestLink = true
    },
    onLatestLinkMouseout(index) {
      this.currentHoveredRow = -1
      this.isHoveringLatestLink = false
    },
    onPrevLinkMouseover(index) {
      this.currentHoveredRow = index
      this.isHoveringPrevLink = true
    },
    onPrevLinkMouseout(index) {
      this.currentHoveredRow = -1
      this.isHoveringPrevLink = false
    },
    isComparedRow(index) {
      if (this.isHoveringPrevLink && (index === this.currentHoveredRow - 1)) {
        return true
      } else if (this.isHoveringLatestLink && (index === this.versionsLength)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.history-header {
  height: 4rem;
  border-top:1px solid;
  border-bottom: 1px solid;
  font-family: Noto Sans CJK TC;
  font-weight: bold;
  div {
    display: flex;
    align-items: center
  }
}

.history-row {
  height: 4rem;
  position: relative;
  border-bottom: 1px solid $gray-500;
  div {
    display: flex;
    align-items: center
  }

  .compare-options {
    justify-content: center
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
h5 {
  margin: 0;
}

.link-right {
  border-right: 1px solid $gray-400;
}

.bg-diff {
  &-add {
    background-color: #1AE158;
  }
  &-delete {
    background-color: #FF4F4F;
  }
}
.compared-row{
  background-color:#E9EEFF;
}
.hovered-link:hover {
   color:#2353FF !important;
}
.hovered-row:hover {
    background-color: #F6F6F8;
    &::before{
      content:"";
      position:absolute;
      width: 12px;
      height: 12px;
      left :10px;
      top: 25px;
      background: #2353FF;
    }
}
.date-container{
  margin-left: 16px;
}
</style>

<style lang="scss">
.table-class {
  border: none !important;
}

.font-weight-normal {
  font-weight: normal !important;
  border-top: none !important;
}

.disabled:hover {
  text-decoration: none;
  color: $secondary;
  cursor: auto;
}
</style>
