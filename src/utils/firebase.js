import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { removeUserInfo } from '@/utils/auth'
import store from '../store/index'

class FirebaseAuth {
  constructor() {
    this.email = ''
    this.password = ''
    this.displayName = ''
    this.isLogin = false
  }

  get auth() {
    return this.instance
  }

  get token() {
    return this.instance.currentUser.getIdToken()
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

  async setupFirebase() {
    if (process.env.NODE_ENV === 'test') return Promise.resolve()

    await import('/config/firebaseConfig')
      .then(({ firebaseConfig }) => {
        this.instance = initializeApp(firebaseConfig)
      })
      .catch((err) => {
        console.error(err)
      })

    try {
      this.instance = getAuth()
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
      getAuth().onAuthStateChanged(handler)
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
    getAuth()
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
      const provider = new getAuth().GoogleAuthProvider()
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
