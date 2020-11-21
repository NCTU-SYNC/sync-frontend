<template>
  <b-card
    no-body
    class="border"
  >
    <b-card-header
      header-tag="header"
      class="p-1 bg-light"
    >
      <div class="news-header px-3 py-2">
        <b>{{ title }}</b>
        <div class="news-info">
          <p>中央社</p>
          <p>2020.10.26 18:00</p>
        </div>
      </div>
    </b-card-header>
    <b-card-body>
      <b-card-text>{{ outline }}</b-card-text>
      <b-row>
        <b-col class="d-flex justify-content-between align-items-center">
          <b-link
            :href="url"
            target="_blank"
          >
            查看全文
          </b-link>
          <b-button
            variant="outline-primary"
            pill
            class="px-3"
            @click="importNews"
          >
            引入全文
          </b-button>
        </b-col>
      </b-row>
      <input
        id="copy"
        type="hidden"
        :value="content"
      >
    </b-card-body>
  </b-card>
</template>

<script>
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
    }
  },
  data () {
    return {
      newsCardId: ''
    }
  },
  created () {
    // 產生隨機ID，讓元件綁上id
    this.newsCardId = Math.random().toString(36).substring(7)
    console.log('Random newsCardId id: ', this.newsCardId)
  },
  methods: {
    importNews () {
      console.log(this.content)
      this.$emit('importNews', this.content)
    }
  }
}
</script>

<style scoped lang="scss">
.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  b {
    font-size: 1.1rem;
  }

}
.news-info {
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: right;

  p {
    white-space: nowrap;
    margin: 0 0;
    color: $secondary;
    font-size: 0.9rem;
  }
}
</style>
