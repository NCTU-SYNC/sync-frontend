<template>
  <b-container>
    <b-row
      align-h="center"
      class="mt-5"
    >
      <b-col xl="5" lg="6" md="8" sm="10" cols="10">
        <b-card class="p-3">
          <div><h1 class="title text-center">SYNC</h1>
            <p class="text-center">同步新聞資訊</p></div>
          <transition
            name="fade"
            mode="out-in"
            :duration="500"
          >
            <div v-if="isInChooseMethod" key="v-choose-form"><br>
              <b-button block pill variant="primary" class="mt-3">註冊帳號</b-button>
              <b-button block pill variant="light" class="mt-3" @click="isInChooseMethod=false">登入</b-button>
              <p class="text-center mt-3">或以其他方式登入</p>
              <b-button block pill variant="dark" class="mt-3">Google</b-button>
            </div>
            <div v-else key="v-login-form">
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
                    v-model="form.email"
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
                    v-model="form.password"
                    type="password"
                    required
                    placeholder="請輸入密碼"
                  />
                </b-form-group>
                <b-alert :show="errorMessage.length !== 0" variant="danger">{{ errorMessage }}</b-alert>
                <b-button
                  type="submit"
                  variant="primary"
                  pill
                  block
                >登入</b-button>
                <div class="d-flex justify-content-end">
                  <b-link style="">忘記密碼</b-link>
                </div>
                <hr>
                <b-button block pill variant="dark">以 Google 繼續</b-button>
              </b-form>
            </div>
          </transition>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Login',
  data() {
    return {
      isInChooseMethod: true,
      errorMessage: '',
      email: '',
      password: '',
      isLogin: false,
      form: {
        email: '',
        password: ''
      },
      show: true
    }
  },
  mounted() {
    this.setupFirebase()
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.handleLogin()
      /*
      this.$store.dispatch('user/login', this.form).then(() => {
        this.$router.push({ path: this.redirect || '/' })
      }).catch(() => {
        this.$bvModal.msgBoxOk('帳號或密碼錯誤')
      })*/
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.id = ''
      this.form.password = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    setupFirebase() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log('signed in')
          this.isLogin = true
        } else {
          console.log('signed out')
          this.isLogin = false
        }
      })
    },
    handleSignup: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            console.log(user)
          },
          err => {
            console.log(err.message)
          }
        )
    },
    handleLogin: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(
          user => {
            console.log(user)
          },
          err => {
            this.errorMessage = err.message
            this.$router.push({ path: this.redirect || '/' })
            console.log(err)
          }
        )
    },
    handleLogout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.isLogin ? console.log('logout successfully') : console.log('no user logged in')
        })
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
