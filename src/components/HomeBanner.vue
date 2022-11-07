<template>
  <div>
    <h1 class="home-focus">焦點內容</h1>
    <div class="home-banner">
      <div class="headline">
        <div class="headline-info d-flex">
          <div class="headline-image">
            <div class="img-container d-flex flex-column">
              <img
                src="../assets/images/thumbnail-placeholder.svg"
                alt=""
              >
              <div class="paragraph">此篇內容的 {{ blocks.length }} 個段落</div>
            </div>
          </div>
          <div class="headline-content d-flex flex-column">
            <div class="headline-title">
              <div class="article-category">焦點</div>
              <div class="headline-heading">
                {{ title }}
              </div>
              <div class="headline-tags">
                <span
                  v-for="(tag, tagIndex) in tags"
                  :key="tagIndex"
                  class="hashtag"
                ># {{ tag }}</span>
              </div>
            </div>
            <div
              id="news-text"
              ref="newsText"
              class="news-text"
            >
              <div class="swiper-wrapper swiper-no-swiping">
                <div
                  v-for="(block, blockIndex) in blocks"
                  :key="blockIndex"
                  class="swiper-slide text-left d-flex flex-column justify-content-start align-items-start"
                >
                  <p class="date">{{ getDateTime(block.blockDateTime) }}</p>
                  <p class="block-title">
                    {{ block.blockTitle }}
                  </p>
                  <p class="block-content">
                    {{ getArticleContent(blocks, 90) }}
                  </p>
                </div>
              </div>
              <a
                class="readmore"
                href="#"
              > 閱讀全文 > </a>
            </div>
          </div>
        </div>
        <div
          id="timeline"
          ref="timeline"
          class="timeline swiper"
        >
          <div
            id="swiper-wrapper"
            class="swiper-wrapper"
          >
            <div
              v-for="(block, blockIndex) in blocks"
              :key="blockIndex"
              class="swiper-slide d-flex flex-column text-left justify-content-start align-items-start"
            >
              <p class="date">{{ getDateTime(block.blockDateTime) }}</p>
              <p class="block-title">
                {{ block.blockTitle }}
              </p>
            </div>
          </div>
          <!-- <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div> -->
          <div class="swiper-btn-box swiper-box-next">
            <div class="swiper-button-next swiper-btn" />
          </div>
          <div class="swiper-btn-box swiper-box-prev">
            <div class="swiper-button-prev swiper-btn" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import $ from 'jquery'
import Swiper, { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/swiper-bundle.css'
import 'swiper/modules/navigation/navigation.min.css'
import 'swiper/modules/pagination/pagination.min.css'
import moment from 'moment'
import { Utils } from '@/utils'

export default {
  props: {
    title: {
      type: String,
      default: 'WHO：國際專家下月赴中國 調查COVID-19疫情源頭'
    },
    tags: {
      type: Array,
      default: null
    },
    lastUpdatedAt: {
      type: String,
      default: '2021.04.26'
    },
    blocks: {
      type: Array,
      default: null
    },
    newsId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    imgLink() {
      const imgLink = this.getArticleFirstImage(this.blocks)
      return imgLink !== null ? imgLink : this.thumbnailPlaceholder
    }
  },
  methods: {
    getArticleContent: Utils.getArticleContent,
    getArticleFirstImage: Utils.getArticleFirstImage,
    getCategory(newsCategory) {
      if (typeof newsCategory === 'string') {
        if (newsCategory.length === 0) { return '未分類' } else return newsCategory
      } else return '未分類'
    },
    getDateTime(lastUpdatedAt) {
      const datetime = moment(lastUpdatedAt)
      if (datetime.isValid()) {
        return datetime.format('MM/DD HH:mm')
      }
      return ''
    }
  },
  mounted() {
    const timeline = $('#timeline')
    const length = $('#timeline .swiper-slide').length
    const slidePerPage = 5
    let targetIndex = 0
    let slideIndex = 0
    let navIndex = 0
    var newsTextSwiper = new Swiper(this.$refs.newsText, {
      modules: [Autoplay],
      slidesPerView: 1,
      spaceBetween: 0,
      noSwiping: true,
      noSwipingClass: 'swiper-slide',
      autoplay: {
        delay: 3000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false
      },
      on: {
        autoplay: function() {
          slideIndex = this.activeIndex
          targetIndex = slideIndex
          if (targetIndex === 0) {
            for (let i = 1; i < length / slidePerPage; i++) {
              timelineSwiper.slidePrev()
            }
          } else if (
            targetIndex % 5 === 0 ||
            length - targetIndex <= slidePerPage
          ) {
            timelineSwiper.slideNext()
          }
          renderCurrent(targetIndex)
        }
      }
    })
    var timelineSwiper = new Swiper(this.$refs.timeline, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: slidePerPage,
      slidesPerGroup: slidePerPage,
      spaceBetween: 0,
      on: {
        init: function() {
          timeline.find('.swiper-slide').eq(0).addClass('current')
        },
        click: function() {
          slideIndex = this.clickedIndex
          targetIndex = slideIndex
          renderCurrent(targetIndex)
          newsTextSwipe(targetIndex)
        }
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    })
    timeline.mouseover(function() {
      newsTextSwiper.autoplay.stop()
    })
    timeline.mouseout(function() {
      newsTextSwiper.autoplay.start()
    })
    $('.swiper-btn').on('click', function() {
      navIndex = $('#timeline .swiper-slide-active').index()
      targetIndex =
        navIndex > targetIndex
          ? navIndex
          : targetIndex - navIndex >= slidePerPage
            ? navIndex
            : targetIndex

      renderCurrent(targetIndex)
      newsTextSwipe(targetIndex)
    })
    function renderCurrent(index) {
      timeline
        .find('.swiper-slide')
        .removeClass('current')
        .eq(index)
        .addClass('current')
    }
    function newsTextSwipe(index) {
      newsTextSwiper.slideTo(index, 500, false)
      newsTextSwiper.autoplay.start()
    }
  }
}
</script>
  <style>
*,
p {
  font-family: 'Noto Sans TC', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 16px;
  line-height: 24px;
}
a:hover {
  text-decoration: none;
}
body {
  background: #fafafa;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

.home-focus {
    font-size: 32px;
    font-weight: 700;
    margin-top: 40px;
}
.home-banner {
  margin: 30px auto;
  width: 1240px;
  height: 578px;
  /* border: 2px solid black; */
  background-color: #fff;
  box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  overflow: hidden;
}

.swiper {
  width: 100%;
}
.headline {
  position: relative;
}
.headline-info {
  height: 430px;
  padding: 24px 24px 0 24px;
  text-align: left;
}

/* left */
.headline-image {
  width: 56%;
  height: 100%;
}
.headline-image img {
  max-width: 640px;
  max-height: 360px;
  margin-bottom: 24px;
}
.headline .paragraph {
  font-size: 14px;
  color: #282829;
  padding-left: 5px;
}
/* right */
.headline-content {
  width: 44%;
}
.headline-title {
  height: 45%;
}
.headline-title .article-category {
  font-size: 14px;
  margin-bottom: 6px;
}
.headline-title .headline-heading {
  font-size: 32px;
  font-weight: 700;
  line-height: 48px;
  margin-bottom: 15px;
}
.headline-title .hashtag {
  display: inline-block;
  font-size: 12px;
  height: 24px;
  padding: 0 10px;
  margin-right: 7px;
  line-height: 24px;
  border-radius: 12px;
  background-color: #e0e0e0;
  color: rgba(0, 0, 0, 0.85);
}
.news-text {
  height: 56%;
  overflow: hidden;
  position: relative;
}

.news-text::after {
  content: '';
  width: 4px;
  height: 140px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(35, 83, 255, 1);
  border-radius: 2px;
}
.news-text .swiper-slide {
  padding: 0 0 0 17px;
}
.news-text .date {
  font-weight: 700;
  margin-bottom: 5px;
  color: rgba(0, 0, 0, 0.85);
}
.news-text .block-title {
  font-weight: 500;
  margin-bottom: 15px;
  color: #262626;
}
.news-text .block-content {
  color: #595959;
}
.news-text .readmore {
  display: block;
  position: absolute;
  bottom: 45px;
  right: 0;
  z-index: 1;
  font-weight: 700;
  font-size: 14px;
  color: #2353ff;
}

/* timeline */
.timeline .swiper-slide:hover {
  cursor: pointer;
}

.timeline {
  height: 148px;
  overflow: hidden;
  position: relative;
  padding: 2px 24px 24px;
}

.timeline .swiper-slide::before {
  content: '';
  width: 86%;
  height: 4px;
  position: absolute;
  top: 20px;
  left: 25px;
  background: #ebefff;
  border-radius: 2px;
}
.timeline .swiper-slide::after {
  content: '';
  width: 16px;
  height: 16px;
  position: absolute;
  top: 20px;
  left: 0;
  background-color: #ebefff;
  border-radius: 50%;
  transform: translateY(-50%);
}
.timeline .swiper-slide:hover::after {
  background-color: #b8c7ff;
}
.timeline .swiper-slide.current:after {
  width: 18px;
  height: 18px;
  border: 4px solid #b8c7ff;
  background-color: #2353ff;
}

.timeline .date {
  color: #2353ff;
  font-size: 14px;
  margin-top: 45px;
  margin-bottom: 5px;
}
.timeline .block-title {
  color: #595959;
  font-size: 14px;
  padding-right: 30px;
  line-height: 24px;
}
.timeline .swiper-slide:hover .block-title {
  font-weight: 700;
}

.timeline .current p {
  font-weight: 700;
}
.timeline .swiper-slide:last-child::before {
  width: 0;
  height: 0;
}

.headline .paragraph {
  font-size: 14px;
  color: #282829;
  padding-left: 5px;
}

/* swiper-button  */
.swiper-btn-box {
  width: 80px;
  height: 108px;
  position: absolute;
  bottom: 26px;
  z-index: 99;
}

.swiper-box-prev {
  left: 0;
}
.swiper-box-next {
  right: 0;
}
.swiper-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  display: none;
}
div.swiper-button-prev {
  left: 24px;
  /* bottom: 26px; */
}
div.swiper-button-next {
  right: 24px;
}
.swiper-btn-box:hover .swiper-btn {
  display: flex;
}

.swiper-button-prev:after,
.swiper-button-next:after {
  color: white;
  font-size: 20px;
}
</style>

