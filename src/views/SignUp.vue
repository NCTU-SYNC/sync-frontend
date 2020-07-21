<template>
  <b-container>
    <b-row
      align-h="center"
      class="mt-5"
    >
      <b-col xl="5" lg="6" md="8" sm="10" cols="10">
        <b-card class="p-3">
          <h1>建立帳戶</h1>
          <b-form @submit.stop.prevent="onSubmit">
            <label
              for="name"
              class="mt-3"
            >姓名</label>
            <b-input id="name" v-model="name" type="email" :state="validName" aria-describedby="invalid-name" trim debounce="500" @change="hasChanged.name = true" />
            <b-form-invalid-feedback id="invalid-name">
              請輸入正確的姓名
            </b-form-invalid-feedback>
            <label
              for="email"
              class="mt-3"
            >電子郵件</label>
            <b-input id="email" v-model="email" :state="validEmail" trim debounce="500" @change="hasChanged.email = true" />
            <b-form-invalid-feedback :state="validEmail">
              請輸入正確的電子郵件
            </b-form-invalid-feedback>
            <b-form-group
              description="此資訊不會公開顯示。"
              label="出生日期"
              class="mt-3"
              :state="validEmail"
            >
              <b-form inline class="d-flex justify-content-between">
                <label for="birthday-year">年</label>
                <b-form-select
                  id="birthday-year"
                  v-model="birthday.year"
                  class="mx-sm-1 mb-2 mb-sm-0 birthday-input"
                  :options="birthdayOptions.year"
                  :state="validBirthday(birthday)"
                  @change="handleChangeDate('year')"
                />

                <label for="birthday-month" class="ml-sm-1">月</label>
                <b-form-select
                  id="birthday-month"
                  v-model="birthday.month"
                  class="mx-sm-1 mb-2 mb-sm-0 birthday-input"
                  :options="birthdayOptions.month"
                  :state="validBirthday(birthday)"
                  @change="handleChangeDate('month')"
                />

                <label for="birthday-day" class="ml-sm-1">日</label>
                <b-form-select
                  id="birthday-day"
                  v-model="birthday.day"
                  class="mx-sm-1 mb-2 mb-sm-0 birthday-input"
                  :options="birthdayOptions.day"
                  :state="validBirthday(birthday)"
                  @change="handleChangeDate('day')"
                />
                <b-form-invalid-feedback :state="validBirthday(birthday)">
                  請輸入正確的生日
                </b-form-invalid-feedback>
              </b-form>
            </b-form-group>

          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment'

export default {
  name: 'SignUp',
  data() {
    return {
      name: '',
      email: '',
      birthday: {
        year: '',
        month: '',
        day: ''
      },
      birthdayOptions: {
        year: [],
        month: [],
        day: []
      },
      hasChanged: {
        name: false,
        email: false,
        birthday: false
      }
    }
  },
  computed: {
    validName() {
      return this.hasChanged.name ? this.name.length >= 2 : null
    },
    validEmail() {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return this.hasChanged.email ? re.test(this.email) : null
    }
  },
  created() {
    const d = new Date()
    this.birthdayOptions.year = Array.from(Array(d.getFullYear() - 1899), (_, i) => i + 1900).reverse()
    this.birthdayOptions.month = Array.from(Array(12), (_, i) => i + 1)
    this.birthdayOptions.day = Array.from(Array(31), (_, i) => i + 1)
  },
  methods: {
    handleChangeDate(changedField) {
      this.hasChanged.birthday = true
      const valid = this.validBirthday()
      if (valid !== true) {
        if (changedField === 'year') {
          this.birthday.month = ''
        } else if (changedField === 'month') {
          this.birthday.day = ''
        }
      }
      const days = this.getDaysInMonth(this.birthday.month, this.birthday.year)
      this.birthdayOptions.day = Array.from(Array(days), (_, i) => i + 1)
    },
    validBirthday() {
      const d = moment(`${this.birthday.year}-${this.birthday.month}-${this.birthday.day}`, `YYYY-M-D`, true)
      return this.hasChanged.birthday ? d.isValid() : null
    },
    getDaysInMonth(month, year) {
      return new Date(year, month, 0).getDate()
    },
    onSubmit() {
      alert('Form submitted!')
    }
  }
}
</script>

<style  lang="scss" scoped>
.custom-select {
  min-width: 25%;
}
</style>
