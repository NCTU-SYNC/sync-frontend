<template>
  <b-container v-if="!lg" class="personal-status">
    <b-avatar size="5rem" :src="photoUrl" class="float-left" />
    <b-row align-v="stretch">
      <b-col class="personal-status-name">
        {{ displayName }}
      </b-col>
    </b-row>
    <b-row align-v="stretch" class="personal-status-text">
      <b-col class="text-gray">
        貢獻值
      </b-col>
      <b-col class="text-blue">
        {{ points }}
      </b-col>
    </b-row>
    <b-row align-v="stretch" class="personal-status-text">
      <b-col class="text-gray">
        加入日期
      </b-col>
      <b-col class="text-gray">
        {{ creationDateTime }}
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'PersonalStatus',
  props: {
    photoUrl: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    creationDateTime: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.personal-status {
  width: 280px;
  height: 5rem;

  &-name {
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 30px;
  }

  &-text {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    padding-right: 0;

    :first-child {
      width: 8rem;
    }

    :last-child {
      padding-left: 0;
    }
  }

  // align all texts to center
  & * {
    margin: auto 0;
  }

  .text-gray {
    color: rgba(0, 0, 0, 0.45);
  }

  .text-blue {
    color: #2353FF;
  }
}
</style>
