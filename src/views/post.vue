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
      </b-col>
      <b-col cols="4" />
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: 'Post',
  data() {
    return {
      postDateValue: '',
      postTimeValue: ''
    }
  },
  created() {

  }
}
</script>
