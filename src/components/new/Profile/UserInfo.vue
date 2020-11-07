<template>
  <b-container>
    <b-row align-h="center">
      <div class="text-center avatar">
        <img
          src="@/assets/images/EditIcon.svg"
          class="edit-icon"
        >
      </div>
    </b-row>
    <b-row
      align-h="center"
      class="user-name mt-3"
    >
      郭柴⿂
    </b-row>
    <b-row align-h="center">
      ＠micky55212
    </b-row>
    <b-row
      align-h="center"
      class="mt-4"
    >
      <b-col cols="4">
        <b-row
          class="title"
          align-h="center"
        >
          貢獻值
        </b-row>
        <b-row align-h="center">
          <b-col cols="3">
            <img src="@/assets/images/Coin.svg">
          </b-col>
          <b-col
            class="coin-value"
            cols="3"
          >
            1
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="4">
        <b-row
          class="title"
          align-h="center"
        >
          連線紀念日
        </b-row>
        <b-row
          class="start-time"
          align-h="center"
        >
          2020年10⽉19⽇
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'UserInfo',
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
.avatar {
  border-radius: 50%;
  height: 96px;
  width: 96px;
  background: $gray-500;
  .edit-icon {
    position: relative;
    top: calc(96px - 30px);
    right: -30px;
  }
}
.user-name {
  font-family: 'Noto Sans CJK TC';
  font-size: 26px;
  font-weight: medium;
}
.title {
  font-family: 'Noto Sans CJK TC';
  font-size: 18px;
  .coin {
    font-weight: bold;
  }
}
.start-time {
    font-size: 14px;
    color: $gray-500;
}
</style>
