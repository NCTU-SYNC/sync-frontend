<template>
  <div class="container">
    <div style="width: 70%">
      <div v-for="block in blocks" :key="block.id" style="border: 1px solid #d8e3db;">
        <TiptapEditor :key="content" :content="content" />
        <b-row>
          <b-col class="text-center">
            <b-button
              variant="outline-secondary"
              style="border-radius: 100px; margin-bottom: 10px;"
              @click="addBlock"
            >+段落</b-button>
          </b-col>
        </b-row>
      </div>
      <div style="margin: 20px;">
        <b-row align-h="between">
          <b-col sm="2">
            <b-button>發布</b-button>
          </b-col>
          <b-col sm="2">
            <b-button>儲存</b-button>
          </b-col>
        </b-row>
      </div>
    </div>
    <div style="width: 30%">
      <NewsPanel @importNews="importNews" />
    </div>
  </div>
</template>

<script>
import TiptapEditor from './TiptapEditor'
import NewsPanel from './NewsPanel'
export default {
  name: 'EditPage',
  components: {
    TiptapEditor,
    NewsPanel
  },
  data() {
    return {
      blocks: [{ id: 0 }],
      content: 'original content'
    }
  },
  methods: {
    addBlock() {
      this.blocks.push({
        id: this.blocks[this.blocks.length - 1].id + 1
      })
    },
    importNews(content) {
      this.content = content
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}
</style>
