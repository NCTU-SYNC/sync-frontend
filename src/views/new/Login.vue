<template>
  <b-container>
    <b-row
      align-h="center"
      class="mt-5"
    >
      <b-col
        xl="5"
        lg="6"
        md="8"
        sm="10"
        cols="10"
      >
        <b-card class="p-3">
          <div>
            <h1 class="title text-center">
              SYNC
            </h1>
            <p class="text-center">
              同步新聞資訊
            </p>
          </div>
          <transition
            name="fade"
            mode="out-in"
            :duration="500"
          >
            <div
              v-if="isInChooseMethod"
              key="v-choose-form"
            >
              <br>
              <b-button
                block
                pill
                variant="primary"
                class="mt-3"
                to="/signup"
              >
                註冊帳號
              </b-button>
              <b-button
                block
                pill
                variant="light"
                class="mt-3"
                @click="isInChooseMethod=false"
              >
                登入
              </b-button>
              <p class="text-center mt-3">
                或以其他方式登入
              </p>
              <b-button
                block
                pill
                variant="dark"
                class="mt-3"
                @click="loginWithGoogle"
              >
                Google
              </b-button>
            </div>
            <div
              v-else
              key="v-login-form"
            >
              <b-form
                v-if="show"
                @submit="onSubmit"
                @reset="onReset"
              >
                <b-form-group
                  id="login-input-email"
                  label-for="email"
                >
                  <b-form-input
                    id="email"
                    v-model="email"
                    required
                    placeholder="電子郵件 Email"
                  />
                </b-form-group>

                <b-form-group
                  id="login-input-password"
                  label-for="password"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                    placeholder="請輸入密碼"
                  />
                </b-form-group>
                <b-alert
                  :show="errorMessage.length !== 0"
                  variant="danger"
                >
                  {{ errorMessage }}
                </b-alert>
                <b-button
                  type="submit"
                  variant="primary"
                  pill
                  block
                >
                  登入
                </b-button>
                <div class="d-flex justify-content-end">
                  <b-link style="">
                    忘記密碼
                  </b-link>
                </div>
                <hr>
                <b-button
                  block
                  pill
                  variant="dark"
                  @click="loginWithGoogle"
                >
                  以 Google 繼續
                </b-button>
              </b-form>
            </div>
          </transition>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import firebase from '@/utils/firebase'

export default {
  name: 'Login',
  data() {
    return {
      auth: null,
      isInChooseMethod: true,
      errorMessage: '',
      email: '',
      password: '',
      show: true,
      redirect: undefined
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
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.handleLogin()
    },
    onReset(evt) {
      evt.preventDefault()
      this.email = ''
      this.password = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    async handleLogin() {
      try {
        await firebase.handleLogin(this.email, this.password)
        this.$router.push({ path: this.redirect || '/' })
      } catch (error) {
        console.error(error)
        this.$bvModal.msgBoxOk(error.message)
      }
    },
    async loginWithGoogle() {
      try {
        await firebase.loginWithGoogle()
        this.$router.push({ path: this.redirect || '/' })
      } catch (error) {
        console.error(error)
        this.$bvModal.msgBoxOk(error.message)
      }
    }
  }
}
</script>

<style scoped>
.title {
  color: #ff7865;
  text-shadow: 1px 2px 3px #666;
}
.text-center {
  text-align:center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
