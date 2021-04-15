<template>
  <div>
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

    <b-row class="my-2">
      <b-col class="editor">
        <editor-menu-bar
          v-slot="{ commands, isActive }"
          :editor="editor"
        >
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start">
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
                :class="{ 'is-active': isActive.blockquote() }"
                @click="commands.blockquote"
              >
                <b-icon icon="chat-quote-fill" />
              </button>
              <AddLinkCommandButton
                :id="blockId"
                :commands="commands"
                :editor="editor"
              />
              <button
                class="menubar__button"
                @click="commands.undo"
              >
                <b-icon icon="arrow90deg-left" />
              </button>

              <button
                class="menubar__button"
                @click="commands.redo"
              >
                <b-icon icon="arrow90deg-right" />
              </button>
            </div>
          </div>
        </editor-menu-bar>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="rounded border bg-white">
          <editor-menu-bubble
            v-slot="{ commands, isActive, getMarkAttrs, menu }"
            class="menububble"
            :editor="editor"
            @hide="hideLinkMenu"
          >
            <div
              ref="menuBubble"
              class="menububble"
              :class="{ 'is-active': menu.isActive }"
              :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
            >
              <form
                v-if="linkMenuIsActive"
                class="menububble__form"
                @submit.prevent="setLinkUrl(commands.link, linkUrl, isActive.link())"
              >
                <input
                  ref="linkInput"
                  v-model="linkUrl"
                  class="menububble__input"
                  style="min-width: 15rem !important;"
                  type="text"
                  placeholder="貼上引用連結或點選右邊搜尋欄新聞"
                  @keydown.esc="hideLinkMenu"
                >
                <button
                  class="menububble__button ml-1"
                  type="button"
                  @click="setLinkUrl(commands.link, null, false)"
                >
                  <b-icon
                    icon="x"
                    scale="1.5"
                  />
                </button>
              </form>

              <template v-else>
                <button
                  class="menububble__button"
                  :class="{ 'is-active': isActive.link() }"
                  @click="showLinkMenu(getMarkAttrs('link'))"
                >
                  <span>{{ isActive.link() ? '更新引用連結' : '新增引用連結' }}</span>
                  <b-icon
                    class="ml-2"
                    icon="link45deg"
                    scale="1.5"
                  />
                </button>
              </template>
            </div>
          </editor-menu-bubble>
          <editor-content
            ref="editorContent"
            :class="['editor__content', 'px-3', 'pt-3', { 'active': initialized}]"
            :editor="editor"
          />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import { History, Blockquote, Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Placeholder, OrderedList } from 'tiptap-extensions'
import Link from '@/components/Editor/TiptapExtensions/Link'
import AddLinkCommandButton from '@/components/Editor/MenuCommands/AddLinkCommandButton.vue'
import moment from 'moment'

export default {
  name: 'TiptapEditPage',
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble,
    AddLinkCommandButton
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
        onUpdate: ({ getJSON }) => {
          // console.log(state, transaction)
          // 將資料回傳給父物件
          this.$emit('update:content', getJSON())
        },
        onFocus: () => {
          this.onEditorFocus()
        },
        extensions: [
          new History(),
          new Blockquote(),
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Italic(),
          new Strike(),
          new OrderedList(),
          new Underline(),
          new BulletList(),
          new Link(),
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
  beforeDestroy() {
    this.editor.destroy()
  },
  created() {
    // 產生隨機ID，讓元件綁上id
    this.blockId = Math.random().toString(36).substring(7)
    console.log('Random block id: ', this.blockId)
    this.tempData.blockTitle = this.blockTitle
    this.tempData.blockDateValue = moment(this.blockDateTime).format('YYYY-MM-DD')
    this.tempData.blockTimeValue = moment(this.blockDateTime).format('HH:mm:ss')
    this.initialized = true
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
      console.log('handleChangeTime', this.tempData.blockTimeValue)
      this.$emit('update:blockDateTime', `${this.tempData.blockDateValue} ${this.tempData.blockTimeValue}`)
    },
    sperateDateAndTime(dateTimeString) {
      const dateTime = new Date(dateTimeString)
      return {
        date: dateTime.toISOString().slice(0, 10),
        time: dateTime.toLocaleTimeString('en-US', { hour12: false })
      }
    },
    onEditorFocus() {
      this.$emit('onEdit', this.editor)
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        const menuBubble = this.$refs.menuBubble
        if (menuBubble.offsetLeft <= menuBubble.offsetWidth / 2 - 15) {
          menuBubble.style.left = `${menuBubble.offsetWidth / 2}px`
        } else if (menuBubble.offsetLeft >= menuBubble.parentElement.offsetWidth + 30 - menuBubble.offsetWidth / 2) {
          menuBubble.style.left = `${menuBubble.parentElement.offsetWidth + 30 - menuBubble.offsetWidth / 2}px`
        }
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    async setLinkUrl(command, url, isActiveLink) {
      this.hideLinkMenu()
      if (isActiveLink) {
        command({ href: url })
      } else {
        command({ href: url })
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
