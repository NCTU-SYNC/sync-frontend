<template>
  <b-container class="no-gutters pl-0 pr-0" fluid>
    <b-avatar size="9.375rem" class="mb-4" />
    <div class="section">
      <h4>顯示名稱</h4>
      <b-input-group
        size="lg"
        class="input-box w-100 align-items-center border rounded"
      >
        <b-form-input class="border-0 h-50" />
        <b-input-group-append class="align-items-center">
          <span class="input-box-divider m-0 p-0" />
          <b-button
            class="mb-0 font-weight-500 text-decoration-none"
            variant="link"
          >更改</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
    <div class="section">
      <h4>註冊信箱</h4>
      <b-input-group size="lg" class="input-box w-100">
        <b-form-input disabled />
      </b-input-group>
    </div>
    <div class="section mt-4">
      <h4>偏好設定</h4>
      <PreferenceItem
        v-for="preference in mockPreference"
        :key="preference"
        class="setting-pref"
        :preference="preference"
      />
    </div>
  </b-container>
</template>

<script>
import PreferenceItem from './PreferenceItem.vue'

/* TODO: replace with API */
class Preference {
  constructor(title, description, status) {
    this.title = title
    this.description = description
    this.status = status
  }
}

export default {
  components: {
    PreferenceItem
  },
  computed: {
    mockPreference() {
      return [
        new Preference(
          '匿名發文',
          '開啟後您的新增段落與文章預設作者都將匿名',
          false
        ),
        new Preference(
          '編輯文章更新通知',
          '開啟後您曾編輯過的文章有任何更新都將通知您',
          false
        ),
        new Preference(
          '收藏文章更新通知',
          '開啟後您的收藏文章有任何更新都將通知您',
          false
        )
      ]
    }
  }
}
</script>

<style scoped lang="scss">
// TODO: positioning
.section {
  & * {
    margin-bottom: 1rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.input-box {
  height: 3rem;
  box-sizing: content-box;

  &-divider {
    height: 1.25rem;
    border-right: 3.5px solid $gray-400;
    box-sizing: content-box;
  }
}

/*
  Preferences
*/
.setting-pref {
  border-bottom: 1px solid $gray-400;

  &:last-of-type {
    border-bottom: 0;
  }
}
</style>
