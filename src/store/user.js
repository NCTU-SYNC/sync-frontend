import { login, getEditPostIds } from '@/api/user'
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
    authenticated: false,
    editPostIds: []
  }
}

export const state = () => { return getDefaultState() }

export const mutations = {
  SET_USER (state, user) {
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
  },
  GET_EDIT_POST_ID (state, payload) {
    state.editPostIds = payload
  }
}

export const actions = {
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
  },
  getEditPostIds ({ commit }, idToken) {
    return new Promise((resolve, reject) => {
      getEditPostIds(idToken).then(response => {
        const { data } = response
        commit('GET_EDIT_POST_ID', data.editPostIds)
        resolve(data.editPostIds)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
