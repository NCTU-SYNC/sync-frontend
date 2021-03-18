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
        每頁顯示：
        <b-dropdown :text="historyShowCount.toString()" class="m-2" variant="transparent">
          <b-dropdown-item-button
            :active="historyShowCount === 10"
            @click="onLimitDropdownClicked(10)"
          >10
          </b-dropdown-item-button>
          <b-dropdown-item-button
            :active="historyShowCount === 30"
            @click="onLimitDropdownClicked(30)"
          >30
          </b-dropdown-item-button>
          <b-dropdown-item-button
            :active="historyShowCount === 50"
            @click="onLimitDropdownClicked(50)"
          >50
          </b-dropdown-item-button>
        </b-dropdown>
        <div class="h-100 d-flex align-items-center">
          <!-- issue: https://github.com/vuejs/eslint-plugin-vue/issues/370 -->
          <span class="ml-1 pr-2 link-right">{{ from + 1 }}-{{ versionsLength &lt; to ? versionsLength: to }}</span>
          <span class="ml-1 pl-2">共有{{ versionsLength }}個版本</span>
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
      <b-col sm="2" />
      <b-col sm="3">
        版本日期
      </b-col>
      <b-col sm="5">
        編輯者
      </b-col>
      <b-col sm="2" class="text-center">
        編輯更動字數
      </b-col>
    </b-row>
    <b-row v-for="(item, itemIndex) in historyItems" :key="itemIndex" class="history-row">
      <b-col sm="2" class="compare-options">
        <div v-if="item.type === 'header'" class="no-headers">
          <h5>{{ item.month }}</h5>
        </div>
        <div v-else>
          <b-link
            class="pr-2 link-right"
            :class="{ 'text-primary': item.index !== versionsLength}"
            :to="`/compare/${articleId}?base=${versionsLength}&compare=${item.index}`"
            :disabled="item.index === versionsLength"
          >最新</b-link>
          <b-link
            class="pl-2"
            :class="{ 'text-primary': item.index !== 1}"
            :to="`/compare/${articleId}?base=${item.index}&compare=${item.index - 1}`"
            :disabled="item.index === 1"
          >前一版</b-link>
        </div>
      </b-col>
      <b-col sm="3">
        {{ item.updatedAt }}
      </b-col>
      <b-col sm="5">
        {{ item.author }}
      </b-col>
      <b-col v-if="item.editTextCounts" sm="2">
        <span v-if="item.editTextCounts[0]" class="bg-diff-add px-2 py-1 m-2">{{ item.editTextCounts[0] }}</span>
        <span v-if="item.editTextCounts[1]" class="bg-diff-delete px-2 py-1 m-2">{{ item.editTextCounts[1] }}</span>
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
      historyShowCount: 10,
      currentViewPage: 1,
      versionsLength: 0,
      from: 0,
      to: 0
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
    this.historyShowCount = this.$route.query.limit || 10
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
            editTextCounts: ['0', '0']
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
    }
  }
}
</script>
<style lang="scss" scoped>
.history-header {
  height: 4rem;
  border-bottom: 1px solid;
  div {
    display: flex;
    align-items: center
  }
}

.history-row {
  height: 4rem;
  border-bottom: 1px solid $gray-500;
  div {
    display: flex;
    align-items: center
  }

  .compare-options {
    justify-content: center
  }

  &:hover {
    background-color: $light;
  }
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
