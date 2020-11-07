<template>
  <b-container class="">
    <b-container>
      <b-row
        v-for="(option, index) in options"
        :key="index"
        class="pr-5 option"
        :class="{active: activeIndex === index}"
        align-v="center"
        align-h="end"
        @click="handleClick(index)"
      >
        {{ option }}
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
export default {
  name: 'ButtonStack',
  data () {
    return {
      options: ['我編輯過的⽂章', '我追蹤的⽂章', '我關⼼的主題', '多元訊息'],
      activeIndex: 0
    }
  },
  methods: {
    handleClick (index) {
      this.activeIndex = index
    }
  }
}
</script>

<style scoped lang="scss">
.option {
  font-family: 'Noto Sans CJK TC';
  font-weight: medium;
  font-size: 21px;
  letter-spacing: 2px;
  cursor: pointer;
  height: 89px;
  color: $gray-500;
}
.active {
  border-right: 5px solid $gray-300;
  color: $gray-900;
}
</style>
