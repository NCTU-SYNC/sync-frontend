<template>
  <b-container class="no-gutters pl-0 pr-0" fluid>
    <div id="avatar-container">
      <b-avatar size="9.375rem" :src="photoURL" class="mb-4" />
      <p id="avatar-upload-text">上傳</p>
    </div>
    <div class="section">
      <h4>顯示名稱</h4>
      <div class="d-flex" style="gap: 1rem;">
        <div class="text-box flex-fill">
          {{ displayName }}
        </div>
        <b-button
          id="rename-btn"
          v-b-modal.rename-modal
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
                  <p class="mt-3">
                    顯示名稱在30天內僅可以更改兩次。<br>
                    且更改後，將會影響你過去所編輯過文章的名稱。
                  </p>
                </template>
                <b-form-input id="input-username" v-model="newName" size="lg" required />
              </b-form-group>
            </b-form>
          </b-container>
          <template #modal-footer="{ ok, cancel }">
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
              @click="ok(); rename(newName)"
            >儲存</b-button>
          </template>
        </b-modal>
      </div>
    </div>
    <div class="section pb-3">
      <h4>註冊信箱</h4>
      <div class="text-box bg-light">
        {{ email }}
      </div>
    </div>
    <div class="section pt-5">
      <h4>偏好設定</h4>
      <PreferenceItem
        v-for="(pref, idx) in mockPreference"
        :key="idx"
        class="setting-pref"
        :status="pref.status"
        :option="pref.option"
        :title="pref.title"
        :description="pref.description"
        @changeStatus="changeStatus"
      />
    </div>
  </b-container>
</template>

<script>
import PreferenceItem from './PreferenceItem.vue'
import UserAPI from '@/api/user'
import { mapGetters, mapMutations } from 'vuex'

export class Preference {
  constructor(option, title, description, status) {
    this.option = option
    this.title = title
    this.description = description
    this.status = status
  }
}

export default {
  components: {
    PreferenceItem
  },
  data() {
    return {
      newName: '',
      preference: {
        isAnonymous: false,
        editedNotification: false,
        subscribedNotification: false }
    }
  },
  computed: {
    ...mapGetters(['displayName', 'photoURL']),
    ...mapGetters({ email: 'user/email' }),
    mockPreference() {
      return [
        new Preference(
          'isAnonymous',
          '匿名發文',
          '開啟後您的新增段落與文章預設作者都將匿名',
          this.preference.isAnonymous
        ),
        new Preference(
          'editedNotification',
          '編輯文章更新通知',
          '開啟後您曾編輯過的文章有任何更新都將通知您',
          this.preference.editedNotification
        ),
        new Preference(
          'subscribedNotification',
          '收藏文章更新通知',
          '開啟後您的收藏文章有任何更新都將通知您',
          this.preference.subscribedNotification
        )
      ]
    }
  },
  async mounted() {
    await this.fetchStatus()
  },
  methods: {
    ...mapMutations({ updateDisplayName: 'user/UPDATE_DISPLAY_NAME' }),
    async fetchStatus() {
      try {
        const { data } = await UserAPI.getPreference()
        if (data.code === 200) {
          this.preference = data.data
        } else {
          throw new Error(data.message)
        }
      } catch (e) {
        console.error(e)
        this.preference = {
          isAnonymous: false,
          editedNotification: false,
          subscribedNotification: false }
      }
    },
    async rename(newName) {
      if (newName !== this.displayName) {
        console.log(newName)
        try {
          const { data } = await UserAPI.updateDisplayName(newName)
          if (data.code === 200) {
            this.updateDisplayName(newName)
          } else {
            const message = `下次可改名時間: ${new Date(data.data).toLocaleDateString()}`
            this.$bvToast.toast(message, {
              title: '改名失敗',
              toaster: 'b-toaster-top-center',
              variant: 'danger'
            })
            throw new Error(data.data)
          }
        } catch (e) {
          console.error('renamimg failed', e)
        }
      }
      this.newName = ''
    },
    async changeStatus(option, newStatus) {
      try {
        const payload = { [option]: newStatus }
        const { data } = await UserAPI.updatePreference({ payload })
        if (data.code === 200) {
          this.preference[option] = newStatus
        } else {
          throw new Error(data.message)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.section {
  max-width: 32.5rem;
  width: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;

  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
}

.text-box {
  display: flex;
  border: 1px solid $gray-400;
  border-radius: 5px;
  height: 2.5rem;
  align-items: center;
  padding: 0 1rem;
}

#rename-btn {
  height: 2.5rem;
  white-space: nowrap;
  color: $white;
  background-color: $blue;
  border: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
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
  border: 1px solid $gray-400 !important;
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
