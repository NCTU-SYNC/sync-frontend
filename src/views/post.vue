<template>
  <b-container>
    <b-row>
      <b-col cols="8">
        <b-card>
          <b-form inline>
            <label class="sr-only" for="inline-form-input-name">Name</label>
            <b-input
              id="inline-form-input-name"
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="輸入標題..."
            />

            <label class="sr-only" for="example-datepicker" />
            <b-form-datepicker
              id="example-datepicker"
              v-model="postDateValue"
              class="mb-2 mr-sm-2 mb-sm-0"
              :hide-header="true"
              :locale="zh"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              label-no-date-selected="日期"
              label-help=""
            />

            <label class="sr-only" for="timepicker-lg" />
            <b-form-timepicker
              id="timepicker-lg"
              v-model="postTimeValue"
              class="mb-2 mr-sm-2 mb-sm-0"
              :hour12="false"
              :locale="zh"
              :now-button="true"
              :show-seconds="false"
              :minutes-step="10"
              :no-close-button="true"
              label-now-button="現在時間"
              label-no-time-selected="時間"
              :hide-header="true"
            />
          </b-form>
          <label for="tags-remove-on-delete" />
          <b-form-tags
            v-model="value"
            input-id="tags-remove-on-delete"
            separator=" "
            placeholder="新增標籤"
            remove-on-delete
            duplicate-tag-text="重複的標籤"
          />
          <b-link href="#" class="card-link">作者</b-link>
        </b-card>
        <hr>

        <b-card v-for="block in blocks" :key="block.id">
          <TiptapEditor :key="content" :content="content" />
          <b-row>
            <b-col class="text-center">
              <b-button
                variant="outline-secondary"
                style="border-radius: 100px; margin-bottom: 10px;"
                @click="addBlock"
              >+ 段落</b-button>
            </b-col>
          </b-row>
        </b-card>
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
      blocks: [{ id: 0 }],
      content: 'original content',
      postDateValue: '',
      postTimeValue: ''
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

<style scoped lang="scss">
@import "@/assets/Post/editor.scss";
</style>
