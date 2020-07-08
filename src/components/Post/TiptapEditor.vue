<template>
  <div style="margin: 20px;">
    <b-form inline>
      <label class="sr-only" for="inline-form-input-name">Name</label>
      <b-input
        id="inline-form-input-name"
        v-model="title"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder=" 輸入標題..."
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
        v-model="time"
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

    <b-row class="my-2">
      <b-col cols="12" class="editor">
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
                :pressed.sync="buttonsToggledState.ul"
                @click="commands.bullet_list"
              >
                ul
              </b-button>
            </b-col>
          </b-row>
        </editor-menu-bar>
      </b-col>

      <b-col cols="12">
        <hr>
        <br>
        <editor-content class="editor__content" :editor="editor" />
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
      title: '',
      time: '',
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
            Hi there,
          </h2>
          <p>
            this is a very <em>basic</em> example of tiptap.
          </p>
          <pre><code>body { display: none; }</code></pre>
          <ul>
            <li>
              A regular list
            </li>
            <li>
              With regular items
            </li>
          </ul>
          <blockquote>
            It's amazing 👏
            <br />
            – mom
          </blockquote>
        `
      }),
      buttonsToggledState: {
        Bold: false,
        Italic: false,
        Strike: false,
        Underline: false,
        H1: false,
        H2: false,
        H3: false,
        ul: false
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/Post/main";
</style>
