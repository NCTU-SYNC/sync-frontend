<template>
  <b-container>
    <b-row>
      <b-col sm="auto" class="mr-auto p-3">
        <b-button pill variant="outline-secondary" @click="$router.back()">回上一頁</b-button>
      </b-col>
      <b-col sm="6" />
      <b-col sm="auto" class="p-3">
        <b-button
          pill
          :to="`${$route.path}/Post`"
        >編輯新聞</b-button>
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col cols="auto" class="mr-auto">
        <h1>{{ title }}</h1>
      </b-col>
      <b-col cols="auto">
        <b-button variant="outline-secondary">編輯</b-button>
      </b-col>
    </b-row>
    <div class="title-bar">
      <span class="author">{{ author }}</span>
    </div>
    <div class="title-bar">
      <b-link v-for="tag in tags" :key="tag" class="tag">#{{ tag }}
      </b-link>
      <span class="author">{{ createdAt.toLocaleString() }}</span>
    </div>

    <b-img src="https://picsum.photos/300/150/?image=41" fluid-grow alt="Fluid-grow image" />
    <div v-for="block in blocks" :key="block.id">
      <b-card border-variant="white">
        <editor-content class="editor__content" :editor="editors[block.id]" />
      </b-card>
      <b-row>
        <div class="last-update">(最後更新時間：2020年4月19日 14:00)</div>
      </b-row>
      <hr>
    </div>

  </b-container>
</template>

<script>
import { getArticleById } from '@/api/article'
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Placeholder } from 'tiptap-extensions'
export default {
  name: 'Article',
  components: {
    EditorContent
  },
  data() {
    return {
      title: '紙媒只是起點',
      tags: ['台灣', '口罩', 'WHO'],
      author: 'Tim Chang',
      createdAt: '2020年5月20日 上午5:00',
      blocks: [{ id: 0, content: { 'type': 'doc', 'content': [{ 'type': 'heading', 'attrs': { 'level': 2 }, 'content': [{ 'type': 'text', 'text': 'Hi there,' }] }, { 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'this is a very ' }, { 'type': 'text', 'marks': [{ 'type': 'italic' }], 'text': 'basic' }, { 'type': 'text', 'text': ' example of tiptap.' }] }, { 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'body { display: none; }' }] }, { 'type': 'bullet_list', 'content': [{ 'type': 'list_item', 'content': [{ 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'A regular list' }] }] }, { 'type': 'list_item', 'content': [{ 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': 'With regular items' }] }] }] }, { 'type': 'paragraph', 'content': [{ 'type': 'text', 'text': " It's amazing 👏 – mom" }] }] }}],
      editors: []
    }
  },
  beforeDestroy() {
    this.editors.forEach(editor => editor.destroy())
  },
  created() {
    getArticleById().then(response => {
      if (response.code === 200) {
        const data = response.data
        this.title = data.title
        this.tags = data.tags
        this.author = data.author
        this.publishedTime = data.publishedTime
        this.blocks = data.blocks
        this.blocks.forEach(block => {
          this.editors[block.id] = this.createEditor(block.content)
        })
      }
    }).catch(err => {
      console.error(err)
    }
    )
    this.blocks.forEach(block => {
      this.editors[block.id] = this.createEditor(block.content)
    })
  },
  methods: {
    createEditor(initializedContent) {
      const editor = new Editor({
        autoFocus: true,
        onInit: () => {
          // editor is initialized
        },
        onUpdate: ({ state, getHTML, getJSON, transaction }) => {
          // console.log(state, transaction)
          console.log(getHTML(), getJSON())
          console.log(JSON.stringify(getJSON()))
        },
        extensions: [
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new BulletList(),
          new ListItem(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: '輸入內文...',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          })
        ],
        content: initializedContent,
        editable: false
      })
      return editor
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/Article/main";
  .reference {
    color: gray;
    text-decoration-line: underline;
  }
  ul {
    padding-inline-start: 0;
    list-style: none;
  }
  p {
    padding: 2rem 0;
  }
  hr {
    padding-bottom: 1rem;
  }
  .last-update {
    margin: auto;
    color: gray;
  }
  .title-bar {
    display: flex;
  }
  .author {
    display: inline-block;
    margin-left: auto !important;
    color: gray;
  }
  .tag {
    display: inline-block;
    padding: 0.5rem;
    color: gray;
  }
</style>
