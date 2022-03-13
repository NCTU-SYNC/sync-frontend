import { login, updateNameModTime, updateProfilePref } from '@/api/user'
import { setUserInfo, getUserInfo } from '@/utils/auth'
import FirebaseAuth from '@/utils/firebase.js'

/* ! TODO: replace with vuex action [SYNC-154] */
import FirebaseAuthInstance from '@/utils/firebase'

const getDefaultState = () => {
  return {
    isInitialized: false,
    name: '',
    displayName: getUserInfo() ? getUserInfo().displayName : '',
    preferences: getUserInfo()
      ? getUserInfo().preferences
      : {
        isAnonymous: false,
        editedNotification: false,
        subscribedNotification: false
      },
    nameModTime: [],
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
  preferences: (state) => state.preferences,
  nameModTime: (state) => state.nameModTime
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
  RESET_USER(state) {
    Object.assign(state, getDefaultState())
  },
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
  },
  SET_DISPALY_NAME(state, displayName) {
    state.displayName = displayName
    const data = getUserInfo()
    data.displayName = displayName
    setUserInfo(data)
  },
  SET_PREFERENCES(state, preferences) {
    state.preferences = preferences
  },
  SET_NAME_MOD_TIME(state, nameModTime) {
    state.nameModTime = nameModTime
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
    return await FirebaseAuth.token
  },
  sendUserInfo({ commit }, userInfo) {
    commit('SET_USER', userInfo)
    setUserInfo(userInfo)
  },
  removeUser({ commit }) {
    commit('RESET_USER')
  },
  updateDisplayName({ commit }, displayName) {
    commit('SET_DISPALY_NAME', displayName)
    FirebaseAuthInstance.instance.currentUser
      .updateProfile({
        displayName: displayName
      })
      .catch((error) => {
        console.error(error)
      })
    FirebaseAuthInstance.instance.currentUser
      .getIdToken()
      .then((token) => {
        updateNameModTime({
          token: token
        }).then((res) => commit('SET_NAME_MOD_TIME', res.data.data))
      })
      .catch((error) => {
        console.error(error)
      })
  },
  setPreferences({ commit }, preferences) {
    commit('SET_PREFERENCES', preferences)
  },
  updatePreferences({ commit }, preferences) {
    commit('SET_PREFERENCES', preferences)
    FirebaseAuthInstance.instance.currentUser
      .getIdToken()
      .then((token) => {
        updateProfilePref({
          token: token,
          payload: { preferences: preferences }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
