<template>
  <div>
    <div class="d-flex justify-content-start w-100">
      <label
        class="sr-only"
        :for="`block-title-${block.id}`"
      >段落標題</label>
      <b-form-input
        :id="`block-title-${block.id}`"
        ref="title-input-field"
        v-model="tempData.blockTitle"
        class="mb-2 mr-2 mb-sm-0 pl-2 block-title"
        placeholder="段落標題"
        @change="handleChangeTitle"
      />

      <div class="d-flex justify-content-center align-items-center rounded bg-white datetime-container">
        <b-dropdown
          ref="datetime-dropdown"
          variant="white"
          no-caret
          toggle-class="datetime-dropdown d-flex align-items-center"
          @toggle="resetDateTime"
        >
          <template #button-content>
            <span class="d-inline-block pl-1 pr-5 btn-text">新增事件時間</span>
            <span class="d-inline-block pl-2"><b-icon icon="chevron-down" class="caret" /></span>
          </template>
          <b-dropdown-form>
            <b-calendar
              v-model="tempData.blockDateValue"
              locale="zh"
              hide-header
            />
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
            <div class="block-current-time">
              事件時間：{{ displayDateTime }}
            </div>
            <div class="btn-container">
              <b-button variant="edit-no-outline-lg" @click="closeDropdown">取消</b-button>
              <b-button variant="edit-fill-lg" @click="saveDateTimeChanges">確認</b-button>
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
import moment from 'moment'

export default {
  name: 'TiptapEditPage',
  components: {
    TiptapEditor
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
      initialized: false
    }
  },
  computed: {
    displayDateTime() {
      return `${moment(this.tempData.blockDateValue).format('YYYY年M月DD日')} ${moment(`${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`).format('H點mm分')}`
    }
  },
  created() {
    console.log(this.block)
    this.tempData.blockTitle = this.block.blockTitle
    this.tempData.blockDateValue = moment(this.block.blockDateTime).format('YYYY-MM-DD')
    this.tempData.blockTimeValue = moment(this.block.blockDateTime).format('HH:mm:ss')
    this.initialized = true
  },
  methods: {
    handleChangeTitle() {
      // this.$emit('update:blockTitle', this.tempData.blockTitle)
      console.log('handleChangeTitle:', this.tempData.blockTitle)
      this.$store.commit('post/UPDATE_BLOCK_TITLE', {
        id: this.block.id,
        title: this.tempData.blockTitle
      })
    },
    handleChangeDate() {
      console.log('handleChangeDate', this.tempData.blockDateValue)
      this.$store.commit('post/UPDATE_BLOCK_DATETIME', {
        id: this.block.id,
        datetime: `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`
      })
    },
    handleChangeTime() {
      console.log('handleChangeTime', this.tempData.blockTimeValue)
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
      console.log('saveDateTimeChanges:', datetime)
      const ISOformatDatetime = moment(datetime).toISOString()
      this.$store.commit('post/UPDATE_BLOCK_DATETIME', {
        id: this.block.id,
        datetime: ISOformatDatetime
      })
      this.closeDropdown()
    },
    resetDateTime() {
      const currentDatetime = this.$store.getters['post/GET_BLOCK_DATETIME'](this.block.id)
      console.log('reset:', currentDatetime)
      this.tempData.blockDateValue = moment(currentDatetime).format('YYYY-MM-DD')
      this.tempData.blockTimeValue = moment(currentDatetime).format('HH:mm:ss')
      console.log(this.tempData.blockDateValue)
      console.log(this.tempData.blockTimeValue)
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
  font-size: 18px;
  line-height: 30px;
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
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
.datetime-dropdown {
  .caret {
    color: $nature-8;
  }
  .btn-text {
    color: rgba(0,0,0, 0.8);
    border-right: 1px solid $nature-4;
    font-size: 14px;
  }
}
::v-deep .b-calendar {
  button[title="Previous year"] {
    display: none;
  }
  button[title="Next year"] {
    display: none;
  }
}
.datetime-container {
  ::v-deep ul.dropdown-menu {
    min-height: 450px;
  }
  .b-dropdown-form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .block-current-time {
    text-align: center;
    border-top: 1px solid #E9EEFF;
    padding: 0.5rem 0rem;
    margin: 0.5rem 0;
  }
  .btn-container {
    margin-top: auto;
    margin-left: auto;
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
