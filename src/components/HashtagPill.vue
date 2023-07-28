<template>
  <button @click.stop="GotoHashtag"># {{ name }}</button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    GotoHashtag() {
      this.$router.push({ path: '/hashtag', query: { q: this.name }})
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  background-color: $gray-300;
  border: none;
  border-radius: 50px;
  padding: 2px 8px;

  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: $text-1;

  transition: background-color 0.15s ease-in-out;
  &:hover {
    background-color: $gray-400;
  }
}
</style>
