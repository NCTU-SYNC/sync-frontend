<template>
  <div>
    <div class="d-flex justify-content-end w-100">
      <label
        class="sr-only"
        :for="`block-title-${block.id}`"
      >段落標題</label>
      <b-input
        :id="`block-title-${block.id}`"
        v-model="tempData.blockTitle"
        class="mb-2 mr-sm-2 mb-sm-0 pl-2"
        placeholder="新聞段落標題"
        @change="handleChangeTitle()"
      />

      <div class="d-flex justify-content-center align-items-center border rounded bg-white date-time-container">
        <b-dropdown
          class="date-dropdown"
          :text="tempData.blockDateValue"
          toggle-class="py-0 border-0"
          variant="link"
          no-caret
        >
          <b-calendar
            v-model="tempData.blockDateValue"
            locale="zh"
            :hide-header="true"
            label-help="請選擇新聞事件發生的時間"
          />
        </b-dropdown>
        <span>|</span>
        <b-dropdown
          class="time-dropdown"
          :text="getTime"
          toggle-class="py-0 border-0"
          variant="link"
          no-caret
        >
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
            @input="handleChangeTime"
          />
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
    },
    blockTitle: {
      type: String,
      default: ''
    },
    blockDateTime: {
      type: String,
      default: new Date().toISOString()
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
    getTime() {
      return moment(this.blockDateTime).format('LT')
    }
  },
  created() {
    this.$store.commit('post/PUSH_BLOCK', this.block)
    this.tempData.blockTitle = this.blockTitle
    this.tempData.blockDateValue = moment(this.blockDateTime).format('YYYY-MM-DD')
    this.tempData.blockTimeValue = moment(this.blockDateTime).format('HH:mm:ss')
    this.initialized = true
  },
  methods: {
    handleChangeTitle() {
      // this.$emit('update:blockTitle', this.tempData.blockTitle)
    },
    handleChangeDate() {
      console.log('handleChangeDate')
      // this.$emit('update:blockDateTime', `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`)
    },
    handleChangeTime() {
      console.log('handleChangeTime', this.tempData.blockTimeValue)
      // this.$emit('update:blockDateTime', `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`)
    },
    sperateDateAndTime(dateTimeString) {
      const dateTime = new Date(dateTimeString)
      return {
        date: dateTime.toISOString().slice(0, 10),
        time: dateTime.toLocaleTimeString('en-US', { hour12: false })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/post/main.scss';

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

.a {
button {
    padding: 0 !important;
    border: none !important;
  }
}
</style>
