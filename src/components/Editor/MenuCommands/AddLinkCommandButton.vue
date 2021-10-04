<template>
  <div>
    <button
      variant="outline-secondary"
      class="menubar__button"
      @click="openAddLinkDialog"
    >
      <b-icon icon="link45deg" />
    </button>

    <b-modal
      :id="`modal-center-${id}`"
      centered
      title="引用貼文"
      ok-title="引用"
      cancel-title="取消"
      @ok="submitLink"
    >
      <div class="mb-2">
        <p>加入參考的來源，引入至文章內，您可以直接在下方輸入新的參考來源，或是使用現有的參考來源進行引用或是編輯。</p>
        <b-dropdown
          id="dropdown-grouped"
          :text="getDropdownText"
          variant="outline-primary"
          block
          no-caret
          :disabled="post.citations.length === 0"
          menu-class="w-100"
          class="dropdown-title"
        >
          <div
            v-for="(citation, index) in post.citations"
            :key="index"
            :disabled="post.citations.length === 0"
          >
            <b-dropdown-item-button @click="onDropdownClicked(citation)">
              <p class="text-secondary dropdown-menu-text">{{ citation.title }}</p>
              <p class="dropdown-menu-text">{{ citation.url }}</p>
            </b-dropdown-item-button>
          </div>
          <b-dropdown-divider />
          <b-dropdown-item-button @click="onDropdownClicked()">
            <p class="dropdown-menu-text">新增參考來源</p>
          </b-dropdown-item-button>
        </b-dropdown>
      </div>
      <b-form-group>
        <label for="input-link">
          參考連結
        </label>
        <b-form-input
          id="input-link"
          v-model="linkAttrs.url"
          list="citations-list"
          placeholder="輸入使用者點選跳轉的連結"
          :disabled="currentEditingCitation.length !== 0"
          aria-describedby="input-link-help"
          autofocus
        />
        <b-form-text v-if="currentEditingCitation.length !== 0" id="input-link-help">引用貼文後，若欲修改連結，請在編輯器內反白文字點選更新連結即可，參考來源的連結也會一併更新</b-form-text>
      </b-form-group>
      <b-form-group>
        <label>
          新聞的參考文章或網頁的標題
        </label>
        <b-form-input
          v-model="linkAttrs.title"
          placeholder="輸入參考文章的標題"
        />
      </b-form-group>
      <b-form-group>
        <label>
          新聞內超連結顯示的文字
        </label>
        <b-form-input
          v-model="linkAttrs.text"
          placeholder="輸入欲顯示的文字，可以再修改"
        />
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { insertHTML } from '@/utils/editorUtil'

export default {
  name: 'AddLinkCommandButton',
  props: {
    id: {
      type: String,
      default: Date.now().toString()
    },
    commands: {
      type: Object,
      required: true
    },
    editor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      linkAttrs: {
        url: '',
        text: '',
        title: ''
      },
      currentText: '',
      currentEditingCitation: ''
    }
  },
  computed: {
    ...mapGetters({ post: 'post' }),
    getDropdownText() {
      if (this.post.citations.length === 0) { return '目前無參考來源' } else {
        if (this.currentEditingCitation === '') {
          return '使用現有的參考來源'
        }
        return `編輯參考來源中`
      }
    }
  },
  methods: {
    async submitLink() {
      const from = this.editor.state.selection.from
      const to = this.editor.state.selection.to
      if (from !== to && this.currentText === this.linkAttrs.text) {
        this.commands.link(this.linkAttrs)
      } else {
        insertHTML(this.editor, `<a href="${this.linkAttrs.url}" target="_blank">${this.linkAttrs.text}</a>`)
      }

      const title = this.linkAttrs.title
      const url = this.linkAttrs.url

      const action = await this.$store.dispatch('post/SUBMIT_CITATION_FORM', {
        title,
        url
      })
      if (action === 'replace') {
        this.$bvModal.msgBoxOk(`在已引用的來源中找到相同網址：${title}，更新其標題為：${url}`, {
          centered: true,
          noCloseOnBackdrop: true,
          noCloseOnEsc: true,
          modalClass: 'text-break',
          footerClass: 'msgbox-footer',
          okTitle: '確定'
        })
      }
    },
    openAddLinkDialog() {
      this.currentEditingCitation = ''
      this.linkAttrs.url = ''
      this.linkAttrs.title = ''
      const { selection, state } = this.editor
      // get marks, if any from selected area
      const { from, to } = selection
      this.currentText = state.doc.textBetween(from, to, ' ')
      this.linkAttrs.text = this.currentText || ''

      let marks = []
      state.doc.nodesBetween(from, to, (node) => {
        marks = [...marks, ...node.marks]
      })

      const mark = marks.find((markItem) => markItem.type.name === 'link')
      if (mark) {
        this.linkAttrs.url = mark.attrs.href
      }

      this.$bvModal.show(`modal-center-${this.id}`)
    },
    onDropdownClicked(citation) {
      if (citation) {
        this.currentEditingCitation = citation.url
        this.linkAttrs.url = citation.url
        this.linkAttrs.title = citation.title
      } else {
        this.currentEditingCitation = ''
        this.linkAttrs.url = ''
        this.linkAttrs.title = ''
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/post/main.scss';

.dropdown-menu-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
</style>
