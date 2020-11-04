<template>
  <b-container>
    <b-row>
      <b-col>
        <b-nav
          align="center"
          class="sync-category-navbar"
        >
          <b-nav-item
            v-for="(category, index) in categoryList"
            :key="index"
          >
            {{ category }}
          </b-nav-item>
        </b-nav>
      </b-col>
    </b-row>
    <b-row class="mt-3 py-2">
      <b-col class="d-flex justify-content-center">
        <div class="d-flex flex-grow-1 p-3">
          <div>
            <p>即時熱編</p>
            <h1>台灣每日新增新官肺炎總表</h1>
            <span class="text-muted">更新於3小時前</span>
            <span class="text-muted">32個人正在閱讀</span>
            <p class="mt-3">
              中央流行疫情指揮中心7日由發言人莊人祥公布國內新增1例境外移入新冠肺炎（武漢肺炎）病例，為本國籍20多歲男性（案494），今年2月至尼泊爾參加宗教活動，3日與友人一同返國，並在7日確診。
            </p>
          </div>
          <div class="sync-hot-news-img">
            <b-aspect
              aspect="4:3"
              style="overflow: hidden;"
            >
              <b-img-lazy
                fluid
                src="http://fakeimg.pl/800x600?text=圖片&font=noto"
                alt="Image"
              />
            </b-aspect>
          </div>
        </div>
        <div class="sync-hot-tags p-3">
          <h1>熱門標籤</h1>
          <div class="d-flex flex-column align-items-start">
            <b-button
              v-for="(tag, index) in hotTags"
              :key="index"
              class="mt-3"
              variant="outline-secondary"
              pill
            >
              # {{ tag }}
            </b-button>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'HomeNew',
  data () {
    return {
      categoryList: ['即時', '政經', '國際', '社會', '科技', '環境', '生活', '運動'],
      hotTags: ['台海危機', '美國大選', '振興三倍券', '新冠病毒', '美國豬牛', '黃鴻升']
    }
  }
}
</script>

<style scoped lang="scss">
h1, h2, h3, h4, h5 {
  font-weight: bold;
}

a {
  text-decoration: none !important;
  color: $gray-900 !important;
}

.sync-category-navbar {
  border-top: 1px solid $gray-900;
  border-bottom: 1px solid $gray-900;
  a {
    font-weight: bold;
    font-size: 1.5rem;
  }
}

.sync-hot-news-img {
  min-width: 25vw;
  display: flex;
  align-items: center;
}

.sync-hot-tags {
  min-width: 20vw;
  border-left: 1px solid $gray-500;
}

.tag-link {
  border-radius: 1.5rem;
  border: 1px solid $gray-900;
}
</style>
