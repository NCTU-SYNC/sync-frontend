<template>
  <b-container fluid="xl" class="container">
    <b-row>
      <b-col cols="12" class="header d-flex justify-content-between align-items-center">
        {{ editInfo }}
      </b-col>
    </b-row>
    <b-row class="pt-5 article-container mx-1">
      <b-col cols="12">
        <b-row>
          <b-col>
            <h2>{{ version.title }}</h2>
          </b-col>
        </b-row>
        <b-row class="border-bottom mb-4">
          <b-col v-if="isDiff" cols="12">
            <b-row v-for="block in articleDiff" :key="JSON.stringify(block)" class="py-3">
              <b-col cols="12">
                <h3
                  v-for="diff in block.titleDiff"
                  :key="JSON.stringify(diff)"
                  class="comparision-result text-primary"
                  :style="{ backgroundColor: diff[0] === 1 ? 'rgba(26, 225, 91, 0.3)'
                    : diff[0] === -1 ? 'rgba(255, 79, 79, 0.3)' : 'none', textDecoration: diff[0] === -1 ? 'line-through' : 'initial'}"
                >{{ diff[1] }}</h3>
                <div class="fake-margin" />
                <div
                  v-for="diff in block.contentDiff"
                  :key="JSON.stringify(diff)"
                  class="comparision-result"
                >
                  <div
                    v-if="diff[1].includes(linkContainer)"
                    class="comparision-result"
                    :style="getLinkNeighborStyle(diff)"
                  >{{ diff[1].split(linkContainer)[0] }}</div>
                  <div
                    v-if="diff[1].includes(linkContainer)"
                    class="comparision-result"
                    :style="getLinkStyle(diff)"
                  >{{ diff[1].split(linkContainer)[1] }}</div>
                  <div
                    v-if="diff[1].includes(linkContainer)"
                    class="comparision-result"
                    :style="getLinkNeighborStyle(diff)"
                  >{{ diff[1].split(linkContainer)[2] }}</div>
                  <div
                    v-else
                    class="comparision-result"
                    :style="{ backgroundColor: diff[0] === 1 ? 'rgba(26, 225, 91, 0.3)'
                      : diff[0] === -1 ? 'rgba(255, 79, 79, 0.3)' : 'none', textDecoration: diff[0] === -1 ? 'line-through' : 'initial'}"
                  >{{ diff[1] }}</div>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col v-else cols="12">
            <b-row
              v-for="(block, index) in version.blocks"
              :key="index"
              class="py-3"
            >
              <b-col>
                <div class="d-flex justify-content-between">
                  <h3 class="text-primary">
                    {{ block.blockInfo.blockTitle }}
                  </h3>
                </div>
                <b-card
                  border-variant="white"
                  no-body
                >
                  <editor-content
                    class="editor__content"
                    :editor="version.editors[block.blockId]"
                  />
                </b-card>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="mb-5">
          <b-col cols="12">
            <h3>新聞來源</h3>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { EditorContent } from 'tiptap'
import moment from 'moment'

export default {
  name: 'ComparisonBlock',
  components: {
    EditorContent
  },
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
      type: Array,
      default() {
        return []
      }
    },
    linkContainer: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    editInfo() {
      return `${moment(this.version.updatedAt).format('YYYY/MM/DD HH:mm')} | ${this.version.author.name}`
    }
  },
  methods: {
    getLinkNeighborStyle(diff) {
      return { backgroundColor: diff[0] === 1 ? 'rgba(26, 225, 91, 0.3)'
        : diff[0] === -1 ? 'rgba(255, 79, 79, 0.3)' : 'none', textDecoration: 'initial' }
    },
    getLinkStyle(diff) {
      return { backgroundColor: diff[0] === 1 ? 'rgba(26, 225, 91, 0.3)'
        : diff[0] === -1 ? 'rgba(255, 79, 79, 0.3)' : 'none', textDecoration: 'underline' }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  border-top: 2px solid #E6E6E6;
}
.article-container {
  overflow: scroll;
  height: 58vh;
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
