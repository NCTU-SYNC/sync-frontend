import { login } from '@/api/user'
import { getToken, setToken, setExpiredTime, setUserInfo, getUserInfo } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    displayName: getUserInfo() ? getUserInfo().displayName : '',
    email: getUserInfo() ? getUserInfo().email : '',
    id: '',
    gender: '',
    photoURL: null,
    authenticated: false
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER (state, user) {
    // state = {
    //   ...state,
    //   authenticated: !!user,
    //   email: user ? user.email : null,
    //   displayName: user ? user.displayName : null,
    //   photoURL: user ? user.photoURL : null
    // }
    state.photoURL = user ? user.photoURL : null
    state.displayName = user ? user.displayName : null
    state.email = user ? user.email : null
    state.authenticated = !!user
  },
  SET_TOKEN (state, payload) {
    state.token = payload
  },
  RESET_USER (state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  sendToken ({ commit }, userdata) {
    return new Promise((resolve, reject) => {
      login(userdata).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', userdata.idToken)
        setToken(userdata.idToken)
        setExpiredTime(Date.now() + 3 * 24 * 60 * 60 * 1000)
        resolve(data.message)
      }).catch(error => {
        reject(error)
      })
    })
  },
  sendUserInfo ({ commit }, userInfo) {
    commit('SET_USER', userInfo)
    setUserInfo(userInfo)
  },
  removeUser ({ commit }) {
    commit('RESET_USER')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
