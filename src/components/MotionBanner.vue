<template>
  <div class="banner">
    <div class="banner-container">
      <div class="banner-container__textarea">
        <span class="banner-container__site-name">SYNC 新聞懶人包</span>
        <span class="banner-container__title">匯集資訊．同步協作</span>
        <span class="banner-container__subtitle">呈現多元觀點的事件脈絡<br>從眾人提供的整合資訊中汲取所需</span>
      </div>

      <sync-button pill size="lg" variant="primary" class="banner-container__login-btn">立即登入</sync-button>
    </div>
  </div>
</template>

<script>
import SyncButton from './SyncButton.vue'

export default {
  name: 'MotionBanner',
  components: [SyncButton]
}
</script>

<style lang="scss" scoped>
.banner {
  width: 100vw;
  background-color: white;
}

.banner-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 5.125rem 0;
  background-image: url('../assets/images/motion-banner.svg');
  background-repeat: no-repeat;
  background-position-x: right;

  @media screen and (max-width: 1239px) {
    padding: 2.625rem 0 2.625rem 4rem;
  }

  @media screen and (max-width: 679px) {
    padding: 2.5rem 0 2.5rem 1.25rem;
    background-image: url('../assets/images/motion-banner-sm.svg');
    background-position-y: bottom;
  }

  &__textarea {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  &__site-name {
    color: $blue-4;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 2px;
  }

  &__title {
    color: $text-2;
    font-size: 2rem;
    font-weight: 700;
    line-height: 3rem;
    letter-spacing: 2px;
  }

  &__subtitle {
    color: $text-2;
    font-size: 1.25rem;
    line-height: 1.85rem;
    letter-spacing: 2px;
  }

  &__login-btn {
    margin-top: 1.5rem;
    font-size: 1rem;
    height: 3rem;
    padding: 0.5rem 2rem;
  }
}
</style>
