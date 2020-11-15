<template>
  <b-container fluid="xl">
    <b-row class="sync-category-navbar">
      <b-col>
        <b-nav
          align="center"
        >
          <b-nav-item
            v-for="(category, index) in categoryList"
            :key="index"
            class="px-2 text-black"
          >
            {{ category }}
          </b-nav-item>
        </b-nav>
      </b-col>
    </b-row>
    <b-row class="sync-row py-3">
      <b-col class="d-flex justify-content-center">
        <b-row>
          <b-col
            cols="9"
            class="d-flex flex-grow-1 p-3"
          >
            <b-col cols="6">
              <h4>即時熱編</h4>
              <h2>台灣每日新增新官肺炎總表</h2>
              <span class="text-muted">更新於3小時前 </span>
              <span class="text-muted">32個人正在閱讀</span>
              <p class="mt-3">
                中央流行疫情指揮中心7日由發言人莊人祥公布國內新增1例境外移入新冠肺炎（武漢肺炎）病例，為本國籍20多歲男性（案494），今年2月至尼泊爾參加宗教活動，3日與友人一同返國，並在7日確診。
              </p>
            </b-col>
            <b-col
              cols="6"
              class="sync-hot-news-img ml-2"
            >
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
            </b-col>
          </b-col>
          <b-col
            cols="3"
            class="sync-hot-tags px-4 py-3"
          >
            <h4>熱門標籤</h4>
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
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row
      v-for="(newsBlock, newsBlockIndex) in newsList"
      :key="newsBlockIndex"
      class="sync-row mt-3 py-2 d-flex flex-column"
    >
      <h2 class="category-title">
        {{ newsBlock.title }}
      </h2>
      <div class="p-3 news-grid">
        <b-link
          v-for="(news, newsIndex) in newsBlock.content"
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
  name: 'HomeNew',
  data () {
    return {
      categoryList: ['即時', '政經', '國際', '社會', '科技', '環境', '生活', '運動'],
      hotTags: ['台海危機', '美國大選', '振興三倍券', '新冠病毒', '美國豬牛', '黃鴻升'],
      newsList: [
        {
          title: '最新新聞',
          content: [
            { category: '政經', title: '王金平將率團到福建參加第12屆海峽論壇', viewCount: 32 },
            { category: '國際', title: '加州今年野火面積破紀錄逼近1/4個台灣', viewCount: 32 },
            { category: '政經', title: '川普新冠肺炎染疫事件經過', viewCount: 32 },
            { category: '政經', title: '王金平將率團到福建參加第12屆海峽論壇', viewCount: 32 },
            { category: '政經', title: '陽明交大徵合校首任校長教育部登報徵才', viewCount: 32 },
            { category: '政經', title: '川普夫婦確診新冠病毒 各國領袖表關心', viewCount: 32 }
          ]
        },
        {
          title: '熱門新聞',
          content: [
            { category: '政經', title: '王金平將率團到福建參加第12屆海峽論壇', viewCount: 32 },
            { category: '國際', title: '加州今年野火面積破紀錄逼近1/4個台灣', viewCount: 32 },
            { category: '政經', title: '川普新冠肺炎染疫事件經過', viewCount: 32 },
            { category: '政經', title: '王金平將率團到福建參加第12屆海峽論壇', viewCount: 32 },
            { category: '政經', title: '陽明交大徵合校首任校長教育部登報徵才', viewCount: 32 },
            { category: '政經', title: '川普夫婦確診新冠病毒 各國領袖表關心', viewCount: 32 }
          ]
        },
        {
          title: '推薦您的新聞',
          content: [
            { category: '政經', title: '王金平將率團到福建參加第12屆海峽論壇', viewCount: 32 },
            { category: '國際', title: '加州今年野火面積破紀錄逼近1/4個台灣', viewCount: 32 },
            { category: '政經', title: '川普新冠肺炎染疫事件經過', viewCount: 32 },
            { category: '政經', title: '王金平將率團到福建參加第12屆海峽論壇', viewCount: 32 },
            { category: '政經', title: '陽明交大徵合校首任校長教育部登報徵才', viewCount: 32 },
            { category: '政經', title: '川普夫婦確診新冠病毒 各國領袖表關心', viewCount: 32 }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/news.scss';

.sync-category-navbar {
  border-top: 1px solid $gray-900;
  border-bottom: 1px solid $gray-900;
  a {
    font-weight: bold;
    font-size: 1.5rem;
  }
}

.sync-hot-news-img {
  display: flex;
  align-items: center;
}

.sync-hot-tags {
  border-left: 1px solid $gray-500;
}

.tag-link {
  border-radius: 1.5rem;
  border: 1px solid $gray-900;
}

.category-title {
  color: $black;
  text-align: center;
  letter-spacing: 1rem;
  padding: 1.5rem;
}
</style>
