import firebase from 'firebase/app'
import 'firebase/auth'
import { setToken, removeToken, removeUserInfo } from '@/utils/auth'
import { firebaseConfig } from '../../config/firebaseConfig'
import store from '../store/index'

class FirebaseAuth {
  constructor() {
    this.email = ''
    this.password = ''
    this.isLogin = false
    firebase.initializeApp(firebaseConfig)
  }

  get auth() {
    return this.instance
  }

  async setupFirebase() {
    console.log('setupFirebase')
    try {
      this.instance = firebase.auth()
      const handler = async(user) => {
        if (user) {
          const token = await user.getIdToken()
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

  setEmailAndPassword(email, password) {
    this.email = email
    this.password = password
  }

  async handleSignup(email, password, displayName) {
    try {
      this.setEmailAndPassword(email, password)
      const { user } = await this.auth.createUserWithEmailAndPassword(email, password)
      user.updateProfile({
        displayName
      })
      console.log(user)
      return Promise.resolve(user)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async handleLogin(email, password) {
    try {
      this.setEmailAndPassword(email, password)
      const userCredential = await this.auth.signInWithEmailAndPassword(this.email, this.password)
      console.log(userCredential)
      store.dispatch('user/sendUserInfo', userCredential.user)
      setToken(userCredential.user.idToken)
      return Promise.resolve(userCredential.user)
    } catch (error) {
      console.log(error)
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
          console.log('logout successfully')
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
      console.log(result)
      store.dispatch('user/sendUserInfo', user)
      setToken(idToken)
      return Promise.resolve(user)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}

const FirebaseAuthInstance = new FirebaseAuth()
export default FirebaseAuthInstance
