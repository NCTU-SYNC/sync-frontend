<template>
  <div>
    <b-card
      tag="article"
      style="max-width: 80rem;"
    >
      <b-row class="my-1">
        <b-col sm="10">
          <b-form-input v-model="title" placeholder="Title..." />
        </b-col>
        <b-col sm="2">
          <b-form-input v-model="time" placeholder="Time" />
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col>
          <b-button variant="outline-secondary">大標題</b-button>
        </b-col>
        <b-col>
          <b-button variant="outline-secondary">副標題</b-button>
        </b-col>
        <b-col>
          <b-button variant="outline-secondary">內文</b-button>
        </b-col>
        <b-col>
          <b-button variant="outline-secondary" @click="handleBold"><b>B</b></b-button>
        </b-col>
        <b-col>
          <b-button variant="outline-secondary" @click="handleUnderline"><u>T</u></b-button>
        </b-col>
        <b-col>
          <b-button variant="outline-secondary" @click="handleStrikeThrough"><s>S</s></b-button>
        </b-col>
      </b-row>
      <p
        class="edit-container"
        contenteditable
        @input="onInput"
      >
        {{ content }}
      </p>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'EditPage',
  data() {
    return {
      title: '',
      time: '',
      content: ''
    }
  },
  methods: {
    onInput(e) {
      console.log(e.target.innerText)
    },
    handleBold() {
      document.execCommand('bold')
    },
    handleUnderline() {
      document.execCommand('underline')
    },
    handleStrikeThrough() {
      document.execCommand('strikeThrough')
    }
  }
}
</script>

<style scoped>
.edit-container {
  margin-top: 20px;
  border: 2px solid rgb(199, 193, 193);
  height: 500px;
}
</style>
