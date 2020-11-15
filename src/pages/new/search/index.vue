<template>
  <b-container fluid="xl">
    <b-row class="bg-light p-4 text-center">
      <b-col>
        <h3># {{ tagName }}</h3>
      </b-col>
    </b-row>
    <b-row class="p-3">
      <b-col class="d-flex justify-content-center">
        <b-form inline>
          <p class="mb-0 mr-5">
            有 16 項結果
          </p>

          <label
            for="sort-select"
            class="mr-2"
          >
            排序依據：
          </label>
          <b-form-select
            id="sort-select"
            v-model="
              order"
            class="d-inline"
          >
            <b-form-select-option
              value="time"
              class="d-inline"
            >
              最後更新時間
            </b-form-select-option>
          </b-form-select>
        </b-form>
      </b-col>
    </b-row>
    <b-row
      class="sync-row mt-3 py-2 d-flex flex-column"
    >
      <div class="p-3 news-grid">
        <b-link
          v-for="(news, newsIndex) in newsList"
          :key="newsIndex"
        >
          <div class="pb-4">
            <p class="news-category">
              {{ news.category }}
            </p>
            <p class="news-title">
              {{ news.title }}
            </p>
            <div class="news-info">
              <span class="mr-3">更新於3小時前</span>
              <b-icon
                icon="eye-fill"
                class="mr-1"
              /><span>{{ news.viewCount }} 個人正在閱讀</span>
            </div>
            <div class="py-3">
              <b-button
                v-for="(tag, tagIndex) in news.tags"
                :key="tagIndex"
                :variant="tag === tagName ? 'primary': 'outline-primary'"
                :class="['m-1', 'flex-shrink-0', 'shadow-sm']"
                pill
              >
                {{ tag }}
              </b-button>
            </div>
          </div>
        </b-link>
      </div>
      <div class="text-center p-3">
        <b-button
          variant="outline-secondary"
          pill
        >
          查看更多
        </b-button>
      </div>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      tagName: '美國總統大選',
      order: 'time',
      newsList: [
        { category: '國際', title: '美國總統大選漸落幕，但你知道拜登的「離岸懲罰稅」是什麼嗎？', viewCount: 32, tags: ['美國總統大選', '拜登', '離岸懲罰稅', '智慧製造', '美國', '美國製造業'] },
        { category: '國際', title: '美國總統大選、香港民主派集體辭任、疫苗問世和本周更多好故事', viewCount: 32, tags: ['美國總統大選', '疫苗', '美國', '香港', '拜登'] },
        { category: '政經', title: '川普新談話 自知大勢已去', viewCount: 32, tags: ['美國總統大選', '川普', '民主黨', '美國'] },
        { category: '政經', title: '美國大選尚未塵埃落定 學者：川普加速對台議程設定', viewCount: 32, tags: ['美國總統大選', '美國', '拜登'] }, { category: '國際', title: '美國總統大選漸落幕，但你知道拜登的「離岸懲罰稅」是什麼嗎？', viewCount: 32, tags: ['美國總統大選', '拜登', '離岸懲罰稅', '智慧製造', '美國', '美國製造業'] },
        { category: '國際', title: '美國總統大選、香港民主派集體辭任、疫苗問世和本周更多好故事', viewCount: 32, tags: ['美國總統大選', '疫苗', '美國', '香港', '拜登'] },
        { category: '政經', title: '川普新談話 自知大勢已去', viewCount: 32, tags: ['美國總統大選', '川普', '民主黨', '美國'] },
        { category: '政經', title: '美國大選尚未塵埃落定 學者：川普加速對台議程設定', viewCount: 32, tags: ['美國總統大選', '美國', '拜登'] }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/news.scss';

#sort-select {
  border-radius: 1.5rem;
}
</style>
