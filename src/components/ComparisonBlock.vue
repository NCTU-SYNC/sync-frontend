<template>
  <b-container fluid="xl" class="container">
    <b-row>
      <b-col cols="12" class="header d-flex justify-content-between align-items-center">
        2020/12/29  18:27 | CindyLin
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
          <b-col cols="12"><b-row
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
          </b-row></b-col>
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
          editors: {}
        }
      }
    }
  },
  data() {
    return {
    }
  },
  watch: {
    version: function(newValue) {
      console.log(newValue)
    }
  },
  methods: {

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
</style>
