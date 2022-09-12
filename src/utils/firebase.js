import firebase from 'firebase/app'
import 'firebase/auth'
import { removeUserInfo } from '@/utils/auth'
import store from '../store/index'
import { firebaseConfig } from '/config/firebaseConfig'

class FirebaseAuth {
  constructor() {
    try {
      this.app = firebase.initializeApp(firebaseConfig)
    } catch (error) {
      this.app = null
      console.error(error)
    }

    this.email = ''
    this.password = ''
    this.displayName = ''
    this.isLogin = false
  }

  get auth() {
    return this.app.auth()
  }

  get token() {
    return this.auth.currentUser.getIdToken()
  }

  thirdPartyLogins = [
    {
      id: 'google',
      name: 'Google',
      icon: 'google'
    }

    // {
    //   id: 'fb',
    //   name: 'Facebook',
    //   icon: 'facebook'
    // }
  ]

  thirdPartyLoginMethods = new Map([
    ['google', this.loginWithGoogle.bind(this)]
    // ['fb', this.loginWithFacebook.bind(this)]
  ])

  getThirdPartyLoginMethods(id) {
    return this.thirdPartyLoginMethods.get(id)
  }

  async getCurrentUser() {
    return new Promise((res) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe()
        res(user)
      })
    })
  }

  async setupFirebase() {
    if (process.env.NODE_ENV === 'test') return Promise.resolve()

    try {
      const handler = async(user) => {
        if (user) {
          const token = await this.auth.currentUser
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
      const { user } = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      )
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
      const { user } = await this.auth.signInWithEmailAndPassword(
        email,
        password
      )
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
