<template>
  <div style="margin: 20px;">
    <div class="d-flex justify-content-end w-100">
      <label
        class="sr-only"
        :for="`block-title-${blockId}`"
      >段落標題</label>
      <b-input
        :id="`block-title-${blockId}`"
        v-model="tempData.blockTitle"
        class="mb-2 mr-sm-2 mb-sm-0 pl-2"
        placeholder="新聞段落標題"
        @change="handleChangeTitle()"
      />

      <div class="d-flex justify-content-center align-items-center border rounded bg-white datetime-container">
        <b-dropdown
          text="2020年12月1日"
          toggle-class="py-0 border-0"
          variant="link"
          no-caret
        >
          <b-calendar
            v-model="tempData.blockDateValue"
            locale="zh"
            :hide-header="true"
            label=""
          />
        </b-dropdown>
        <span>|</span>
        <b-dropdown
          text="時間"
          toggle-class="py-0 border-0"
          variant="link"
          no-caret
        >
          <b-calendar
            v-model="tempData.blockDateValue"
            locale="zh"
            :hide-header="true"
            label=""
          />
        </b-dropdown>
      </div>

      <div class="d-none">
        <label
          class="sr-only"
          :for="`block-datepicker-${blockId}`"
        />
        <b-form-datepicker
          :id="`block-datepicker-${blockId}`"
          v-model="tempData.blockDateValue"
          class="mb-2 mr-sm-2 mb-sm-0"
          :hide-header="true"
          locale="zh"
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          label-no-date-selected="日期"
          label-help=""
          calendar-width="100%"
          @input="handleChangeDate"
        />

        <label
          class="sr-only"
          :for="`block-timepicker-${blockId}`"
        />
        <b-form-timepicker
          :id="`block-timepicker-${blockId}`"
          v-model="tempData.blockTimeValue"
          class="mb-2 mr-sm-2 mb-sm-0"
          :hour12="false"
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
      </div>
    </div>

    <b-row class="my-2">
      <b-col class="editor">
        <editor-menu-bar
          v-slot="{ commands, isActive }"
          :editor="editor"
        >
          <div class="d-flex justify-content-between">
            <div>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
              >
                <b-icon icon="type-bold" />
              </button>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                <b-icon icon="list-ul" />
              </button>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.ordered_list() }"
                @click="commands.ordered_list"
              >
                <b-icon icon="list-ol" />
              </button>
              <button
                variant="outline-secondary"
                class="menubar__button"
              >
                <b-icon icon="chat-quote-fill" />
              </button>
            </div>
            <div class="d-flex justify-content-end align-items-center">
              <b-form-checkbox
                value="true"
                unchecked-value="false"
              >
                匿名發文
              </b-form-checkbox>
              <span class="mx-2 text-secondary">
                編輯者：Shang
              </span>
              <b-link class="text-secondary">
                +其他10位
              </b-link>
            </div>
          </div>
        </editor-menu-bar>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <editor-content
          ref="editorContent"
          :class="['rounded', 'border' ,'bg-white', 'editor__content', 'p-3', { 'active': initialized}]"
          :editor="editor"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Placeholder, OrderedList } from 'tiptap-extensions'

export default {
  name: 'TiptapEditPage',
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    content: {
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
  data () {
    return {
      blockId: '',
      tempData: {
        blockTitle: '',
        blockDateValue: '',
        blockTimeValue: ''
      },
      editor: new Editor({
        autoFocus: true,
        onInit: () => {
          // editor is initialized
        },
        onUpdate: ({ getJSON }) => {
          // console.log(state, transaction)
          // 將資料回傳給父物件
          this.$emit('update:content', getJSON())
        },
        onFocus: () => {
          this.onEditorFocus()
        },
        extensions: [
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Italic(),
          new Strike(),
          new OrderedList(),
          new Underline(),
          new BulletList(),
          new ListItem(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: '1. 撰寫內容\n2. 使用右邊欄位搜尋相關新聞引入內文',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          })
        ],
        content: this.content
      }),
      initialized: false
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  created () {
    // 產生隨機ID，讓元件綁上id
    this.blockId = Math.random().toString(36).substring(7)
    console.log('Random block id: ', this.blockId)
    this.tempData.blockTitle = this.blockTitle
    this.tempData.blockDateValue = this.sperateDateAndTime(this.blockDateTime).date
    this.tempData.blockTimeValue = this.sperateDateAndTime(this.blockDateTime).time
    this.initialized = true
  },
  methods: {
    handleChangeTitle () {
      this.$emit('update:blockTitle', this.tempData.blockTitle)
    },
    handleChangeDate () {
      console.log('handleChangeDate')
      this.$emit('update:blockDateTime', `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`)
    },
    handleChangeTime () {
      console.log('handleChangeTime')
      this.$emit('update:blockDateTime', `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`)
    },
    sperateDateAndTime (dateTimeString) {
      const dateTime = new Date(dateTimeString)
      return {
        date: dateTime.toISOString().slice(0, 10),
        time: dateTime.toLocaleTimeString('en-US', { hour12: false })
      }
    },
    onEditorFocus () {
      this.$emit('onEdit', this.editor)
    }
  }
}
</script>

<style scoped lang="scss">
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

.datetime-container {
  button {
    padding: 0 !important;
    border: none !important;
  }
}

.a {
button {
    padding: 0 !important;
    border: none !important;
  }
}
</style>
