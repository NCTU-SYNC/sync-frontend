<template>
  <b-card
    no-body
  >
    <b-card-header
      header-tag="header"
      class="news-header"
    >
      <h4>{{ title }}</h4>
    </b-card-header>
    <b-card-body>
      <b-card-text>
        <p v-if="!expand" key="outline" class="content-outline">{{ outline }}
          <b-button variant="link" @click="expandContent(true)">展開</b-button>
        </p>
        <p v-for="(paragraph,index) in content" v-else :key="index">
          {{ paragraph }}
          <b-button v-if="index===content.length-1" variant="link" @click="expandContent(false)">收合</b-button>
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer class="d-flex justify-content-between align-items-center">
      <div>
        <span>{{ source }} {{ getDateTime }}</span>
        <span> | </span>
        <b-link
          :href="url"
          target="_blank"
        >
          原文
        </b-link>
      </div>
      <input
        id="copy"
        type="hidden"
        :value="content"
      >
      <b-button
        variant="edit-outline"
        @click="importNews"
      >
        引入全文
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
      const { title, url } = this // const title = this.title; const url ...
      this.$store.dispatch('post/SUBMIT_CITATION_FORM', { title, url })
      // this.$emit('importNews', this.content)
      const currentEditingEditor = this.$store.state.post.currentEditingEditor
      if (currentEditingEditor === null) {
        this.$bvModal.msgBoxOk('請選擇編輯區塊，或是先新增段落後再引入')
        return
      }
      let str = currentEditingEditor.getHTML()
      this.content.forEach((text) => {
        str += `<p>${text}</p>`
      })
      currentEditingEditor.commands.setContent(str)
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
  border: 1px solid #DBDCE1;
  color: $text-2;
  padding: 1rem 1.5rem;
  transition: all 1s;
  .news-header {
    background-color: white;
    border-bottom: none;
    padding: 0;
    h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: $text-1;
      line-height: 28px;
      margin: 0;
    }
  }
  .card-body {
    padding: 1rem 0 1.5rem 0;
    p {
      font-size: 1rem;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
  .card-footer {
    // margin-top: 1.5rem;
    padding: 0;
    background-color: $white;
    font-size: 14px;
    padding-top: 1rem;
  }
}
.btn-link {
  display: inline;
  color: $blue;
  padding: 0;
  padding-bottom: 5px;
  font-weight: bold;
  text-decoration: underline;
}

</style>
