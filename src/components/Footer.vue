<template>
  <b-container class="border-top" fluid="xl">
    <b-row>
      <b-col cols="6" class="description px-5">
        一個新聞協作平台<b>「新聞版的維基百科：SYNC」</b>。<br>使離散的資訊透過眾人的力量匯集起來使多元<br>的觀點在同一件事被同步與整合。
      </b-col>
      <b-col cols="6">
        <b-row class="mt-5">
          <b-col
            v-for="(button, index) in buttons"
            :key="index"
            align-v="center"
          >
            <div class="footer-button">{{ button }}</div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col
            v-for="(button, index) in secondLineButtons"
            :key="index"
            align-v="center"
          >
            <div class="footer-button">{{ button }}</div>
          </b-col>
        </b-row>
        <b-row class="mt-4">
          <b-col
            v-for="icon in icons"
            :key="icon"
          >
            <img :src="getImgUrl(icon)">
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row align-h="center" class="mt-5 mb-3">Copyright © 2020 ＳＹＮＣ.</b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      buttons: ['關於我們', '常見問題', '訂閱電子報'],
      secondLineButtons: ['聯絡我們', '隱私政策', '加入編輯群'],
      icons: ['facebook-icon.svg', 'youtube-icon.svg', 'instagram-icon.svg', 'twitter-icon.svg']
    }
  },
  methods: {
    getImgUrl(icon) {
      return require('@/assets/images/' + icon)
    }
  }
}
</script>

<style scoped lang="scss">
.footer-button {
  font-size: 1.2em;
  font-family: 'Noto Sans CJK TC';
  color:#B3B3B3;
}
.description {
  margin-top: 100px;
  letter-spacing: 0.2em;
  line-height: 25px;
}
</style>
