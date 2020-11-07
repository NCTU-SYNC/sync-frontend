<template>
  <b-container class="cell-container border border-secondary mt-5">
    <b-row class="mt-3 mx-2">
      <div class="title">
        {{ title }}
      </div>
    </b-row>
    <b-row class="mt-3 mx-2 pb-2 d-flex justify-content-between border-bottom border-bottom-secondary">
      <div class="d-flex">
        <img src="@/assets/images/ModifiedTimeIcon.svg">
        <div class="modified-info">
          最後更新時間 {{ lastModifiedTime }}
        </div>
      </div>
      <div class="d-flex">
        <img src="@/assets/images/EditorsIcon.svg">
        <div class="modified-info">
          {{ editorsCount }} 位編輯者
        </div>
      </div>
    </b-row>
    <b-row />
    <b-row class="mx-2 mb-2 pt-2">
      <div class="d-flex">
        <b-button
          v-for="(tag, index) in tags"
          :key="index"
          class="mr-4"
          variant="outline-secondary"
          pill
        >
          # {{ tag }}
        </b-button>
      </div>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'ArticleCell',
  props: {
    title: { type: String, default: '' },
    lastModifiedTime: { type: String, default: '' },
    editorsCount: { type: Number, default: 0 },
    tags: { type: Array, default: () => [] }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
.cell-container {
  width: 70%;
}

.title {
  font-family: 'Noto Sans CJK TC';
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 3px;
}

.modified-info {
  font-size: 14px;
  font-weight: medium;
  margin-left: 7.7px;
}
</style>
