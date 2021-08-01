<template>
  <b-row class="category-navbar">
    <b-col>
      <b-nav
        align="center"
      >
        <b-nav-item
          v-for="(category, index) in categoryList"
          :key="index"
          class="px-3"
          link-classes="category-item"
          :to="{path:'/', query: { category: category }}"
        >
          {{ category }}
        </b-nav-item>
      </b-nav>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'CategoryBar',
  data() {
    return {
      categoryList: ['政經', '國際', '社會', '科技', '環境', '生活', '運動']
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/news.scss';
.category-navbar{
  border-bottom: 1px solid $gray-light;
}

.category-item{
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 8px;
  color: #232323;
  &:hover{
    color: $blue !important;
  }
}
</style>
