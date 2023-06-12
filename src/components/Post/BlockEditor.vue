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

      <div class="rounded datetime-container">
        <b-dropdown
          ref="datetime-dropdown"
          variant="white"
          no-caret
          toggle-class="datetime-dropdown"
          lazy
          @hidden="toggleHide"
          @show="dropdownOpen = true"
        >
          <template #button-content>
            <div class="dropdownbtn-text" :class="{'dropdownbtn-text-placeholder': !(tempData.blockDateValue || tempData.blockTimeValue)}">
              {{
                tempData.blockDateValue || tempData.blockTimeValue
                  ? dropdownBtnDateTime
                  : '段落事件時間'
              }}
            </div>
            <div class="btn-caret">
              <SyncIcon
                :icon="dropdownOpen ? 'arrow-up' : 'arrow-down'"
                size="sm"
              />
            </div>
          </template>
          <b-dropdown-form>
            <b-calendar
              v-model="tempData.blockDateValue"
              locale="zh"
              hide-header
            />
            <div class="d-flex py-3">
              <b-form-checkbox :id="`addtime_${block.id}`" v-model="tempData.timeEnable" :disabled="!tempData.blockDateValue" />
              <sync-time
                v-model="tempData.blockTimeValue"
                :enable="tempData.timeEnable"
              />
            </div>
            <div class="block-current-time">
              <b-button
                variant="link"
                class="block-current-time--btn"
                @click="clearDateTime"
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
        blockTimeValue: '',
        timeEnable: null
      },
      linkUrl: null,
      linkMenuIsActive: false,
      initialized: false,
      dropdownOpen: false
    }
  },
  computed: {
    displayDateTime() {
      if (!this.tempData.blockDateValue) return '-'
      return this.formattedDateTimeStr(this.tempData.blockDateValue, this.tempData.timeEnable, this.tempData.blockTimeValue)
    },
    dropdownBtnDateTime() {
      return this.formattedDateTimeStr(this.tempData.blockDateValue, this.tempData.timeEnable, this.tempData.blockTimeValue)
    }
  },
  created() {
    this.tempData.blockTitle = this.block.blockTitle
    if (this.block.blockDateTime) {
      this.tempData.blockDateValue = this.formattedDateStr(this.block.blockDateTime)
      if (this.block.timeEnable) {
        this.tempData.blockTimeValue = this.formattedTimeStr(this.block.blockDateTime)
        this.tempData.timeEnable = this.block.timeEnable
      }
    }
    this.initialized = true
  },
  methods: {
    handleChangeTitle() {
      this.$store.commit('post/UPDATE_BLOCK_TITLE', {
        id: this.block.id,
        title: this.tempData.blockTitle
      })
    },
    saveDateTimeChanges() {
      const datetime = `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`
      const ISOformatDatetime = moment(datetime).toISOString()
      this.$store.commit('post/UPDATE_BLOCK_DATETIME', {
        id: this.block.id,
        datetime: ISOformatDatetime
      })
      this.$store.commit('post/TOGGLE_TIME_ENABLE', {
        id: this.block.id,
        value: this.tempData.timeEnable
      })
      this.closeDropdown()
    },
    clearDateTime() {
      this.tempData.blockDateValue = ''
      this.tempData.blockTimeValue = ''
      this.tempData.timeEnable = false
    },
    fetchDateTime() {
      if (this.block.blockDateTime) {
        this.tempData.blockDateValue = this.formattedDateStr(this.block.blockDateTime)
      }
      if (this.block.blockDateTime) {
        this.tempData.blockTimeValue = this.formattedTimeStr(this.block.blockDateTime)
      }
      this.tempData.timeEnable = this.block.timeEnable
    },
    closeDropdown() {
      this.$refs['datetime-dropdown'].hide(true)
    },
    focusOnTitle() {
      this.$refs['title-input-field'].focus()
    },
    toggleHide() {
      this.fetchDateTime()
      this.dropdownOpen = false
    },
    formattedDateStr(datetimeValue) {
      return moment(datetimeValue).format('YYYY/MM/DD')
    },
    formattedTimeStr(datetimeValue) {
      return moment(datetimeValue).format('HH:mm')
    },
    formattedDateTimeStr(dateValue, timeEnable, timeValue) {
      return `${this.formattedDateStr(dateValue)} ${
        timeEnable
          ? this.formattedTimeStr(`${dateValue} ${timeValue}`)
          : ''
      }`
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/post/main.scss';

.block-title {
  padding: 0.25rem 0.5rem;
  margin-right: 16px;
  margin-bottom: 1.25rem;

  height: unset;
  font-size: 14px;
  line-height: 24px;
  color: $text-1;
  background-color: $gray-1;

  &::placeholder {
    color: $text-3;
  }

  &:focus {
    border: 1px solid $blue-4 !important;
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

:deep(.datetime-dropdown) {
  padding: 4px 8px;
  display: flex;
  align-items: center;

  .dropdownbtn-text {
    display: inline-flex;
    color: $text-1;
    font-size: 14px;
    line-height: 24px;
    width: 146px;
    align-items: center;

    &-placeholder {
      color: $text-3;
    }
  }
  .btn-caret {
    position: relative;
    display: inline-flex;
    align-items: center;
    color: $nature-8;
    height: 100%;
  }
}

:deep(.b-calendar) {
  button[title='Previous year'] {
    display: none;
  }
  button[title='Next year'] {
    display: none;
  }
}

.datetime-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  background-color: $gray-1;

  :deep(ul.dropdown-menu) {
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
</style>
