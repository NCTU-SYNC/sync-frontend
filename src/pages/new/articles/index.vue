<template>
  <b-container fluid="xl">
    <b-row>
      <b-col cols="2">
        <div class="sync-blank-container d-flex flex-column pr-3">
          <div class="sync-timeline">
            <div class="sync-timeline-title" />
          </div>
          <div class="sync-timeline">
            <div class="sync-timeline-time">
              2020.10.02
            </div>
            <div class="sync-timeline-title">
              <p>川普染疫確診川普染疫確診</p>
            </div>
          </div>
          <div class="sync-timeline">
            <div class="sync-timeline-time">
              2020.10.02
            </div>
            <div class="sync-timeline-title">
              <p>川普染疫確診</p>
            </div>
          </div>
          <div class="sync-timeline">
            <div class="sync-timeline-time">
              2020.10.02
            </div>
            <div class="sync-timeline-title">
              <p>川普染疫確診</p>
            </div>
          </div>
          <div class="sync-timeline">
            <div class="sync-timeline-time">
              2020.10.02
            </div>
            <div class="sync-timeline-title pl-2 pt-2">
              <p>川普染疫確診</p>
            </div>
          </div>
        </div>
      </b-col>
      <b-col cols="8">
        <b-row>
          <b-col>
            <p>[2020 美國總統大選] 這邊不知道是要填什麼資料</p>
            <h2>
              川普新冠肺炎染疫事件經過
            </h2>
            <hr class="my-2">
            <div class="text-center text-secondary">
              <b-icon icon="clock" />
              最後更新時間 10/14  17:35
            </div>
            <div class="d-flex justify-content-between py-3">
              <div>
                <b-button
                  v-for="(tag, tagIndex) in news.tags"
                  :key="tagIndex"
                  variant="outline-primary"
                  :class="['m-1', 'flex-shrink-0', 'shadow-sm']"
                  pill
                >
                  {{ tag }}
                </b-button>
              </div>
              <div class="d-flex flex-grow-1 justify-content-end">
                <b-button
                  variant="outline-primary"
                  class="shadow-sm btn-icon mx-2 mt-1"
                >
                  <b-icon icon="pencil-square" />
                </b-button>
                <b-button
                  variant="outline-primary"
                  class="shadow-sm btn-icon mx-2 mt-1"
                >
                  <b-icon icon="clock-history" />
                </b-button>
                <b-button
                  variant="outline-primary"
                  class="shadow-sm btn-icon ml-2 mt-1"
                >
                  <b-icon icon="bookmark" />
                </b-button>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row class="py-3">
          <b-col>
            <div class="d-flex justify-content-between">
              <h3 class="text-primary">
                川普染疫確診
              </h3>
              <b-link class="text-gray">
                2020.10.22
              </b-link>
            </div>
            <p>
              川普防疫作為成為這次美國大選核心話題，川普自己從態度輕忽，說新冠肺炎不過就像普通流行性感冒一樣，不需要緊張，到胡亂開藥方，包括宣稱注射漂白水等等離譜的言論，一直到新冠肺炎嚴重性遠超出他的認知，再改口自己防疫得當，否則美國死會更多的人。 紐約時報二日報導，在美國始於新冠肺炎的人突破了20萬人達到207,000人之際，美國總統川普自己也染上了新冠肺炎，檢測確診。
            </p>
            <p>
              『川普在推特上宣布，不只他，包括他的夫人，也都檢測確診染上新冠肺炎，展開自我隔離。』 川普的確診，正讓美國的國家最高權力領導出現不確定性，再加上川普上週在總統大選辯論時，不承諾他如果敗選，會和平交出政權，更讓美國在選舉即將到來之際，政局充滿了變數。
            </p>
          </b-col>
        </b-row>
        <b-row class="py-3">
          <b-col>
            <div class="d-flex justify-content-between">
              <h3 class="text-primary">
                川普用藥治療
              </h3>
              <b-link class="text-gray">
                2020.10.22
              </b-link>
            </div>
            <p>
              10/2 晚一架直昇機停在白宮草坪，川普被目擊戴著藍色口罩走出白宮步上飛機。被白宫接近川普的人士向《紐約時報》透露，川普有些發燒、呼吸不順和咳嗽，才留在白宮一天，醫療團隊就決定將他送到律德軍醫院（Walter Reed）接受治療，而且已經讓他服用一種實驗性的藥物。根據川普的醫生康利（Sean P.Conley）所做的記錄，川普已經服用一種抗體雞尾酒藥物，這是由生技公司Regeneron研發的療法，川普同時也服用維他命D、鋅、褪黑激素、阿斯匹林和一種制酸藥物法莫替丁（英文：famotidine,又名Pepcid）。
            </p>
            <p>
              康利的記錄指出，這種雞尾酒藥物療法的人體實驗還處於初步階段，但初步證明能夠降低人體內的病毒含量。 醫生的紀錄顯示，川普並沒有服用他今年稍早聲稱的「神藥」羥氯奎寧（英文： Hydroxychloroquine）或氯奎寧（英文：Chloroquine）。但這兩項藥後隨後被美國食暨藥物管理局（FDA）撤銷緊急使用權，指出這兩種在治療新冠肺炎上可能無效，還有安全上的疑慮。
            </p>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="2">
        <div class="sync-blank-container" />
        <div class="sync-time-container py-2">
          <p>{{ time.year() }}</p>
          <span
            id="month"
            class="mb-2"
          >{{ time.month() + 1 }} 月</span>
          <span
            id="date"
            class="mb-2"
          >{{ time.date() }} 日</span>
          <p class="mt-4 mb-0">
            {{ time.format('hh:mm a') }}
          </p>
        </div>
        <div class="sync-authors-container py-2">
          <p class="mb-1">
            編輯者：
          </p>
          <b-link>吳先生</b-link>, <b-link>吳先生</b-link>, <b-link>吳先生</b-link>, <b-link>吳先生</b-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Article',
  data () {
    return {
      tagName: '美國總統大選',
      order: 'time',
      news: { category: '國際', title: '美國總統大選漸落幕，但你知道拜登的「離岸懲罰稅」是什麼嗎？', viewCount: 32, tags: ['美國總統大選', '拜登', '離岸懲罰稅', '智慧製造', '美國', '美國製造業'] },
      timeId: null,
      time: moment()
    }
  },
  computed: {
    getYear () {
      return this.time.getFullYear()
    },
    getMonth () {
      return this.time.getMonth()
    }
  },
  created () {
    this.timeId = setInterval(() => {
      this.time = moment()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeId)
    this.time = null
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/news.scss';

p {
  letter-spacing: 0.25rem;
}

.btn-icon {
  height: 3rem !important;
  width: 3rem !important;
  padding-top: 0.25rem;
  border-radius: 0.75rem;
}

.sync-blank-container {
  padding-top: 9rem;
}

.sync-timeline {
  .sync-timeline-time {
    width: 8rem;
    border: 1px solid $secondary;
    color: $secondary;
    text-align: center;
  }
  .sync-timeline-title {
    flex-grow: 1;
    margin-left: 1rem;
    padding: 0.5rem 0rem 0rem 0.5rem;
    border-left: 1px solid $black;
    min-width: 100%;
    height: 100%;
    min-height: 3rem;
  }
  display: flex;
  flex-direction: column;
  min-width: 100%;
  min-height: 3rem;
}

.sync-time-container {
  padding-top: 9rem;
  border-top: 1px solid $black;
  border-bottom: 1px solid $black;
}

.sync-authors-container {
  border-bottom: 1px solid $black;
}

#month {
  font-size: 2rem;
}

#date {
  font-size: 1.5rem;
}
</style>
