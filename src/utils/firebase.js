import firebase from 'firebase/app'
import 'firebase/auth'
import { setToken, removeToken, removeUserInfo } from '@/utils/auth'
import { firebaseConfig } from '../../config/firebaseConfig'
import store from '../store/index'

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
      setToken(user.idToken)
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
          removeToken()
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
      const idToken = result.credential.idToken
      const user = result.user
      store.dispatch('user/sendUserInfo', user)
      setToken(idToken)
      return Promise.resolve(user)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const FirebaseAuthInstance = new FirebaseAuth()
export default FirebaseAuthInstance
