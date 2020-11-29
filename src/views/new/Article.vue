<template>
  <b-container>
    <b-row>
      <b-col
        cols="auto"
        class="mr-auto p-3"
      >
        <b-button
          pill
          variant="outline-secondary"
          @click="$router.back()"
        >
          回上一頁
        </b-button>
      </b-col>
      <b-col
        cols="auto"
        class="p-3"
      >
        <b-button
          pill
          @click="handleEditPostRoute(`${$route.path}/post`)"
        >
          編輯新聞
        </b-button>
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col
        cols="auto"
        class="mr-auto"
      >
        <h1>{{ title }}</h1>
      </b-col>
    </b-row>
    <div class="title-bar">
      <span class="author">{{ author }}</span>
    </div>
    <div class="title-bar">
      <b-link
        v-for="tag in tags"
        :key="tag"
        class="tag"
      >
        #{{ tag }}
      </b-link>
      <span class="author">{{ new Date(createdAt).toLocaleString() }}</span>
    </div>

    <b-img
      src="https://picsum.photos/300/150/?image=41"
      fluid-grow
      alt="Fluid-grow image"
    />
    <br>
    <br>
    <div
      v-for="block in blocks"
      :key="block._id"
    >
      <b-row>
        <b-col
          cols="auto"
          class="mr-auto"
        >
          <h2>{{ block.blockTitle }}</h2>
        </b-col>
        <b-col cols="auto">
          <div class="btn-actions-pane-right actions-icon-btn">
            <b-dropdown
              id="ddown1"
              variant="transparent"
              no-caret
              dropright
              :disabled="!isLogin"
            >
              <template v-slot:button-content>
                <b-icon
                  icon="three-dots"
                  font-scale="1.5"
                /><span class="sr-only">更多</span>
              </template>
              <b-dropdown-item
                :disabled="isEditting"
                @click="handleEditBlockStatusChange(block._id, true, block)"
              >
                {{ isEditting? '已經為編輯狀態': '編輯此段落' }}
              </b-dropdown-item>
              <b-dropdown-item disabled>
                段落歷史
              </b-dropdown-item>
              <b-dropdown-item disabled>
                編輯次數：3
              </b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item disabled>
                編輯者
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-col>
      </b-row>
      <b-card
        border-variant="white"
        no-body
      >
        <editor-content
          class="editor__content"
          :editor="editors[block._id]"
        />
      </b-card>
      <b-row
        v-if="getEditable(block._id)"
        class="p-3 d-block text-right card-footer"
      >
        <b-button
          variant="link"
          @click="handleEditBlockStatusChange(block._id, false, block)"
        >
          取消
        </b-button>
        <b-button
          variant="primary"
          class="ml-2"
          @click="handleSubmitBlock(block._id, block)"
        >
          儲存並發布
        </b-button>
      </b-row>
      <b-row>
        <div class="last-update">
          (最後更新時間：{{ new Date (block.blockDateTime).toLocaleString() }})
        </div>
      </b-row>
      <hr>
    </div>
  </b-container>
</template>

<script>
import { getArticleById, updateArticleById } from '@/api/article'
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem, Placeholder } from 'tiptap-extensions'
import Link from '@/components/Editor/TiptapExtensions/Link'

export default {
  name: 'Article',
  components: {
    EditorContent
  },
  data() {
    return {
      data: null,
      title: '',
      tags: [],
      author: '',
      createdAt: '',
      blocks: [],
      editors: [],
      editableBlocks: [],
      isEditting: false,
      // 當使用者按下取消復原用
      backupBlock: null,
      isLogin: false
    }
  },
  beforeDestroy() {
    this.editors.forEach(editor => editor.destroy())
  },
  created() {
    const articleId = this.$route.params.ArticleID
    getArticleById(articleId).then(response => {
      if (response.data.code === 200) {
        const data = this.data = response.data.data
        this.title = data.title
        this.tags = data.tags
        this.author = data.author
        this.createdAt = data.createdAt
        this.blocks = data.blocks
        this.blocks.forEach(block => {
          this.editors[block._id] = this.createEditor(block.content)
          this.editableBlocks[block._id] = false
        })
      }
    }).catch(err => {
      console.error(err)
    })
    // check if user logged in
    this.isLogin = !!this.$store.getters.token
  },
  methods: {
    createEditor(initializedContent) {
      const editor = new Editor({
        autoFocus: true,
        onInit: () => {
          // editor is initialized
        },
        onUpdate: () => {
          // console.log(state, transaction)
          // console.log(getHTML(), getJSON())
          // console.log(JSON.stringify(getJSON()))
        },
        extensions: [
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new BulletList(),
          new ListItem(),
          new Link(),
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
    },
    getEditable(blockId) {
      return this.editors[blockId] !== undefined ? this.editableBlocks[blockId] : false
    },
    handleEditBlockStatusChange(blockId, value, block) {
      console.log(value)
      this.editors[blockId].setOptions({
        editable: value || false
      })
      this.$set(this.editableBlocks, blockId, value)
      this.isEditting = value
      if (value) {
        this.backupBlock = Object.assign(block)
      } else if (value === false) {
        block = Object.assign(this.backupBlock)
        this.editors[blockId].setContent(block.content)
      }
    },
    handleSubmitBlock(blockId, block) {
      // TODO: 或許需要判定編輯哪個Block，只傳更改的Block到後端
      this.handleEditBlockStatusChange(blockId)
      this.data.id = this.$route.params.ArticleID
      this.data.token = this.$store.getters.token
      // 取代更新Block
      block.content = this.editors[blockId].getJSON()
      updateArticleById(this.data).then((response) => {
        console.log(response)
        if (response.data.code === 200) {
          this.backupBlock = null
          this.$bvModal.msgBoxOk(response.data.message)
            .then(() => {
              const data = this.data = response.data.data
              this.title = data.title
              this.tags = data.tags
              this.author = data.author
              this.createdAt = data.createdAt
              this.blocks = data.blocks
              this.blocks.forEach((block) => {
                if (this.editors[block.id] !== undefined) {
                  this.editors[block.id].setContent(block.content)
                } else { this.editors[block.id] = this.createEditor(block.content) }
                this.editableBlocks[block.id] = false
              })
            })
        } else {
          this.$bvModal.msgBoxOk(response.data.message)
        }
      }).catch((err) => {
        console.error(err)
        this.$bvModal.msgBoxOk(err.data.message)
      })
    },
    handleEditPostRoute(route) {
      if (this.isLogin) { this.$router.push(route) } else { this.$bvModal.msgBoxOk('Please Login First') }
    }
  }
}
</script>

<style scoped lang="scss">
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
