<template>
  <div class="footer d-flex justify-content-start justify-content-sm-around align-items-center flex-column pt-5 pt-md-5">
    <!-- main content -->
    <div class="d-flex justify-content-around justify-content-lg-between w-100 flex-wrap" style="max-width: 1024px">
      <!--left -->
      <div class="left mx-4 mx-lg-2 my-3 d-flex flex-column">
        <div class="title pb-2 text-center text-md-left">ＳＹＮＣ</div>
        <div class="description text-center text-md-left mt-2 mb">一個新聞協作平台『<b>新聞版的維基百科：SYNC</b>』。
          藉此平台使離散的資訊透過眾人的力量匯集起來使多元的觀點在同一件事被同步與整合。</div>
      </div>
      <!--right -->
      <div class="right mx-4 mx-lg-2 my-3">
        <div class="icons pb-2 d-flex justify-content-center justify-content-md-start">
          <!-- <img src="@/assets/images/facebook-icon.svg" class="mx-2 mx-md-0 mr-md-3">
          <img src="@/assets/images/twitter-icon.svg" class="mx-2 mx-md-0 mr-md-3">
          <img src="@/assets/images/instagram-icon.svg" class="mx-2 mx-md-0 mr-md-3">
          <img src="@/assets/images/youtube-icon.svg" class="mx-2 mx-md-0 mr-md-3"> -->
          <SyncIcon icon="facebook" class="mx-2 mx-md-0 mr-md-3" />
          <SyncIcon icon="twitter" class="mx-2 mx-md-0 mr-md-3" />
          <SyncIcon icon="instagram" class="mx-2 mx-md-0 mr-md-3" />
          <SyncIcon icon="youtube" class="mx-2 mx-md-0 mr-md-3" />
        </div>
        <div class="d-flex justify-content-between mt-3">
          <div>
            <div v-for="(button) in buttons" :key="button" class="footer-button mb-3">
              {{ button }}
            </div>
          </div>
          <div>
            <div v-for="(button) in secondColumnButtons" :key="button" class="footer-button mb-3 text-right text-md-left">
              {{ button }}
            </div>
          </div>
        </div>
      </div>
    <!--footer -->
    </div>
    <div class="copyright pt-5 py-sm-3">
      Copyright © 2020 ＳＹＮＣ.
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
  height: 600px;
}
.footer-button {
  font-size: 20px;
  font-family: 'Noto Sans CJK TC';
  color:#B3B3B3;
  letter-spacing: 6px;
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
  margin-left: -4px;
  margin-top: -2px;
}
.right{
  min-width: 272px;
  max-height: 173px;
}
.copyright{
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 1px;
  text-align: center;
  color: $blue;
}
@media only screen and (min-width: 576px) {
  .description {
    max-height: 96px;
  }
}

@media only screen and (min-width: 990px) {
  .footer {
    height: 421px;
  }
}
</style>
