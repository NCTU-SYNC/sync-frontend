<template>
  <div>
    <div class="d-flex justify-content-start w-100">
      <label class="sr-only" :for="`block-title-${block.id}`">段落標題</label>
      <b-form-input
        :id="`block-title-${block.id}`"
        ref="title-input-field"
        v-model="tempData.blockTitle"
        class="block-title"
        placeholder="段落標題"
        @change="handleChangeTitle"
      />

      <div class="rounded bg-white datetime-container">
        <b-dropdown
          ref="datetime-dropdown"
          variant="white"
          no-caret
          toggle-class="datetime-dropdown"
          @toggle="resetDateTime"
          @hide="dropdownOpen = false"
          @show="dropdownOpen = true"
        >
          <template #button-content>
            <div class="dropdownbtn-text">
              {{
                tempData.blockDateValue && tempData.blockTimeValue
                  ? dropdownBtnDateTime
                  : '新增段落事件時間'
              }}
            </div>
            <div class="btn-caret">
              <icon
                :icon="dropdownOpen ? 'arrow-up' : 'arrow-down'"
                size="md"
              />
            </div>
          </template>
          <b-dropdown-form>
            <b-calendar
              v-model="tempData.blockDateValue"
              locale="zh"
              hide-header
            />
            <!--
            <b-time
              v-model="tempData.blockTimeValue"
              locale="zh"
              :now-button="true"
              :show-seconds="false"
              :minutes-step="10"
              :no-close-button="true"
              label-now-button="現在時間"
              label-no-time-selected="時間"
              :hide-header="true"
              class="my-2"
            />
            -->
            <div class="d-flex py-3">
              <b-form-checkbox id="addtime" v-model="timeEnable" />
              <sync-time
                v-model="tempData.blockTimeValue"
                :enable="timeEnable"
              />
            </div>
            <div class="block-current-time">
              <b-button
                variant="link"
                class="block-current-time--btn"
                @click="resetDateTime"
              >清除時間</b-button>
              事件時間
              <div class="pt-2 block-current-time--res">
                {{ displayDateTime }}
              </div>
            </div>
            <div class="btn-container">
              <b-button
                variant="tertiary-lg"
                @click="closeDropdown"
              >取消</b-button>
              <b-button
                variant="primary-lg"
                @click="saveDateTimeChanges"
              >確認</b-button>
            </div>
          </b-dropdown-form>
        </b-dropdown>
      </div>
    </div>
    <b-row v-if="initialized">
      <b-col>
        <TiptapEditor
          :id="block.id"
          :content="block.content"
          :editable="true"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import TiptapEditor from '@/components/Editor/TiptapEditor.vue'
import SyncTime from '@/components/Post/SyncTime.vue'
import moment from 'moment'

export default {
  name: 'TiptapEditPage',
  components: {
    TiptapEditor,
    SyncTime
  },
  props: {
    block: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tempData: {
        blockTitle: '',
        blockDateValue: '',
        blockTimeValue: ''
      },
      linkUrl: null,
      linkMenuIsActive: false,
      initialized: false,
      dropdownOpen: false,
      timeEnable: false
    }
  },
  computed: {
    displayDateTime() {
      if (!this.tempData.blockDateValue) return '-'

      return `${moment(this.tempData.blockDateValue).format('YYYY/MM/DD')} ${
        this.timeEnable
          ? moment(
            `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`
          ).format('HH:mm')
          : ''
      }`
    },
    dropdownBtnDateTime() {
      return `${moment(this.tempData.blockDateValue).format('YYYY/MM/DD')} ${
        this.timeEnable
          ? moment(
            `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`
          ).format('HH:mm')
          : ''
      }`
    }
  },
  created() {
    this.tempData.blockTitle = this.block.blockTitle
    if (this.block.blockDateTime) {
      this.tempData.blockDateValue = moment(this.block.blockDateTime).format(
        'YYYY-MM-DD'
      )
    }
    if (this.block.blockDateTime) {
      this.tempData.blockTimeValue = moment(this.block.blockDateTime).format(
        'HH:mm'
      )
    }
    this.initialized = true
  },
  methods: {
    handleChangeTitle() {
      // this.$emit('update:blockTitle', this.tempData.blockTitle)
      this.$store.commit('post/UPDATE_BLOCK_TITLE', {
        id: this.block.id,
        title: this.tempData.blockTitle
      })
    },
    handleChangeDate() {
      this.$store.commit('post/UPDATE_BLOCK_DATETIME', {
        id: this.block.id,
        datetime: `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`
      })
    },
    handleChangeTime() {
      this.$store.commit('post/UPDATE_BLOCK_DATETIME', {
        id: this.block.id,
        datetime: `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`
      })
    },
    separateDateAndTime(dateTimeString) {
      const dateTime = new Date(dateTimeString)
      return {
        date: dateTime.toISOString().slice(0, 10),
        time: dateTime.toLocaleTimeString('en-US', { hour12: false })
      }
    },
    saveDateTimeChanges() {
      const datetime = `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`
      const ISOformatDatetime = moment(datetime).toISOString()
      this.$store.commit('post/UPDATE_BLOCK_DATETIME', {
        id: this.block.id,
        datetime: ISOformatDatetime
      })
      this.closeDropdown()
    },
    resetDateTime() {
      let currentDatetime = this.$store.getters['post/GET_BLOCK_DATETIME'](
        this.block.id
      )
      if (currentDatetime === '') {
        currentDatetime = new Date().toISOString()
      }
      this.tempData.blockDateValue = ''
      this.tempData.blockTimeValue = ''

      this.timeEnable = false
    },
    closeDropdown() {
      this.$refs['datetime-dropdown'].hide(true)
    },
    focusOnTitle() {
      this.$refs['title-input-field'].focus()
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/post/main.scss';

.block-title {
  font-weight: bold;
  line-height: 1.5rem;
  padding: 0.5rem 0.625rem;
  margin-right: 16px;
  margin-bottom: 24px;
  color: $text-1;
  height: 40px;
  &::placeholder {
    color: $text-4;
  }
}

.editor {
  &__floating-menu {
    position: absolute;
    z-index: 1;
    margin-top: -0.25rem;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;
    &.is-active {
      opacity: 1;
      visibility: visible;
    }
  }
}

::v-deep .datetime-dropdown {
  padding: 0;
  display: flex;
  align-items: center;
  .dropdownbtn-text {
    display: inline-flex;
    color: $text-1;
    font-size: 14px;
    line-height: 24px;
    width: 140px;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .btn-caret {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: $gray-8;
    width: 40px;
    height: 100%;
    &::before {
      position: absolute;
      content: '';
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 24px;
      border-left: 1px solid $gray-4;
    }
  }
}

::v-deep .b-calendar {
  button[title='Previous year'] {
    display: none;
  }
  button[title='Next year'] {
    display: none;
  }
}

.datetime-container {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep ul.dropdown-menu {
    min-height: 450px;
  }
  .b-dropdown-form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .block-current-time {
    text-align: left;
    border-top: 1px solid #e9eeff;
    padding: 1rem 0rem;
    margin: 0;

    font-size: 12px;
    line-height: 20px;

    &--res {
      color: $text-2;
    }

    &--btn {
      float: right;
      color: $blue-4;
      padding: 0;

      font-size: inherit;
      line-height: inherit;
    }
  }
  .btn-container {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid $gray-4;
    margin: 0 -1.5rem;
    padding: 1.25rem 1.25rem 0.5rem 1.25rem;
    gap: 0.75rem;
  }
  li {
    height: 100%;
  }
}

.a {
  button {
    padding: 0 !important;
    border: none !important;
  }
}
</style>
