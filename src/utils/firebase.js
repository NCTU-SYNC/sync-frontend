import firebase from 'firebase/app'
import 'firebase/auth'
import { removeUserInfo } from '@/utils/auth'
import store from '../store/index'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJ_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}

class FirebaseAuth {
  constructor() {
    this.email = ''
    this.password = ''
    this.displayName = ''
    this.isLogin = false
    firebase.initializeApp(firebaseConfig)
  }

  get auth() {
    return this.instance
  }

  get token() {
    return this.instance.currentUser.getIdToken()
  }

  async setupFirebase() {
    try {
      this.instance = firebase.auth()
      const handler = async(user) => {
        if (user) {
          const token = await this.instance.currentUser
            .getIdToken(/* force refresh */ true)
            .catch((error) => {
              console.error(error)
            })
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
          store.dispatch('user/sendToken', data)
          store.dispatch('user/sendUserInfo', user)
          this.isLogin = true
        } else {
          this.isLogin = false
        }
      }
      firebase.auth().onAuthStateChanged(handler)
    } catch (error) {
      console.error(error)
    }
  }

  setUserInfo(email, password, displayName = '') {
    this.email = email
    this.password = password
    this.displayName = displayName
  }

  async handleSignup(email, password, displayName) {
    try {
      this.setUserInfo(email, password, displayName)
      const { user } = await this.auth.createUserWithEmailAndPassword(email, password)
      user.updateProfile({
        displayName
      })
      store.dispatch('user/sendUserInfo', user)
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async handleLogin(email, password) {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(email, password)
      this.setUserInfo(email, password, user.displayName)
      store.dispatch('user/sendUserInfo', user)
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        if (this.isLogin) {
          removeUserInfo()
          store.dispatch('user/removeUser')
        }
      })
  }

  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      this.auth.useDeviceLanguage()
      const result = await this.auth.signInWithPopup(provider)
      const user = result.user
      store.dispatch('user/sendUserInfo', user)
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const FirebaseAuthInstance = new FirebaseAuth()
export default FirebaseAuthInstance
