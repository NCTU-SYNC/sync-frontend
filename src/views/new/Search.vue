<template>
  <div>
    <b-container fluid="xl" class="search-bar-field d-flex flex-column justify-content-center">
      <b-row align-h="center">
        <b-col cols="8" class="d-flex justify-content-between search-bar px-1">
          <b-form-input type="text" placeholder="搜尋..." debounce="300" class="pl-1" />
          <img src="@/assets/images/search-icon.svg">
        </b-col>
      </b-row>
      <b-row class="mt-3" align-h="center">
        <b-col cols="8" class="d-flex justify-content-between">
          <div>
            <b-dropdown id="dropdown-time" variant="outline-primary" text="發布時間" class="mr-3" toggle-class="rounded-pill">
              <b-dropdown-item>昨天</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>前一週</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>前一個月</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>前半年</b-dropdown-item>
            </b-dropdown>
            <b-dropdown id="dropdown-source" variant="outline-primary" text="新聞來源" class="mr-3" toggle-class="rounded-pill">
              <b-dropdown-item>蘋果日報</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>中天新聞</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>中央社</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>報導者</b-dropdown-item>
            </b-dropdown>
            <b-dropdown id="dropdown-category" variant="outline-primary" text="主題分類" class="mr-3" toggle-class="rounded-pill">
              <b-dropdown-item>財經</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>國際</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>社會</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item>科技</b-dropdown-item>
            </b-dropdown>
          </div>
          <b-dropdown id="dropdown-sort" variant="outline-primary" text="排列方式" class="mr-4" toggle-class="rounded-pill">
            <b-dropdown-item>最相關</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item>最熱門</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item>最新的</b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer'

export default {
  name: 'Search',
  components: {
    Footer
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
.search-bar-field {
  height: 232px;
  background: #F3F3F3;
  .search-bar {
    border-bottom: 1px solid $gray;
  }
}
input, input:focus {
  border: 0px !important;
  background: transparent;
  font-size: 1.8em;
  font-family: 'Noto Sans CJK TC';
  font-weight: medium;
}
</style>
