<template>
  <div class="d-flex">
    <div class="time-picker">
      <input
        ref="hour"
        v-model.number="hour"
        type="text"
        placeholder="00"
        pattern="\d{2}"
        min="0"
        max="23"
        :disabled="!enable"
        @keyup="hourFormat"
      >
      <span class="d-flex justify-content-center">:</span>
      <input
        ref="minute"
        v-model.number="min"
        type="number"
        placeholder="00"
        pattern="\d{2}"
        min="0"
        max="59"
        :disabled="!enable"
        @keydown.delete="handleOnDelete"
        @keyup="format"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'SyncTime',
  props: {
    value: {
      type: String,
      default: null
    },
    enable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      hour: null,
      min: null
    }
  },
  watch: {
    hour(newVal, oldVal) {
      if (newVal >= 10 && newVal <= 23) {
        this.$refs.hour.blur()
        this.$refs.minute.focus()
      } else if (newVal > 23) {
        this.hour = 23
        this.$refs.hour.blur()
        this.$refs.minute.focus()
      } else if (newVal > 2 && newVal < 10) {
        this.$refs.hour.blur()
        this.$refs.minute.focus()
      }

      // v-model value
      this.$emit(
        'input',
        (this.hour ? this.hour : '00') + ':' + (this.min ? this.min : '00')
      )
    },
    min(newVal) {
      if (newVal > 59) {
        this.min = 59
      }

      // v-model value
      this.$emit(
        'input',
        (this.hour ? this.hour : '00') + ':' + (this.min ? this.min : '00')
      )
    }
  },
  created() {
    if (this.enable) {
      if (this.value) {
        const timeArr = this.value.split(':')
        this.hour = timeArr[0]
        this.min = timeArr[1]
      }
    }
  },
  methods: {
    hourFormat(e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '')

      if (e.target.value.length === 2) {
        this.$refs.minute.focus()
      }
    },
    format(e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '')
    },
    handleOnDelete(e) {
      if (e.target.value === '' && e.keyCode === 8) {
        this.$refs.hour.focus()
      }
    }
  }
}
</script>

<style lang="scss">
.time-picker {
  display: flex;
  border: 1px solid #dbdce1;
  border-radius: 4px;
  width: 60px;
  padding: 0;

  input {
    font-size: 12px;
    line-height: 20px;
    width: 26px;
    padding: 0 5px;

    &:focus {
      border: 1px solid #6b6d76 !important;
      border-radius: 4px !important;
    }
  }

  * {
    flex: 1;
  }
}

/* remove arrows on number input */
/* Chromium based */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
