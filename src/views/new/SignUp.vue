<template>
  <b-container>
    <b-row
      align-h="center"
      class="mt-2 mt-sm-5"
    >
      <transition
        :name="slide"
        mode="out-in"
        :duration="250"
      >
        <b-col
          v-if="isInFirstPage"
          key="v-first-form"
          xl="5"
          lg="6"
          md="8"
          sm="10"
          cols="12"
        >
          <b-card class="p-sm-3">
            <h1>建立您的帳戶</h1>
            <b-form @submit.stop.prevent="handleSubmit">
              <b-form-group>
                <label
                  for="name"
                  class="mt-3"
                >姓名</label>
                <b-input
                  id="name"
                  v-model="userData.name"
                  :state="validName()"
                  aria-describedby="invalid-name"
                  trim
                  debounce="500"
                  @change="hasChanged.name = true"
                />
                <b-form-invalid-feedback id="invalid-name">
                  請輸入正確的姓名
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group>
                <label
                  for="email"
                >電子郵件</label>
                <b-input
                  id="email"
                  v-model="userData.email"
                  :state="validEmail()"
                  aria-describedby="invalid-email"
                  trim
                  debounce="500"
                  @change="hasChanged.email = true"
                />
                <b-form-invalid-feedback id="invalid-email">
                  請輸入正確的電子郵件
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                description="此資訊不會公開顯示。"
                label="出生日期"
                :state="validBirthday()"
                aria-describedby="invalid-birthday"
              >
                <div class="d-flex justify-content-between form-inline">
                  <label for="birthday-year">年</label>
                  <b-form-select
                    id="birthday-year"
                    v-model="userData.birthday.year"
                    class="mx-sm-1 mb-2 mb-sm-0 birthday-input"
                    :options="birthdayOptions.year"
                    :state="validBirthday()"
                    @change="handleChangeDate('year')"
                  />

                  <label
                    for="birthday-month"
                    class="ml-sm-1"
                  >月</label>
                  <b-form-select
                    id="birthday-month"
                    v-model="userData.birthday.month"
                    class="mx-sm-1 mb-2 mb-sm-0 birthday-input"
                    :options="birthdayOptions.month"
                    :state="validBirthday()"
                    @change="handleChangeDate('month')"
                  />

                  <label
                    for="birthday-day"
                    class="ml-sm-1"
                  >日</label>
                  <b-form-select
                    id="birthday-day"
                    v-model="userData.birthday.day"
                    class="mx-sm-1 mb-2 mb-sm-0 birthday-input"
                    :options="birthdayOptions.day"
                    :state="validBirthday()"
                    @change="handleChangeDate('day')"
                  />
                  <b-form-invalid-feedback
                    id="invalid-birthday"
                    :state="validBirthday()"
                  >
                    請輸入正確的生日
                  </b-form-invalid-feedback>
                </div>
              </b-form-group>

              <b-form-group>
                <label for="gender">性別</label>
                <b-form-radio-group
                  id="gender"
                  v-model="userData.gender"
                  :options="genderOptions"
                  :state="validGender()"
                />
              </b-form-group>
              <div class="d-flex justify-content-end">
                <b-button
                  type="button"
                  variant="primary"
                  @click="handleNextPage"
                >
                  下一步
                </b-button>
              </div>
            </b-form>
          </b-card>
        </b-col>
        <b-col
          v-else
          key="v-second-form"
          xl="5"
          lg="6"
          md="8"
          sm="10"
          cols="10"
        >
          <b-card class="p-3">
            <h1>設定您的密碼</h1>
            <b-form @submit.stop.prevent="handleSubmit">
              <label
                for="password"
                class="mt-3"
              >密碼</label>
              <div class="mb-2 mb-sm-0 form-inline">
                <b-input
                  id="password"
                  v-model="password"
                  class="flex-grow-1"
                  :state="validPassword()"
                  aria-describedby="invalid-password"
                  placeholder="密碼需包含大小寫英數字8碼以上"
                  :type="togglePeerPasswordInput"
                  trim
                  debounce="500"
                  @change="hasChanged.password = true"
                />
                <b-button
                  class="btn-icon btn-icon-only"
                  variant="outer-link"
                  @click="isPeerPassword = !isPeerPassword"
                >
                  <b-icon :icon="togglePeerPasswordIcon" />
                </b-button>
                <b-form-invalid-feedback id="invalid-password">
                  密碼需包含大小寫英數字8碼以上
                </b-form-invalid-feedback>
              </div>
              <label
                for="repeat-password"
                class="mt-3"
              >密碼確認</label>
              <div class="mb-2 mb-sm-0 form-inline">
                <b-input
                  id="repeat-password"
                  v-model="repeatPassword"
                  class="flex-grow-1"
                  :state="validRepeatPassword()"
                  aria-describedby="invalid-confirmPassword"
                  placeholder="請再次輸入您的密碼"
                  :type="togglePeerPasswordInput"
                  trim
                  debounce="500"
                  @change="hasChanged.repeatPassword = true"
                />
                <b-button
                  class="btn-icon btn-icon-only"
                  variant="outer-link"
                  @click="isPeerPassword = !isPeerPassword"
                >
                  <b-icon :icon="togglePeerPasswordIcon" />
                </b-button>
                <b-form-invalid-feedback id="invalid-confirmPassword">
                  確認密碼與密碼不相符
                </b-form-invalid-feedback>
              </div>

              <div class="d-flex justify-content-between mt-4">
                <b-button
                  variant="transparent"
                  @click="isInFirstPage = true"
                >
                  返回
                </b-button>
                <b-button
                  type="button"
                  variant="primary"
                  @click="handleSubmit"
                >
                  註冊
                </b-button>
              </div>
            </b-form>
          </b-card>
        </b-col>
      </transition>
    </b-row>
  </b-container>
</template>

<script>
import firebase from '@/utils/firebase'
import moment from 'moment'

export default {
  name: 'SignUp',
  data() {
    return {
      auth: null,
      userData: {
        name: '',
        email: '',
        birthday: {
          year: '',
          month: '',
          day: ''
        },
        gender: ''
      },
      password: '',
      repeatPassword: '',
      birthdayOptions: {
        year: [],
        month: [],
        day: []
      },
      genderOptions: ['男', '女', '不透露'],
      hasChanged: {
        name: false,
        email: false,
        birthday: false,
        gender: false,
        password: false,
        repeatPassword: false
      },
      validations: {
        name: false,
        email: false,
        birthday: false,
        gender: false
      },
      isInFirstPage: true,
      isPeerPassword: false,
      redirect: undefined
    }
  },
  computed: {
    togglePeerPasswordIcon() {
      return `eye${this.isPeerPassword ? '' : '-slash'}`
    },
    togglePeerPasswordInput() {
      return `${this.isPeerPassword ? 'text' : 'password'}`
    },
    slide() {
      return this.isInFirstPage ? 'slide-right' : 'slide-left'
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
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
      const date = this.userData.birthday
      const valid = this.validBirthday()
      if (valid !== true) {
        if (changedField === 'year') {
          date.month = ''
        } else if (changedField === 'month') {
          date.day = ''
        }
      }
      const days = this.getDaysInMonth(date.month, date.year)
      this.birthdayOptions.day = Array.from(Array(days), (_, i) => i + 1)
    },
    validName() {
      this.validations.name = this.userData.name.length >= 2
      return this.hasChanged.name ? this.validations.name : null
    },
    validEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      this.validations.email = re.test(this.userData.email)
      return this.hasChanged.email ? this.validations.email : null
    },
    validGender() {
      this.validations.gender = (this.userData.gender !== '')
      return this.hasChanged.gender ? this.validations.gender : null
    },
    validPassword() {
      const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
      return this.hasChanged.password ? re.test(this.password) : null
    },
    validRepeatPassword() {
      return this.hasChanged.repeatPassword ? this.password === this.repeatPassword && this.repeatPassword.length > 0 : null
    },
    validBirthday() {
      const date = this.userData.birthday
      const d = moment(`${date.year}-${date.month}-${date.day}`, 'YYYY-M-D', true)
      this.validations.birthday = d.isValid()
      return this.hasChanged.birthday ? this.validations.birthday : null
    },
    getDaysInMonth(month, year) {
      return new Date(year, month, 0).getDate()
    },
    handleNextPage() {
      this.hasChanged.name = true
      this.hasChanged.email = true
      this.hasChanged.birthday = true
      this.hasChanged.gender = true

      /* Not support IE :(
      if (Object.keys(this.validations).every((key) => {
        return this.validations[key]
      })) {
        this.isInFirstPage = true
      } */

      let validationResult = true
      for (const v in this.validations) {
        if (!this.validations[v]) {
          validationResult = false
          break
        }
      }
      this.isInFirstPage = !validationResult
    },
    async handleSignup() {
      try {
        await firebase.handleSignup(this.userData.email, this.password, this.userData.name)
        this.$router.push({ path: this.redirect || '/' })
      } catch (error) {
        console.error(error)
        this.$bvModal.msgBoxOk(error.message)
      }
    },
    handleSubmit() {
      this.hasChanged.password = true
      this.hasChanged.repeatPassword = true
      if (this.validPassword() && this.validRepeatPassword()) {
        this.handleSignup()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-select {
  min-width: 25%;
}
</style>
