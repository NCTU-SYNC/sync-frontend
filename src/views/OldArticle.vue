<template>
  <b-container>
    <b-row>
      <b-col sm="auto" class="mr-auto p-3">
        <b-button pill variant="outline-secondary" @click="$router.back()">回上一頁</b-button>
      </b-col>
      <b-col sm="6" />
      <b-col sm="auto" class="p-3">
        <b-button
          pill
          class="primary-color"
          :to="`${$route.path}/Post`"
        >編輯新聞</b-button>
      </b-col>
    </b-row>
    <hr>
    <h1>紙媒只是起點</h1>
    <b-link>#台灣</b-link> <b-link>#口罩</b-link> <b-link>#WHO</b-link>
    <p>發布日期 2020/4/16</p>
    <b-img src="https://picsum.photos/300/150/?image=41" fluid-grow alt="Fluid-grow image" />
    <p>四月八日，WHO 秘書長譚德塞於正式場合，公開針對台灣發表長達三分鐘的不實發言，此事件引起台灣民眾高度關注。發起團隊決定
      透過嘖嘖群眾集資平台，集資刊登紐約時報廣告，希望透過大眾的支持，以贊助者共同名義，向世界發出一個訊息： “Who can help?
      Taiwan.”
      在不到一天的集資期間內，集資專案獲得 26,980 人的贊助支持，平均每二秒有一人投入支持。在嘖嘖集資平台與貝殼集器的計畫專
      頁，集資啟動至今累積超過兩百萬人次的瀏覽，充分顯示台灣人對於公眾事務的參與熱情。刊登於紐時的廣告文案，先經過所有關注
      者的投票選擇版本與提供建議後，也經過深諳國際關係和外交事務的專業人士細修推敲。</p>
    <b-row>
      <div class="last-update">(最後更新時間：2020年4月19日 14:00)</div></b-row>
    <hr>
    <h2>2020.04.10</h2>
    <h1>Taiwan can help</h1>
    <p>四月八日，WHO 秘書長譚德塞於正式場合，公開針對台灣發表長達三分鐘的不實發言，此事件引起台灣民眾高度關注。發起團隊決定
      透過嘖嘖群眾集資平台，集資刊登紐約時報廣告，希望透過大眾的支持，以贊助者共同名義，向世界發出一個訊息： “Who can help?
      Taiwan.”
      在不到一天的集資期間內，集資專案獲得 26,980 人的贊助支持，平均每二秒有一人投入支持。在嘖嘖集資平台與貝殼集器的計畫專
      頁，集資啟動至今累積超過兩百萬人次的瀏覽，充分顯示台灣人對於公眾事務的參與熱情。刊登於紐時的廣告文案，先經過所有關注
      者的投票選擇版本與提供建議後，也經過深諳國際關係和外交事務的專業人士細修推敲。</p>
    <ul>
      <li><b-link class="reference">[1]132</b-link></li>
      <li><b-link class="reference">[2]132</b-link></li>
    </ul>
  </b-container>
</template>

<script>

export default {
  name: 'OldArticle',
  data() {
    return {

    }
  },
  created() {

  }
}
</script>

<style scoped>
  .primary-color {
    background-color: #FF7865;
  }
  .reference {
    color: gray;
    text-decoration-line: underline;
  }
  ul {
    padding-inline-start: 0;
    list-style: none;
  }
  p {
    padding: 2em 0;
  }
  h2 {
    color: #FF7865;
  }
  hr {
    padding-bottom: 2em;
  }
  .last-update {
    margin: auto;
    color: gray;
  }
</style>
