import {
  has as _has,
  flow as _flow,
  partialRight as _partialRight,
  map as _map,
  flatMap as _flatMap,
  join as _join
} from 'lodash'

const extractBulletList = _flow(
  _partialRight(_flatMap, (li) => {
    if (li.type === 'listItem' && _has(li, 'content')) {
      return li.content
    }

    return []
  }),
  _partialRight(_flatMap, (p) => {
    if (p.type === 'paragraph' && _has(p, 'content')) {
      return p.content
    }

    return []
  })
)

export const blocksToText = _flow(
  _partialRight(_map, (block) => block.content),
  _partialRight(_flatMap, (content) => {
    if (content.type === 'doc' && _has(content, 'content')) {
      return content.content
    }

    return []
  }),
  _partialRight(_flatMap, (doc) => {
    if (doc.type === 'bulletList' && _has(doc, 'content')) {
      const p = extractBulletList(doc.content)
      return p
    }

    if (doc.type === 'paragraph' && _has(doc, 'content')) {
      return doc.content
    }

    return []
  }),
  _partialRight(_flatMap, (p) => {
    if (p.type === 'text' && _has(p, 'text')) {
      return p.text
    }

    return []
  }),
  _partialRight(_join, '')
)
