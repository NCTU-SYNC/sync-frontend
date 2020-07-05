<template>
  <div>
    <b-input-group class="mt-3" style="margin-bottom: 20px;">
      <b-form-input />
      <b-input-group-append>
        <b-button variant="outline-secondary" @click="getNews">Search</b-button>
      </b-input-group-append>
    </b-input-group>
    <b-row align-h="start">
      <b-col sm="3">
        <b-dropdown variant="outline-secondary" text="時間">
          <b-dropdown-item>2020/7/4</b-dropdown-item>
          <b-dropdown-item>2020/7/5</b-dropdown-item>
        </b-dropdown>
      </b-col>
      <b-col sm="3">
        <b-dropdown variant="outline-secondary" text="新聞來源">
          <b-dropdown-item>三立</b-dropdown-item>
          <b-dropdown-item>中天</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <div v-for="i in 3" :key="i" style="margin-top: 10px;">
      <NewsCard :title="'title '+i" content="test content" @importNews="emitToEditPage" />
    </div>
  </div>
</template>

<script>
import NewsCard from './NewsCard'
export default {
  name: 'NewsPanel',
  components: {
    NewsCard
  },
  methods: {
    emitToEditPage(content) {
      this.$emit('importNews', content)
    },
    getNews() {
      // TODO
      console.log('get news using api')
    }
  }
}
</script>

<style>

</style>
