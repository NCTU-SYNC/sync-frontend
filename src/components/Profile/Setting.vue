<template>
  <b-container class="no-gutters pl-0 pr-0" fluid>
    <b-avatar size="9.375rem" class="mb-4" />
    <div class="section">
      <h4>顯示名稱</h4>
      <div class="text-box">
        <span class="m-0 flex-grow-1">{{ displayName }}</span>
        <span class="text-box-divider" />
        <b-button
          variant="white"
          size="lg"
          class="m-0 font-size-1"
        >更改</b-button>
      </div>
    </div>
    <div class="section pb-3">
      <h4>註冊信箱</h4>
      <div class="text-box bg-light">
        <span class="m-0 flex-grow-1">{{ email }}</span>
      </div>
    </div>
    <div class="section pt-5">
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
import { mapGetters } from 'vuex'

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
    ...mapGetters(['displayName']),
    ...mapGetters({ email: 'user/email' }),
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
  padding-top: 1rem;
  padding-bottom: 1rem;

  & * {
    margin-bottom: 1rem;
  }

  & *:last-child {
    margin-bottom: 0;
  }
}

.text-box {
  display: flex;
  border: 1px solid $gray-400;
  border-radius: 5px;
  width: 100%;
  height: 3rem;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;

  &-divider {
    height: 1.25rem;
    border-right: 1px solid $gray-400;
    box-sizing: content-box;
    padding: 0;
    margin: 0;
  }
}

// deprecated
.input-box {
  height: 3rem;
  box-sizing: content-box;

  &-divider {
    height: 1.25rem;
    border-right: 3px solid $gray-400;
    box-sizing: content-box;
    padding: 0;
    margin: 0;
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
