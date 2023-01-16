<template>
  <div class="footer">
    <div class="sync-info">
      <div class="title text-left">ＳＹＮＣ</div>
      <div class="description text-left">一個新聞協作平台『新聞版的維基百科：SYNC』。<br>
        藉此平台使離散的資訊透過眾人的力量匯集起來使多元的觀點在同一件事被同步與整合。</div>
    </div>
    <div class="copyright">
      Copyright © 2022 ＳＹＮＣ.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      buttons: ['常見問題', '隱私政策', '關於我們'],
      secondColumnButtons: ['訂閱電子報', '加入編輯群', '聯絡我們'],
      icons: ['facebook-icon.svg', 'youtube-icon.svg', 'instagram-icon.svg', 'twitter-icon.svg']
    }
  }
}
</script>

<style scoped lang="scss">
.footer{
  background-color: #F9F9F9;
  height: 400px;
  padding-left: 64px;
  padding-right: 64px;
  padding-top: 80px;
  padding-bottom: 72px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.description {
  font-size: 16px;
  font-family: 'Noto Sans CJK TC';
  letter-spacing: 0.2em;
  line-height: 32px;
  max-width: 466px;
  letter-spacing: 4px;
}
.title{
  font-weight: bold;
  font-size: 28px;
  letter-spacing: 2px;
  margin-bottom: 32px;
}

.copyright{
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 1px;
  text-align: center;
  color: $blue;
}

.sync-info {
  width: 1240px;
  margin-left: auto;
  margin-right: auto;
  // fix info width at 1240px
  @media screen and (max-width: 1368px ) {
    margin-left: 0;
    margin-right: 0;
    width: auto;
  }
}

@media only screen and (max-width: 679px) {
  .footer {
    padding-top: 48px;
    padding-bottom: 48px;
    padding-left: 20px;
    padding-right: 20px;
    height: 395px;
  }
  .title {
    margin-bottom: 20px;
  }
}

</style>
