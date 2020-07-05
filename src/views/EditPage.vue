<template>
  <div>
    <div v-for="block in blocks" :key="block.id">
      <TiptapEditor />
      <b-row>
        <b-col class="text-center">
          <b-button
            variant="outline-secondary"
            style="border-radius: 100px;"
            @click="addBlock"
          >+段落</b-button>
        </b-col>
      </b-row>
    </div>
    <div style="margin: 20px;">
      <b-row align-h="between">
        <b-col sm="1">
          <b-button>發布</b-button>
        </b-col>
        <b-col sm="1">
          <b-button>儲存</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import TiptapEditor from './TiptapEditor'
export default {
  components: {
    TiptapEditor
  },
  data() {
    return {
      blocks: [{ id: 0 }]
    }
  },
  methods: {
    addBlock() {
      this.blocks.push({
        id: this.blocks[this.blocks.length - 1].id + 1
      })
    }
  }
}
</script>

<style>

</style>
