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
import { setToken, removeToken, removeUserInfo } from '../utils/auth'

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
    async setupFirebase() {
      // TO DO: CALLBACK HELL USE ASYC AWAIT!!
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // myConsoleLog(user)
          user.getIdToken().then(token => {
            var data = {
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
              isAnonymous: user.isAnonymous,
              uid: user.uid,
              providerData: user.providerData,
              idToken: token
            }
            this.$store.dispatch('user/sendToken', data)
          }).catch(error => {
            console.log(error)
          })
          console.log('signed in')
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
          result => {
            const { user } = result
            this.$store.dispatch('user/sendUserInfo', user)
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
          if (this.isLogin) {
            removeToken()
            removeUserInfo()
            this.$store.dispatch('user/removeUser')
            console.log('logout successfully')
          }
        })
    }
  }
}
</script>

<style>

</style>
