<template>
  <b-card no-body>
    <b-card-header header-tag="header" class="news-header">
      <h4>{{ title }}</h4>
    </b-card-header>
    <b-card-body>
      <b-card-text>
        <p v-if="!expand" key="outline" class="content-outline">
          {{ outline }}
          <b-button variant="link" @click="expandContent(true)">展開</b-button>
        </p>
        <p v-for="(paragraph, index) in content" v-else :key="index">
          {{ paragraph }}
          <b-button
            v-if="index === content.length - 1"
            variant="link"
            @click="expandContent(false)"
          >收合</b-button>
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer class="d-flex justify-content-between align-items-center">
      <div>
        <span>{{ source }}</span>
        <span class="ml-2">{{ getDateTime }}</span>
        <span class="ml-2"> | </span>
        <span class="ml-2">
          <b-link :href="url" target="_blank"> 原文 </b-link>
        </span>
      </div>
      <input id="copy" type="hidden" :value="content">
      <b-button variant="secondary" @click="importNews">
        <span>引用全文</span>
      </b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import moment from 'moment'
import { Utils } from '@/utils'

export default {
  name: 'NewsCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: Array,
      default: null
    },
    outline: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '#'
    },
    source: {
      type: String,
      default: ''
    },
    datetime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      newsCardId: '',
      expand: false
    }
  },
  computed: {
    getDateTime() {
      const datetime = moment(this.datetime)
      if (datetime.isValid()) {
        return datetime.format('YYYY.MM.DD')
      }
      return ''
    }
  },
  created() {
    // 產生隨機ID，讓元件綁上id
    this.newsCardId = Utils.getRandomString()
  },
  methods: {
    importNews() {
      const currentEditingEditor = this.$store.state.post.currentEditingEditor
      if (currentEditingEditor === null) {
        this.$bvModal.msgBoxOk(
          '請先點擊畫面左方欲引入新聞的內文輸入框，之後再從右方新聞欄中引入新聞。'
        )
        return
      }
      const { title, url } = this
      let str = ''
      this.content.slice(0, -1).forEach((text) => {
        str += `<p>${text.replace(/^\s+|\s+$/g, '')}</p>`
      })

      // insert at caret position or replace selected text
      const { from, to } = currentEditingEditor.state.selection
      currentEditingEditor
        .chain()
        .insertContentAt({ from, to }, str)
        .focus()
        .run()

      this.$store.dispatch('post/ADD_EDITOR_CITATION', { title, url })

      this.$nextTick(() => {
        this.$bvToast.show('citation-toast')
      })
    },
    expandContent(isExpand) {
      this.expand = isExpand
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/post/main.scss';
.card {
  border: 1px solid #dbdce1;
  color: $text-2;
  padding: 1rem;
  transition: all 1s;
  .news-header {
    background-color: white;
    border-bottom: none;
    padding: 0;
    h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: $text-1;
      line-height: 1.875rem;
      margin: 0;
    }
  }
  .card-body {
    padding: 0.75rem 0 0.75rem 0;
    p {
      font-size: 1.125rem;
      line-height: 1.875rem;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
  .card-footer {
    // margin-top: 1.5rem;
    padding: 0;
    background-color: $white;
    padding-top: 1rem;

    span {
      font-size: 14px;
      line-height: 1.5rem;
    }

    a {
      text-decoration: underline !important;
    }
  }
}

.btn-link {
  display: inline;
  color: $blue;
  padding: 0;
  padding-bottom: 5px;
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1.875rem;
  text-decoration: underline;
}
</style>
