<template>
  <b-container class="no-gutters pl-0 pr-0" fluid>
    <div id="avatar-container">
      <b-avatar size="9.375rem" :src="photoURL" class="mb-4" />
      <p id="avatar-upload-text">上傳</p>
    </div>
    <div class="section">
      <h4>顯示名稱</h4>
      <div class="d-flex">
        <div class="text-box">
          <span class="m-0 flex-grow-1">{{ displayName }}</span>
        </div>
        <div class="ml-3 rename-btn">
          <b-button
            id="rename-btn"
            v-b-modal.rename-modal
            variant="white"
            size="lg"
            class="m-0 font-size-1"
            :disabled="!nameChangable"
          >更改</b-button>
          <b-modal
            id="rename-modal"
            centered
            title="更改顯示名稱"
            title-class="font-weight-bold"
            header-class="rename-modal-header border-0"
            footer-class="border-0"
          >
            <b-container>
              <b-form>
                <b-form-group>
                  <template #description>
                    <p v-if="!nameChangable">
                      您已在這一個月內更改兩次顯示名稱
                    </p>
                    <p class="mt-3">
                      顯示名稱在一個月內僅可以更改兩次。<br>
                      且更改後，將會影響你過去所編輯過文章的名稱。
                    </p>
                  </template>
                  <b-form-input
                    id="input-username"
                    v-model="inputName"
                    size="lg"
                    required
                  />
                </b-form-group>
              </b-form>
            </b-container>
            <template #modal-footer="{ cancel }">
              <b-button
                class="rename-modal-btn"
                variant="white"
                type="button"
                @click="cancel()"
              >取消</b-button>
              <b-button
                id="btn-ok"
                class="rename-modal-btn"
                variant="white"
                type="submit"
                @click="confirm"
              >儲存</b-button>
            </template>
          </b-modal>
        </div>
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
        v-for="(preference, preferenceIndex) in preferences"
        :key="preferenceIndex"
        :preference="preference"
        class="setting-pref"
        @change="handleOnChange"
      />
    </div>
  </b-container>
</template>

<script>
import PreferenceItem from './PreferenceItem.vue'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

/* TODO: replace with API */
class Preference {
  constructor(title, description, name, status) {
    this.title = title
    this.description = description
    this.name = name
    this.status = status
  }

  value() {
    return [this.name, this.status]
  }
}

export default {
  components: {
    PreferenceItem
  },
  data() {
    return {
      inputName: '',
      preferences: [
        new Preference(
          '匿名發文',
          '開啟後您的新增段落與文章預設作者都將匿名',
          'isAnonymous',
          this.$store.state.user.preferences.isAnonymous
        ),
        new Preference(
          '編輯文章更新通知',
          '開啟後您曾編輯過的文章有任何更新都將通知您',
          'editedNotification',
          this.$store.state.user.preferences.editedNotification
        ),
        new Preference(
          '收藏文章更新通知',
          '開啟後您的收藏文章有任何更新都將通知您',
          'subscribedNotification',
          this.$store.state.user.preferences.subscribedNotification
        )
      ]
    }
  },
  computed: {
    ...mapGetters(['displayName', 'photoURL']),
    ...mapGetters({ email: 'user/email', nameModTime: 'user/nameModTime' }),
    nameChangable() {
      if (this.nameModTime.length < 2) return true
      const monthAgo = moment().subtract(1, 'months')
      return this.nameModTime.some((time) => moment(time).isBefore(monthAgo))
    }
  },
  methods: {
    ...mapActions({
      updateDisplayName: 'user/updateDisplayName',
      updatePreferences: 'user/updatePreferences'
    }),
    confirm() {
      if (this.nameChangable) {
        this.updateDisplayName(this.inputName)
      }
      this.$bvModal.hide('rename-modal')
    },
    handleOnChange() {
      const pref = Object.fromEntries(
        this.preferences.map((pref) => pref.value())
      )
      this.updatePreferences(pref)
    }
  }
}
</script>

<style scoped lang="scss">
.section {
  width: 32.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  & * {
    margin-bottom: 1rem;
  }

  & *:last-child {
    margin-bottom: 0;
  }
}

.rename-btn {
  width: 4rem;

  button {
    background: $blue;
    color: $white !important;
    border: 0;
  }
}

.text-box {
  display: flex;
  flex: 1;
  border: 1px solid $gray-400;
  border-radius: 5px;
  height: 2.5rem;
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

#rename-btn {
  font-size: 1rem;
  color: $blue;
}

/*
  Avatar
*/
#avatar-container {
  position: relative;
}
#avatar-upload-text {
  position: absolute;
  left: 59px;
  top: calc(50% - 24px);
  font-weight: 700;
  color: white;
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

/*
  Rename Modal
*/
.rename-modal-header > h5 {
  font-weight: 700 !important;
}

#input-username {
  border-color: $light !important;
  font-size: 1rem;
  height: 3rem;

  &:focus {
    border-color: $blue !important;
  }
}

.rename-modal-btn {
  width: 3.75rem;
  height: 2rem;
  padding: 0;
  font-size: 0.875rem;
}

#btn-ok {
  background-color: $blue;
  color: $white;
}
</style>
