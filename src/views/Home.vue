<template>
  <div>
    <component :is="pageComponent" v-bind="$props" />

    <b-toaster
      class="b-toaster-top-center"
      name="home-toaster"
    />

    <b-toast
      id="toast-article-not-found"
      toaster="home-toaster"
      auto-hide-delay="2000"
      no-close-button
    >
      尚未有關於此主題的文章
    </b-toast>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  props: {
    category: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      pageComponent: () => this.$props.category === ''
        ? import('@/components/Home/Recommand.vue') : import('@/components/Home/Topic.vue')
    }
  },

  watch: {
    '$route.query'() {
      this.pageComponent = () => this.$props.category === ''
        ? import('@/components/Home/Recommand.vue') : import('@/components/Home/Topic.vue')
    }
  }
}
</script>

<style lang="scss">
#toast-article-not-found {
  width: fit-content;
  margin: 4rem auto 0;
  padding: 0 0.5em;

  background-color: $blue-4;
  color: $gray-2;

  border-radius: 9999px;
  box-shadow: 0 4px 16px 0 rgb(0 0 0 / 8%);
}
</style>
