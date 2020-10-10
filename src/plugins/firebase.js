import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import { setToken, removeToken, removeUserInfo, setUserInfo } from '@/utils/auth'
import { firebaseConfig } from '../../config/firebaseConfig'

let app = null
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig)
}
let isLogin = false
let store = null

const setUpFirebase = (storeContext) => {
  try {
    store = storeContext
    if (!store) { throw new Error('SetUpFirebase failed') }
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
        store.dispatch('user/sendToken', data)
        store.dispatch('user/sendUserInfo', user)
        console.log('signed in')
        isLogin = true
      } else {
        console.log('no user logged in')
        isLogin = false
      }
    }
    firebase.auth().onAuthStateChanged(handler)
  } catch (error) {
    console.error(error)
  }
}

const handleSignup = async (email, password, displayName) => {
  try {
    const { user } = await this.auth.createUserWithEmailAndPassword(email, password)
    user.updateProfile({
      displayName
    })
    store.dispatch('user/sendUserInfo', user)
    return Promise.resolve(user)
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

const handleLogin = async (email, password) => {
  try {
    const { user } = await firebase.auth().signInWithEmailAndPassword(email, password)
    setUserInfo(email, password, user.displayName)
    store.dispatch('user/sendUserInfo', user)
    setToken(user.idToken)
    return Promise.resolve(user)
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

const handleLogout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      if (isLogin) {
        removeToken()
        removeUserInfo()
        store.dispatch('user/removeUser')
        console.log('logout successfully')
      }
    })
}

const loginWithGoogle = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    firebase.auth().useDeviceLanguage()
    const result = await firebase.auth().signInWithPopup(provider)
    const idToken = result.credential.idToken
    const user = result.user
    console.log(result)
    store.dispatch('user/sendUserInfo', user)
    setToken(idToken)
    return Promise.resolve(user)
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

Vue.prototype.$firebase = app
export default {
  app,
  isLogin,
  setUpFirebase,
  handleSignup,
  handleLogin,
  handleLogout,
  loginWithGoogle
}
