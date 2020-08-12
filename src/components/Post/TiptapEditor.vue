<template>
  <div style="margin: 20px;">
    <b-form inline>
      <label class="sr-only" :for="`block-title-${blockId}`">段落標題</label>
      <b-input
        :id="`block-title-${blockId}`"
        v-model="tempData.blockTitle"
        class="mb-2 mr-sm-2 mb-sm-0 pl-2"
        placeholder="輸入標題..."
        @change="handleChangeTitle()"
      />

      <label class="sr-only" :for="`block-datepicker-${blockId}`" />
      <b-form-datepicker
        :id="`block-datepicker-${blockId}`"
        v-model="tempData.blockDateValue"
        class="mb-2 mr-sm-2 mb-sm-0"
        :hide-header="true"
        locale="zh"
        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        label-no-date-selected="日期"
        label-help=""
        @input="handleChangeDate"
      />

      <label class="sr-only" :for="`block-timepicker-${blockId}`" />
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
    </b-form>

    <b-row class="my-2">
      <b-col cols="12" class="editor">
        <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
          <b-row class="my-1">
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
              >
                <b>B</b>
              </button>
            </b-col>
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.italic() }"
                @click="commands.italic"
              >
                <i>I</i>
              </button>
            </b-col>
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.strike() }"
                @click="commands.strike"
              >
                <s>S</s>
              </button>
            </b-col>
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.underline() }"
                @click="commands.underline"
              >
                <u>T</u>
              </button>
            </b-col>
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })"
              >H1</button>
            </b-col>
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })"
              >H2</button>
            </b-col>
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                @click="commands.heading({ level: 3 })"
              >H3</button>
            </b-col>
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                ul
              </button>
            </b-col>
            <b-col>
              <button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.ordered_list() }"
                @click="commands.ordered_list"
              >
                ol
              </button>
            </b-col>
          </b-row>
        </editor-menu-bar>
      </b-col>

      <b-col cols="12">
        <hr>
        <br>
        <editor-floating-menu v-slot="{ commands, isActive, menu }" :editor="editor">
          <div
            class="editor__floating-menu"
            :class="{ 'is-active': menu.isActive }"
            :style="`top: ${menu.top}px`"
          >

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.bold() }"
              @click="commands.bold"
            >
              <b>B</b>
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              <i>I</i>
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.strike() }"
              @click="commands.strike"
            >
              <s>S</s>
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.underline() }"
              @click="commands.underline"
            >
              <u>T</u>
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 1 }) }"
              @click="commands.heading({ level: 1 })"
            >
              H1
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 2 }) }"
              @click="commands.heading({ level: 2 })"
            >
              H2
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 3 }) }"
              @click="commands.heading({ level: 3 })"
            >
              H3
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              ul
            </button>

            <button
              class="menubar__button"
              :class="{ 'is-active': isActive.ordered_list() }"
              @click="commands.ordered_list"
            >
              ol
            </button>

          </div>
        </editor-floating-menu>
        <editor-content class="editor__content" :editor="editor" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorFloatingMenu } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Placeholder, OrderedList } from 'tiptap-extensions'

export default {
  name: 'TiptapEditPage',
  components: {
    EditorContent,
    EditorMenuBar,
    EditorFloatingMenu
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
  data() {
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
        onUpdate: ({ state, getHTML, getJSON, transaction }) => {
          // console.log(state, transaction)
          console.log(getHTML(), getJSON())
          console.log(JSON.stringify(getJSON()))
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
            emptyNodeText: '輸入內文...',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          })
        ],
        content: this.content
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  created() {
    // 產生隨機ID，讓元件綁上id
    this.blockId = Math.random().toString(36).substring(7)
    console.log('Random block id: ', this.blockId)
    this.tempData.blockTitle = this.blockTitle
    this.tempData.blockDateValue = this.sperateDateAndTime(this.blockDateTime).date
    this.tempData.blockTimeValue = this.sperateDateAndTime(this.blockDateTime).time
  },
  methods: {
    handleChangeTitle() {
      this.$emit('update:blockTitle', this.tempData.blockTitle)
    },
    handleChangeDate() {
      console.log('handleChangeDate')
      this.$emit('update:blockDateTime', `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`)
    },
    handleChangeTime() {
      console.log('handleChangeTime')
      this.$emit('update:blockDateTime', `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`)
    },
    sperateDateAndTime(dateTimeString) {
      const dateTime = new Date(dateTimeString)
      return { date: dateTime.toISOString().slice(0, 10),
        time: dateTime.toLocaleTimeString('en-US', { hour12: false }) }
    },
    onEditorFocus() {
      this.$emit('onEdit', this.editor)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/Post/main";

.editor {
  position: relative;
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
</style>
