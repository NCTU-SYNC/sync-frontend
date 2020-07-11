<template>
  <b-container>
    <b-row>
      <b-col cols="8">
        <b-card>
          <b-form inline>
            <label class="sr-only" for="post-title">標題</label>
            <b-input
              id="post-title"
              v-model="postTitle"
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="輸入標題..."
            />

            <label class="sr-only" for="post-datepicker" />
            <b-form-datepicker
              id="post-datepicker"
              v-model="postDateValue"
              class="mb-2 mr-sm-2 mb-sm-0"
              :hide-header="true"
              locale="zh"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              label-no-date-selected="日期"
              label-help=""
            />

            <label class="sr-only" for="post-timepicker" />
            <b-form-timepicker
              id="post-timepicker"
              v-model="postTimeValue"
              class="mb-2 mr-sm-2 mb-sm-0"
              :hour12="false"
              locale="zh"
              :now-button="true"
              :show-seconds="false"
              :minutes-step="10"
              :no-close-button="true"
              label-now-button="現在時間"
              label-no-time-selected="時間"
              :hide-header="true"
            />
          </b-form>
          <label for="post-tags" />
          <b-form-tags
            v-model="postTags"
            input-id="post-tags"
            separator=" "
            placeholder="新增標籤"
            remove-on-delete
            duplicate-tag-text="重複的標籤"
          />
          <b-link href="#" class="card-link">作者</b-link>
        </b-card>
        <hr>
        <div v-for="block in blocks" :key="block.id">
          <b-card>
            <TiptapEditor :content.sync="block.content" />
          </b-card>
          <hr>
          <b-row>
            <b-col class="text-center">
              <b-button
                variant="outline-secondary"
                style="border-radius: 100px; margin-bottom: 10px;"
                @click="handleAddBlack"
              >+ 段落</b-button>
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
      </b-col>
      <b-col cols="4">
        <NewsPanel @importNews="importNews" />
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import TiptapEditor from '@/components/Post/TiptapEditor'
import NewsPanel from './NewsPanel'
export default {
  name: 'Post',
  components: {
    TiptapEditor,
    NewsPanel
  },
  data() {
    return {
      blocks: [{ id: 0, content: { 'type': 'doc', 'content': [{ 'type': 'heading', 'attrs': { 'level': 2 }, 'content': [{ 'type': 'text', 'text': 'Hi there,' }] }, { 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'this is a very ' }, { 'type': 'text', 'marks': [{ 'type': 'italic' }], 'text': 'basic' }, { 'type': 'text', 'text': ' example of tiptap.' }] }, { 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'body { display: none; }' }] }, { 'type': 'bullet_list', 'content': [{ 'type': 'list_item', 'content': [{ 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'A regular list' }] }] }, { 'type': 'list_item', 'content': [{ 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'With regular items' }] }] }] }, { 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': " It's amazing 👏 – mom" }] }] }}],
      postTitle: '',
      postDateValue: '',
      postTimeValue: '',
      postTags: []
    }
  },
  methods: {
    handleAddBlack() {
      this.blocks.push({
        id: this.blocks[this.blocks.length - 1].id + 1,
        content: null
      })
    },
    importNews(content) {
      this.content = content
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/Post/editor.scss";
</style>
