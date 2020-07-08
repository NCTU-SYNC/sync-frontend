<template>
  <b-card>
    <h3>
      {{ title }}
    </h3>
    <p>
      {{ content }}
    </p>
    <b-row align-h="between">
      <b-col>
        <a href="#">查看全文</a>
      </b-col>
      <b-col>
        <b-button @click="importNews">引入全文</b-button>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'NewsCard',
  props: {
    title: String,
    content: String
  },
  methods: {
    importNews() {
      this.$emit('importNews', this.content)
    }
  }
}
</script>

<style>

</style>
