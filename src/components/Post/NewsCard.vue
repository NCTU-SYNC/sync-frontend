<template>
  <b-card no-body>
    <b-card-header
      header-tag="header"
      class="p-1"
      role="tab"
    >
      <b-button
        v-b-toggle="newsCardId"
        block
        variant="light"
      >
        {{ title }}
      </b-button>
    </b-card-header>
    <b-collapse
      :id="newsCardId"
      visible
      accordion="newsList"
      role="tabpanel"
    >
      <b-card-body>
        <b-card-text>{{ outline }}</b-card-text>
        <b-row align-h="between">
          <b-col>
            <b-link
              :href="url"
              target="_blank"
              class="pt-2"
            >
              查看全文
            </b-link>
          </b-col><b-col>
            <b-button
              style="float: right"
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
    </b-collapse>
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

<style>

</style>
