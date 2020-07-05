<template>
  <div style="margin: 20px;">
    <b-row class="my-1">
      <b-col sm="10">
        <b-form-input v-model="title" placeholder="Title..." />
      </b-col>
      <b-col sm="2">
        <b-form-input v-model="time" placeholder="Time" />
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="6">
        <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
          <b-row class="my-1">
            <b-col>
              <!-- use :pressed.sync="buttonsToggledState.Bold" to make a toggle button -->
              <b-button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.bold() }"
                :pressed.sync="buttonsToggledState.Bold"
                @click="commands.bold"
              >
                <b>B</b>
              </b-button>
            </b-col>
            <b-col>
              <b-button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.italic() }"
                @click="commands.italic"
              >
                <i>I</i>
              </b-button>
            </b-col>
            <b-col>
              <b-button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.strike() }"
                @click="commands.strike"
              >
                <s>S</s>
              </b-button>
            </b-col>
            <b-col>
              <b-button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.underline() }"
                @click="commands.underline"
              >
                <u>T</u>
              </b-button>
            </b-col>
            <b-col>
              <b-button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })"
              >H1</b-button>
            </b-col>
            <b-col>
              <b-button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })"
              >H2</b-button>
            </b-col>
            <b-col>
              <b-button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                @click="commands.heading({ level: 3 })"
              >H3</b-button>
            </b-col>
            <b-col>
              <b-button
                variant="outline-secondary"
                class="menubar__button"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                ul
              </b-button>
            </b-col>
          </b-row>
        </editor-menu-bar>
      </b-col>
      <b-col sm="12">
        <editor-content
          class="editor__content"
          :editor="editor"
          style="border: 1px solid rgb(20, 20, 20); margin-top: 20px;"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Heading, Bold, Italic, Strike, Underline, BulletList, ListItem } from 'tiptap-extensions'

export default {
  name: 'TiptapEditPage',
  components: {
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new BulletList(),
          new ListItem()
        ],
        content: `
          <h2>
            Test
          </h2>
          <p>
            simple demo
          </p>
        `
      }),
      buttonsToggledState: {
        Bold: false,
        Italic: false,
        Strike: false,
        Underline: false,
        H1: false,
        H2: false,
        H3: false
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style>
</style>
