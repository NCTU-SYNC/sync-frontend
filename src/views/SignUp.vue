<template>
  <b-container>
    <b-row
      align-h="center"
      class="mt-5"
    >
      <transition
        :name="slide"
        mode="out-in"
        :duration="250"
      >
        <b-col v-if="isInFirstPage" key="v-first-form" xl="5" lg="6" md="8" sm="10" cols="10">

          <b-card class="p-3">
            <h1>建立您的帳戶</h1>
            <b-form @submit.stop.prevent="onSubmit">
              <label
                for="name"
                class="mt-3"
              >姓名</label>
              <b-input
                id="name"
                v-model="name"
                type="email"
                :state="validName"
                aria-describedby="invalid-name"
                trim
                debounce="500"
                @change="hasChanged.name = true"
              />
              <b-form-invalid-feedback id="invalid-name">
                請輸入正確的姓名
              </b-form-invalid-feedback>
              <label
                for="email"
                class="mt-3"
              >電子郵件</label>
              <b-input
                id="email"
                v-model="email"
                :state="validEmail"
                aria-describedby="invalid-email"
                trim
                debounce="500"
                @change="hasChanged.email = true"
              />
              <b-form-invalid-feedback id="invalid-email">
                請輸入正確的電子郵件
              </b-form-invalid-feedback>
              <b-form-group
                description="此資訊不會公開顯示。"
                label="出生日期"
                class="mt-3"
                :state="validEmail"
                aria-describedby="invalid-birthday"
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
                  <b-form-invalid-feedback id="invalid-birthday">
                    請輸入正確的生日
                  </b-form-invalid-feedback>
                </b-form>
              </b-form-group>
              <b-form-group>
                <label for="gender">性別</label>
                <b-form-radio-group
                  id="gender"
                  v-model="gender"
                  :options="genderOptions"
                />
              </b-form-group>
              <div class="d-flex justify-content-end">
                <b-button variant="primary" @click="isInFirstPage = false">下一步</b-button>
              </div>
            </b-form>
          </b-card>
        </b-col>
        <b-col v-else key="v-second-form" xl="5" lg="6" md="8" sm="10" cols="10">
          <b-card class="p-3">
            <h1>設定您的密碼</h1>
            <b-form @submit.stop.prevent="onSubmit">
              <label
                for="password"
                class="mt-3"
              >密碼</label>
              <b-input
                id="password"
                v-model="password"
                type="password"
                trim
                debounce="500"
              />
              <label
                for="confirm-password"
                class="mt-3"
              >確認</label>
              <b-input
                id="confirm-password"
                v-model="password"
                type="password"
                trim
                debounce="500"
              />
              <div class="d-flex justify-content-between mt-4">
                <b-button variant="transparent" @click="isInFirstPage = true">返回</b-button>
                <b-button variant="primary">註冊</b-button>
              </div>
            </b-form>
          </b-card>
        </b-col>
      </transition>
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
      gender: '',
      password: '',
      birthdayOptions: {
        year: [],
        month: [],
        day: []
      },
      genderOptions: ['男', '女', '不透露'],
      hasChanged: {
        name: false,
        email: false,
        birthday: false
      },
      isInFirstPage: true
    }
  },
  computed: {
    validName() {
      return this.hasChanged.name ? this.name.length >= 2 : null
    },
    validEmail() {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return this.hasChanged.email ? re.test(this.email) : null
    },
    slide() {
      return this.isInFirstPage ? 'slide-right' : 'slide-left'
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

<style lang="scss" scoped>
.custom-select {
  min-width: 25%;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.25s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
