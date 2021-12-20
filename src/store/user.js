import { login } from '@/api/user'
import { setUserInfo, getUserInfo } from '@/utils/auth'
import FirebaseAuth from '@/utils/firebase.js'

const getDefaultState = () => {
  return {
    isInitialized: false,
    name: '',
    token: '',
    displayName: getUserInfo() ? getUserInfo().displayName : '',
    email: getUserInfo() ? getUserInfo().email : '',
    uid: getUserInfo() ? getUserInfo().uid : '',
    gender: '',
    photoURL: null,
    authenticated: false,
    createAt: '',
    notifications: []
  }
}

const state = getDefaultState()

const getters = {
  createAt: (state) => state.createAt,
  email: (state) => state.email,
  expirationTime: (state) => state.expirationTime
}

const mutations = {
  SET_USER(state, user) {
    state.photoURL = user ? user.photoURL : null
    state.displayName = user ? user.displayName : null
    state.email = user ? user.email : null
    state.authenticated = !!user
    state.createAt = user ? user.metadata.a : ''
    state.uid = user ? user.uid : ''
    state.isInitialized = true
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  RESET_USER(state) {
    Object.assign(state, getDefaultState())
  },
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
  }
}

const actions = {
  sendToken({ commit, dispatch }, userdata) {
    return new Promise((resolve, reject) => {
      login(userdata)
        .then((response) => {
          const { data } = response
          resolve(data.message)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  async getToken({ commit }) {
    /* TODO: pack into interceptor of axios instance */
    if (FirebaseAuth.auth === null) throw new Error('firebase not initialized')
    const token = await FirebaseAuth.token
    commit('SET_TOKEN', token)
    return FirebaseAuth.token
  },
  sendUserInfo({ commit }, userInfo) {
    commit('SET_USER', userInfo)
    setUserInfo(userInfo)
  },
  removeUser({ commit }) {
    commit('RESET_USER')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
