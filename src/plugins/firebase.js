import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import { setToken, removeToken, removeUserInfo } from '@/plugins/auth'
import { firebaseConfig } from '../../config/firebaseConfig'

class FirebaseAuth {
  constructor () {
    this.email = ''
    this.password = ''
    this.displayName = ''
    this.isLogin = false
    this.setupFirebase()
  }

  get auth () {
    return this.instance
  }

  setupFirebase () {
    console.log('setupFirebase')
    try {
      if (!firebase.app.length) {
        firebase.initializeApp(firebaseConfig)
      }
      this.instance = firebase.auth()
      const handler = async (user) => {
        if (user) {
          const token = await user.getIdToken()
          const data = {
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
          this.$store.dispatch('user/sendUserInfo', user)
          console.log('signed in')
          this.isLogin = true
        } else {
          console.log('no user logged in')
          this.isLogin = false
        }
      }
      firebase.auth().onAuthStateChanged(handler)
    } catch (error) {
      console.error(error)
    }
  }

  setUserInfo (email, password, displayName = '') {
    this.email = email
    this.password = password
    this.displayName = displayName
  }

  async handleSignup (email, password, displayName) {
    try {
      this.setUserInfo(email, password, displayName)
      const { user } = await this.auth.createUserWithEmailAndPassword(email, password)
      user.updateProfile({
        displayName
      })
      this.$store.dispatch('user/sendUserInfo', user)
      return Promise.resolve(user)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async handleLogin (email, password) {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(email, password)
      this.setUserInfo(email, password, user.displayName)
      this.$store.dispatch('user/sendUserInfo', user)
      setToken(user.idToken)
      return Promise.resolve(user)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  handleLogout () {
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

  async loginWithGoogle () {
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      this.auth.useDeviceLanguage()
      const result = await this.auth.signInWithPopup(provider)
      const idToken = result.credential.idToken
      const user = result.user
      console.log(result)
      this.$store.dispatch('user/sendUserInfo', user)
      setToken(idToken)
      return Promise.resolve(user)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}

Vue.prototype.$firebaseAuth = FirebaseAuth
const FirebaseAuthInstance = new FirebaseAuth()

export default FirebaseAuthInstance
