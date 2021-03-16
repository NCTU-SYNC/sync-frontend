import { login } from '@/api/user'
import { getToken, setToken, setExpiredTime, setUserInfo, getUserInfo } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    displayName: getUserInfo() ? getUserInfo().displayName : '',
    email: getUserInfo() ? getUserInfo().email : '',
    uid: getUserInfo() ? getUserInfo().uid : '',
    gender: '',
    photoURL: null,
    authenticated: false,
    createAt: ''
  }
}

const state = getDefaultState()

const getters = {
  createAt: state => state.createAt
}

const mutations = {
  SET_USER(state, user) {
    console.log(user.metadata)
    state.photoURL = user ? user.photoURL : null
    state.displayName = user ? user.displayName : null
    state.email = user ? user.email : null
    state.authenticated = !!user
    state.createAt = user ? user.metadata.a : ''
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  RESET_USER(state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  sendToken({ commit, dispatch }, userdata) {
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
