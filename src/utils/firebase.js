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
    console.log(this.instance)
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

  handleSignup(email, password) {
    this.setEmailAndPassword(email, password)
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
  }

  handleLogin(email, password) {
    this.setEmailAndPassword(email, password)
    firebase
      .auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(
        result => {
          const { user } = result
          store.dispatch('user/sendUserInfo', user)
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
}

const FirebaseAuthInstance = new FirebaseAuth()
export default FirebaseAuthInstance
