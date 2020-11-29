<template>
  <div>
    <button
      v-b-modal.modal-center
      variant="outline-secondary"
      class="menubar__button"
      @click="openAddLinkDialog"
    >
      <b-icon icon="link45deg" />
    </button>

    <b-modal
      id="modal-center"
      centered
      title="引用貼文"
      ok-title="引用"
      cancel-title="取消"
      @ok="addLink"
    >
      <b-form-group>
        <label>
          目標連結
        </label>
        <b-form-input
          v-model="linkAttrs.href"
          placeholder="輸入連結"
        />
      </b-form-group>
      <b-form-group>
        <label>
          顯示文字
        </label>
        <b-form-input
          v-model="linkAttrs.text"
          placeholder="輸入欲顯示的文字，可以再修改"
        />
      </b-form-group>
      <b-form-group>
        <label>
          參考文章
        </label>
        <b-form-input
          v-model="linkAttrs.title"
          placeholder="輸入參考文章的標題"
        />
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
import { insertHTML } from '@/utils/editorUtil'
export default {
  name: 'AddLinkCommandButton',
  props: {
    commands: {
      type: Object,
      required: true
    },
    editor: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      linkAttrs: {
        href: '',
        text: '',
        title: ''
      },
      addLinkDialogVisible: false,
      currentText: '',
      currentReferenceIndex: 1
    }
  },
  methods: {
    addLink () {
      const from = this.editor.state.selection.from
      const to = this.editor.state.selection.to
      console.log(from, to)
      if (from !== to && this.currentText === this.linkAttrs.text) {
        this.commands.link(this.linkAttrs)
        this.editor.setSelection(to, to)
        this.editor.focus()
        const transaction = this.editor.state.tr.insertText(` [${this.currentReferenceIndex}]`)
        this.editor.view.dispatch(transaction)
      } else {
        // const mark = this.editor.schema.marks.link.create({ href: this.linkAttrs.href })
        // const transaction = this.editor.state.tr.insertText(this.linkAttrs.text)
        // transaction.addMark(from, from + this.linkAttrs.text.length, mark)
        // this.editor.view.dispatch(transaction)
        insertHTML(this.editor, `<a href="${this.linkAttrs.href}" target="_blank">${this.linkAttrs.text}</a><span> [${this.currentReferenceIndex}]</span>`)
      }

      // insertHTML(this.editor, `<a href="${this.linkAttrs.href}" target="_blank">${this.linkAttrs.text}</a><span> [1]</span>`)
      this.$emit('handleInsertLink', { ...this.linkAttrs, currentReferenceIndex: this.currentReferenceIndex })
      this.closeAddLinkDialog()
    },
    openAddLinkDialog () {
      this.linkAttrs.href = ''
      this.linkAttrs.text = ''
      const { selection, state } = this.editor
      // get marks, if any from selected area
      const { from, to } = selection
      this.currentText = state.doc.textBetween(from, to, ' ')
      this.linkAttrs.text = this.currentText

      let marks = []
      state.doc.nodesBetween(from, to, (node) => {
        marks = [...marks, ...node.marks]
      })

      const mark = marks.find((markItem) => markItem.type.name === 'link')
      if (mark) { this.linkAttrs.href = mark.attrs.href }
      let linkCount = 0
      state.doc.descendants((node) => {
        if (node.marks.length > 0 && node.marks.find((markItem) => markItem.type.name === 'link')) {
          linkCount += 1
        }
      })

      this.currentReferenceIndex = linkCount + 1
      this.addLinkDialogVisible = true
    },
    closeAddLinkDialog () {
      this.addLinkDialogVisible = false
    }
  }
}
</script>
