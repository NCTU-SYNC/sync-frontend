<template>
  <b-row class="category-navbar">
    <b-col>
      <b-nav class="item-container">
        <b-nav-item
          v-for="(category, index) in categoryList"
          :key="index"
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
  align-items: center;
  line-height: 30px;
  height: 48px;
  font-size: 18px;
  font-weight: 700;
  color: #212124;
}
.item-container{
  max-width: 1024px;
  justify-content: space-between;
  margin: 0 auto;
  li:first-child {
    a {
      margin-left: -1rem;
    }
  }
  li:last-child {
    a {
      margin-right: -1rem;
    }
  }

}
.category-item{
  &:hover{
    color: $blue !important;
  }
}
</style>
