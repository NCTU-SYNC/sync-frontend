<template>
  <b-nav-form @submit.prevent>
    <b-form-input v-model="email" size="sm" class="mr-sm-2" placeholder="信箱" />
    <b-form-input v-model="password" size="sm" class="mr-sm-2" placeholder="密碼" />
    <b-button
      size="sm"
      class="my-2 my-sm-0"
      type="submit"
      @click="handleSignup"
    >註冊</b-button>
    <b-button
      size="sm"
      class="my-2 my-sm-0"
      type="submit"
      @click="handleLogin"
    >登入</b-button>
    <b-button
      size="sm"
      class="my-2 my-sm-0"
      type="submit"
      @click="handleLogout"
    >登出</b-button>
  </b-nav-form>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { setToken } from '../utils/auth'
export default {
  name: 'Auth',
  data() {
    return {
      email: '',
      password: '',
      isLogin: false
    }
  },
  mounted() {
    this.setupFirebase()
  },
  methods: {
    setupFirebase() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log(`current user = ${user}`)
          this.isLogin = true
        } else {
          console.log('no user logged in')
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
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            console.log(user)
            firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
              setToken(idToken)
            }).catch(function(error) {
              console.log(error)
            })
          },
          err => {
            console.log(err.message)
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

<style>

</style>
