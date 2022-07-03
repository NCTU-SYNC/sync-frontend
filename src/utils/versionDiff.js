import * as jsondiffpatch from 'jsondiffpatch'

console.log(jsondiffpatch)

const textDiffType = Object.freeze({
  CONTEXT: 0,
  NEW: 1,
  OLD: 2
})

const deltaType = Object.freeze({
  ADD: 0,
  MOD: 1,
  DEL: 2,
  TEXT: 3,
  MOV: 4
})

function HighlightFactory(_new = true) {
  const obj = {
    type: 'highlight',
    attrs: {
      color: _new ? 'green' : 'red'
    }
  }

  return obj
}

function TextFactory(text, textType) {
  const obj = {
    type: 'text',
    text: text,
    marks: []
  }

  switch (textType) {
    case textDiffType.NEW:
      obj.marks.push(new HighlightFactory(true))
      break
    case textDiffType.OLD:
      obj.marks.push(new HighlightFactory(false))
      break
    default:
      break
  }

  return obj
}

function getDeltaType(delta) {
  if (!Array.isArray(delta)) throw TypeError('delta must be array')

  if (delta.length === 1) {
    return deltaType.ADD
  }
  if (delta.length === 2) {
    return deltaType.MOD
  }
  if (delta.length === 3 && delta[2] === 0) {
    return deltaType.DEL
  }
  if (delta.length === 3 && delta[2] === 2) {
    return deltaType.TEXT
  }
  if (delta.length === 3 && delta[2] === 3) {
    return deltaType.MOV
  }
}

function createText(doc, text, textDiffType) {
  doc.push(new TextFactory(text, textDiffType))
}

function insertMark(doc, key, _new = true) {
  // if doc is on the left, key start with '_'
  if (_new === false) {
    key = key.slice(1)
  }
  if (doc.marks === undefined) doc[key].marks = []

  doc[key].marks.push(new HighlightFactory(_new))
}

/**
  unidiff parser from benjamine/jsondiffpatch
  https://github.com/benjamine/jsondiffpatch/blob/master/src/formatters/base.js#L220

  [unidiff](https://github.com/google/diff-match-patch/wiki/Unidiff)
*/
function parseTextDiff(value) {
  const output = []
  const lines = value.split('\n@@ ')

  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]
    const lineOutput = {
      pieces: []
    }

    const location = /^(?:@@ )?[-+]?(\d+),(\d+)/.exec(line).slice(1)

    lineOutput.location = {
      line: location[0],
      chr: location[1]
    }

    const pieces = line.split('\n').slice(1)

    for (
      let pieceIndex = 0, piecesLength = pieces.length;
      pieceIndex < piecesLength;
      pieceIndex++
    ) {
      const piece = pieces[pieceIndex]

      if (!piece.length) {
        continue
      }

      const pieceOutput = {
        type: 'context'
      }

      if (piece.substr(0, 1) === '+') {
        pieceOutput.type = 'added'
      } else if (piece.substr(0, 1) === '-') {
        pieceOutput.type = 'deleted'
      }

      pieceOutput.text = piece.slice(1)
      lineOutput.pieces.push(pieceOutput)
    }

    output.push(lineOutput)
  }

  return output
}

function StackPayload(l, r, d) {
  return {
    left: l,
    right: r,
    delta: d
  }
}

function countWord(doc) {
  if (doc.content === undefined) {
    console.log(doc)
    return doc.text.length
  }
  let len = 0

  // BFS traverse
  const queue = [doc]
  while (queue.length) {
    const node = queue.shift()

    if (node.content) {
      queue.push(...node.content)
    } else {
      len += node.text.length
    }
  }

  return len
}

/**
 * @example:
 * const diff = new VersionDiff(prev, next)
 * const { leftDoc, rightDoc } = diff.markedDoc()
 * console.log(diff.wordCount)
 */
class VersionDiff {
  /**
   * find the diff from left to right
   * @param {[TipTapEditor]} left left blocks of TipTap Editor
   * @param {[TipTapEditor]} right right blocks of TipTap Editor
   */
  constructor(left, right) {
    this.left = left
    this.right = right
    this.marked = false
    this._delta = undefined
    this._wordCount = {
      new: 0,
      old: 0
    }
  }

  /**
   * return marked TipTap document
   * @returns { left: Object, right: Object }: marked TipTap doc
   */
  markedDoc() {
    if (!this.marked) this.mark()

    return { leftDoc: this.left, rightDoc: this.right }
  }

  /**
   * basically what it does is:
   *  - BFS through the delta tree
   *  - mark the diff on left TipTap doc and right TipTap doc
   */
  mark() {
    const stack = []

    let leftParent
    let rightParent

    stack.unshift(new StackPayload(this.left, this.right, this.delta))

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { left: leftCur, right: rightCur, delta: deltaCur } = stack.shift()

      for (const key of Object.keys(deltaCur)) {
        // skip type descriptor
        // skip changes on marks
        if (key === '_t' || key === 'marks') continue
        console.log(key, deltaCur)
        if (Array.isArray(deltaCur[key])) {
          switch (getDeltaType(deltaCur[key])) {
            case deltaType.ADD:
              insertMark(rightCur, key, true)
              this._wordCount.new += countWord(rightCur[key])
              break
            case deltaType.MOD:
              // TODO: generate MOD delta to test
              insertMark(leftCur, key, false)
              insertMark(rightCur, key, true)
              this._wordCount.new += countWord(rightCur[key])
              this._wordCount.old += countWord(leftCur[key.slice(1)])
              break
            case deltaType.DEL:
              insertMark(leftCur, key, false)
              this._wordCount.old += countWord(leftCur[key.slice(1)])
              break
            case deltaType.TEXT:
              // clear content array
              leftParent.splice(0, leftParent.length)
              rightParent.splice(0, rightParent.length)

              for (const p of parseTextDiff(deltaCur[key][0])) {
                for (const piece of p.pieces) {
                  const text = decodeURI(piece.text)
                  if (piece.type === 'added') {
                    createText(leftParent, text, textDiffType.NEW)
                    this._wordCount.new += text.length
                  } else if (piece.type === 'deleted') {
                    createText(leftParent, text, textDiffType.OLD)
                    this._wordCount.old += text.length
                  } else if (piece.type === 'context') {
                    createText(leftParent, text, textDiffType.CONTEXT)
                    createText(rightParent, text, textDiffType.CONTEXT)
                  }
                }
              }
              break
            case deltaType.MOV:
              // TODO: generate move delta to test
              // NOTE: may never happen
              console.log('move: ', deltaCur[key])
              break
          }

          // after handle delta, continue to next key.
          // no iterate on child needed
          continue
        }

        if (deltaCur[key] === undefined) break
        if (leftCur[key] === undefined && rightCur[key] === undefined) break

        stack.unshift(new StackPayload(leftCur[key], rightCur[key], deltaCur[key]))

        // objIter(delta[key], prevParent, nextParent)
      }

      leftParent = leftCur
      rightParent = rightCur

      if (stack.length === 0) {
        break
      }
    }
  }

  /**
   * return a delta generated by jsondiffpatch
   */
  get delta() {
    // if not generated, generate delta
    if (!this._delta) {
      this._delta = jsondiffpatch.diff(this.left, this.right)
    }

    return this._delta
  }

  get wordCount() {
    return this._wordCount
  }
}

export default VersionDiff
