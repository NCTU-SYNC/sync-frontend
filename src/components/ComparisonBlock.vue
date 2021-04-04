<template>
  <b-row>
    <b-col cols="6" class="block-container border-right">
      <div v-if="base === null" :class="{ 'bg-light': base === null}" class="h-100 np-3" />
      <h3>{{ baseBlockTitle }}</h3>
      <slot v-for="(element, elementIndex) in getPlainTextInBlock(base)">
        <p v-if="element.type === 'paragraph'" :key="`base-${elementIndex}`">
          <slot v-for="(content, contentIndex) in element.content">
            <span v-if="content.type === 'text'" :key="`base-${contentIndex}`">
              {{ content.type === 'text' ? content.text : '' }}
            </span>
            <b-link v-if="content.type === 'link'" :key="`base-${contentIndex}`" target="_blank" :href="content.marks[0].attrs.href">
              {{ content.text }}
            </b-link>
          </slot>
        </p>
      </slot>
    </b-col>
    <b-col cols="6" class="block-container">
      <h3>
        <span
          v-for="(title, titleIndex) in articleDiff.titleDiff"
          :key="titleIndex"
          :style="getLinkNeighborStyle(title)"
        >
          {{ title[1] }}
        </span>
      </h3>
      <slot v-for="(diff, diffIndex) in getPlainTextInDiff(articleDiff.contentDiff)">
        <p v-if="diff.content.length > 0" :key="diffIndex">
          <slot v-for="(content, contentIndex) in diff.content">
            <slot v-for="(text, textIndex) in decodeText(content)">
              <b-link
                v-if="isLink(text)"
                :key="`compare-link-${diffIndex}-${contentIndex}-${textIndex}`"
                target="_blank"
                :href="text.marks[0].attrs.href"
                :style="getLinkNeighborStyle(text)"
              >
                {{ text.text }}
              </b-link>
              <span
                v-else
                :key="`compare-text-${diffIndex}-${contentIndex}-${textIndex}`"
                :style="getLinkNeighborStyle(text)"
              >
                {{ text.text }}
              </span>
            </slot>
          </slot>
        </p>
      </slot>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ComparisonBlock',
  props: {
    version: {
      type: Object,
      default() {
        return {
          title: '',
          blocks: [],
          editors: {},
          author: { uid: '', name: '' },
          updateAt: ''
        }
      }
    },
    isDiff: {
      type: Boolean,
      default: false
    },
    articleDiff: {
      type: Object,
      default() {
        return {
          titleDiff: [],
          contentDiff: []
        }
      }
    },
    linkContainer: {
      type: String,
      default: ''
    },
    base: {
      type: Object,
      default() {
        return {
          blockId: '',
          blockInfo: {},
          content: {}
        }
      }
    },
    compare: {
      type: Object,
      default() {
        return {
          blockId: '',
          blockInfo: {},
          content: {},
          articleDiff: []
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    editInfo() {
      return `${moment(this.version.updatedAt).format('YYYY/MM/DD HH:mm')} | ${this.version.author.name}`
    },
    baseBlockTitle() {
      if (this.base && this.base.blockInfo) {
        return this.base.blockInfo.blockTitle
      }
      return ''
    },
    compareBlockTitle() {
      if (this.articleDiff.titleDiff) {
        return this.articleDiff.titleDiff
      }
      return ''
    }
  },
  methods: {
    getLinkNeighborStyle(diff) {
      let result = diff.result
      if (Array.isArray(diff)) {
        result = diff[0]
      }
      switch (result) {
        case -1:
          return {
            backgroundColor: 'rgba(255, 79, 79, 0.3)',
            textDecoration: 'line-through'
          }
        case 1:
          return {
            backgroundColor: 'rgba(26, 225, 91, 0.3)',
            textDecoration: 'none'
          }
        case 0:
        default:
          return {
            backgroundColor: 'none',
            textDecoration: 'none'
          }
      }
    },
    getLinkStyle(diff) {
      return { backgroundColor: diff.result === 1 ? 'rgba(26, 225, 91, 0.3)'
        : diff.result === -1 ? 'rgba(255, 79, 79, 0.3)' : 'none', textDecoration: 'underline' }
    },
    getPlainTextInBlock(blockContent) {
      const content = []
      if (blockContent) {
        blockContent.content.content.forEach(paragraph => {
          if (paragraph.content) {
            const element = {
              type: 'paragraph',
              content: []
            }
            paragraph.content.forEach(t => {
              if (t.marks) {
                element.content.push({
                  type: 'link',
                  marks: t.marks,
                  text: t.text
                })
              } else {
                element.content.push({
                  type: 'text',
                  text: t.text
                })
              }
            })
            content.push(element)
          }
        })
      }
      return content
    },
    getPlainTextInDiff(diffArray) {
      let convertedDiffArray = []
      let tempObj = {
        result: 0,
        content: [] }
      for (const diff of diffArray) {
        if (diff[1] !== undefined) {
          const paragraph = diff[1].split('\n')
          tempObj.result = diff[0]
          for (const p of paragraph) {
            if (p) {
              tempObj.content.push({ result: diff[0], content: p })
            } else {
              convertedDiffArray = convertedDiffArray.concat(tempObj)
              tempObj = {
                result: 0,
                content: [] }
            }
          }
        }
      }
      if (tempObj.content) {
        convertedDiffArray = convertedDiffArray.concat(tempObj)
        tempObj = {
          result: 0,
          content: [] }
      }
      return convertedDiffArray
    },
    decodeText(paragraph) {
      const splitedArray = paragraph.content.split(this.linkContainer)
      const decodedArray = splitedArray.map((t, i) => {
        try {
          return { text: t, result: paragraph.result, ...JSON.parse(t) }
        } catch (error) {
          return { text: t, result: paragraph.result }
        }
      })
      return decodedArray
    },
    isLink(text) {
      if (text.marks && text.marks.some(mark => mark.type === 'link')) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped lang="scss">
span {
  margin: 0;
  padding: 0;
}

.container {
  border-top: 2px solid #E6E6E6;
}

.block-container {
  p {
  margin: 0 0 1rem 0;
  }

  margin-top: 1rem;
}
.header {
  z-index: 2;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  height: 60px;
}
.comparision-result {
  white-space: pre-wrap;
  display: inline;
  word-break: break-all;
}
.fake-margin {
  height: 8px;
}
</style>
