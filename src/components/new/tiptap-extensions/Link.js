import { Plugin } from 'tiptap'
import { getMarkRange } from 'tiptap-utils'
import { TextSelection } from 'prosemirror-state'
import { Link as TiptapLink } from 'tiptap-extensions'
import AddLinkCommandButton from '@/components/new/MenuCommands/Link/AddLinkCommandButton.vue'

function getAttrs(dom) {
  return {
    href: dom.getAttribute('href'),
    target: dom.getAttribute('target') === '_blank'
  }
}

function toDOM(mark) {
  const {
    href,
    target
  } = mark.attrs

  const attrs = {}
  attrs.href = href

  let ref = 'nofollow'

  if (target) {
    attrs.target = '_blank'
    ref += ' noopener noreferrer'
  }

  attrs.ref = ref.trim()

  return ['a', attrs, 0]
}

export default class Link extends TiptapLink {
  get schema() {
    return {
      attrs: {
        href: {
          default: null
        },
        target: {
          default: true
        }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs
        }
      ],
      toDOM
    }
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handleClick(view, pos) {
            // console.log('handleClick', view, pos)
            const { schema, doc, tr } = view.state

            const range = getMarkRange(doc.resolve(pos), schema.marks.link)

            if (!range) return false

            const $start = doc.resolve(range.from)
            const $end = doc.resolve(range.to)

            const transaction = tr.setSelection(new TextSelection($start, $end))

            view.dispatch(transaction)
            return true
          }
        }
      })
    ]
  }

  menuBtnView(editorContext) {
    return {
      component: AddLinkCommandButton,
      componentProps: {
        editorContext
      }
    }
  }
}
